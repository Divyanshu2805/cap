from django.contrib import admin, messages
from django import forms
from django.core.files.storage import default_storage
from django.utils.html import format_html
from .models import Document
from .utils.google_drive import upload_file_to_drive, delete_file_from_drive, check_file_exists
import logging
from django.shortcuts import render
import requests
from django.conf import settings

FASTAPI_BASE_URL = "http://127.0.0.1:8000"

# Logging setup
logger = logging.getLogger(__name__)

# PDFFile form with file upload field
class DocumentForm(forms.ModelForm):
    file = forms.FileField(required=False, help_text="Upload file.")
    description = forms.CharField(widget=forms.Textarea, required=False, help_text="Enter a description.")

    class Meta:
        model = Document
        fields = ['file', 'description']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.google_drive_file_id:
            # Disable the file field if a file is already uploaded
            self.fields['file'].widget.attrs['disabled'] = True  # Disable the file field
            self.fields['file'].help_text = "An existing file is uploaded. Cannot upload a new file."

# PDFFile admin interface
class DocumentAdmin(admin.ModelAdmin):
    def message_user(self, request, message, level=messages.INFO, extra_tags='', fail_silently=False):
        """Override message_user to suppress Django's default messages."""
        # Only display messages if they are custom (add your own condition here)
        if level != messages.SUCCESS:  # Suppress only the success messages, for instance
            super().message_user(request, message, level=level, extra_tags=extra_tags, fail_silently=fail_silently)
        # Custom messages can be handled directly in save_model or delete_queryset methods
        
    form = DocumentForm
    list_display = ('title', 'uploaded_at', 'view_file_link', 'description')
    readonly_fields = ('google_drive_file_id', 'uploaded_at')

    # Enable search functionality
    search_fields = ('title', 'description')  # Fields to be searched

    def save_model(self, request, obj, form, change):
        uploaded_file = form.cleaned_data.get('file')
        if uploaded_file:
            # Check if a file with the same name exists in Google Drive
            existing_file_id = check_file_exists(uploaded_file.name)
            if existing_file_id:
                messages.warning(request, "Upload cancelled. File already exists.")
                return  # Stop the upload process

            # Proceed with the upload
            temp_file_path = default_storage.save(f"temp/{uploaded_file.name}", uploaded_file)
            file_path = default_storage.path(temp_file_path)
            google_drive_file_id = upload_file_to_drive(file_path, uploaded_file.name, form.cleaned_data.get('description'))
            if google_drive_file_id:
                obj.google_drive_file_id = google_drive_file_id
                obj.title = uploaded_file.name
                obj.description = form.cleaned_data.get('description')  # Save the description
                logger.info(f"File {uploaded_file.name} saved with Google Drive ID {google_drive_file_id}.")
                messages.success(request, f"File '{uploaded_file.name}' uploaded to Google Drive.")

                # Call FastAPI endpoint to create embeddings
                try:
                    with open(file_path, "rb") as f:
                        files = {"files": (uploaded_file.name, f, "application/pdf")}
                        response = requests.post(f"{FASTAPI_BASE_URL}/create-embeddings/", files=files)
                        if response.status_code == 200:
                            logger.info(f"Embeddings created for file: {uploaded_file.name}")
                            messages.success(request, f"Embeddings generated for '{uploaded_file.name}'.")
                        else:
                            logger.error(f"Failed to create embeddings: {response.text}")
                            messages.error(request, "Failed to generate embeddings.")
                except Exception as e:
                    logger.error(f"Error during embedding creation: {str(e)}")
                    messages.error(request, "An error occurred while generating embeddings.")
            else:
                messages.error(request, "Failed to upload the file to Google Drive.")
            default_storage.delete(temp_file_path)
        super().save_model(request, obj, form, change)

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            if obj.google_drive_file_id:
                delete_file_from_drive(obj.google_drive_file_id)
                logger.info(f"Deleted file with Google Drive ID {obj.google_drive_file_id} from Google Drive.")

                # Call FastAPI endpoint to delete embeddings
                try:
                    response = requests.delete(f"{FASTAPI_BASE_URL}/delete-embeddings/?title={obj.title}")
                    if response.status_code == 200:
                        logger.info(f"Embeddings deleted for file: {obj.title}")
                        messages.success(request, f"Embeddings deleted for '{obj.title}'.")
                    else:
                        logger.error(f"Failed to delete embeddings: {response.text}")
                        messages.error(request, f"Failed to delete embeddings for '{obj.title}'.")
                except Exception as e:
                    logger.error(f"Error during embedding deletion: {str(e)}")
                    messages.error(request, f"An error occurred while deleting embeddings for '{obj.title}'.")
        queryset.delete()
        messages.success(request, "Selected files were deleted from Google Drive and the database.")

    def view_file_link(self, obj):
        if obj.google_drive_file_id:
            url = f"https://drive.google.com/file/d/{obj.google_drive_file_id}/view"
            return format_html('<a href="{}" target="_blank">View</a>', url)
        return "No file link"
    view_file_link.short_description = 'View File'

admin.site.register(Document, DocumentAdmin)