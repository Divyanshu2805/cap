import os
import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Google Drive API setup
SERVICE_ACCOUNT_FILE = 'C:\\Users\\divya\\Documents\\bamboo-parsec-440200-h3-82655804a9e9.json'  # Update path if needed
SCOPES = ['https://www.googleapis.com/auth/drive']
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
drive_service = build('drive', 'v3', credentials=credentials)

def upload_file_to_drive(file_path, file_name, description=None):  # Accept description as a parameter
    try:
        # Create file metadata
        file_metadata = {
            'name': file_name,  # Use 'name' instead of 'title' for Google Drive API
            'description': description or ''  # Include description if provided
        }
        media = MediaFileUpload(file_path, mimetype='application/pdf')

        # Upload file to Google Drive
        uploaded_file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        file_id = uploaded_file.get('id')
        logger.info(f"File uploaded to Google Drive with ID: {file_id}")

        # Set file permissions to allow anyone with the link to view it
        permission = {
            'type': 'anyone',
            'role': 'reader',
        }
        drive_service.permissions().create(fileId=file_id, body=permission).execute()

        logger.info(f"File permissions set for file ID: {file_id} to allow public access.")
        return file_id
    except HttpError as error:
        logger.error(f"An error occurred during file upload: {error}")
        return None

def delete_file_from_drive(file_id):
    try:
        drive_service.files().delete(fileId=file_id).execute()
        logger.info(f"File with ID {file_id} deleted from Google Drive.")
    except HttpError as error:
        logger.error(f"An error occurred during file deletion: {error}")

def check_file_exists(file_name):
    try:
        query = f"name='{file_name}' and trashed=false"
        results = drive_service.files().list(q=query, fields="files(id, name)").execute()
        items = results.get('files', [])
        if items:
            logger.info(f"File '{file_name}' already exists with ID: {items[0]['id']}")
            return items[0]['id']  # Return the ID of the existing file
        return None
    except HttpError as error:
        logger.error(f"An error occurred during file existence check: {error}")
        return None