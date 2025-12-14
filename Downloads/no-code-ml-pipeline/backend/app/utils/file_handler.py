"""
File upload and validation utilities.
"""
import os
import uuid
from pathlib import Path
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.core.config import settings


def validate_file_extension(filename: str) -> bool:
    """
    Validate if file extension is allowed.
    
    Args:
        filename: Name of the uploaded file
        
    Returns:
        True if extension is allowed, False otherwise
    """
    ext = Path(filename).suffix.lower()
    return ext in settings.ALLOWED_EXTENSIONS


def validate_file_size(file: UploadFile) -> bool:
    """
    Validate file size.
    
    Args:
        file: Uploaded file
        
    Returns:
        True if size is within limit
    """
    # Reset file pointer to beginning
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    return file_size <= settings.MAX_UPLOAD_SIZE


async def save_upload_file(file: UploadFile) -> Tuple[str, str]:
    """
    Save uploaded file to disk.
    
    Args:
        file: Uploaded file
        
    Returns:
        Tuple of (dataset_id, file_path)
        
    Raises:
        HTTPException: If file validation fails
    """
    # Validate file extension
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Validate file size
    if not validate_file_size(file):
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique dataset ID
    dataset_id = str(uuid.uuid4())
    
    # Get file extension
    ext = Path(file.filename).suffix
    
    # Create file path
    file_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
    
    # Save file
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving file: {str(e)}"
        )
    finally:
        await file.close()
    
    return dataset_id, file_path


def get_dataset_path(dataset_id: str) -> str:
    """
    Get file path for a dataset ID.
    
    Args:
        dataset_id: Dataset identifier
        
    Returns:
        File path
        
    Raises:
        HTTPException: If dataset not found
    """
    # Check for CSV
    csv_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv")
    if os.path.exists(csv_path):
        return csv_path
    
    # Check for Excel
    xlsx_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.xlsx")
    if os.path.exists(xlsx_path):
        return xlsx_path
    
    xls_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.xls")
    if os.path.exists(xls_path):
        return xls_path
    
    raise HTTPException(
        status_code=404,
        detail=f"Dataset not found: {dataset_id}"
    )
