from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    google_drive_file_id = models.CharField(max_length=255, unique=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)  # Include description field

    def __str__(self):
        return self.title