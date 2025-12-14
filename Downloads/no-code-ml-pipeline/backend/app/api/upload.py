"""
Dataset upload API endpoint.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.dataset import DatasetUploadResponse
from app.utils.file_handler import save_upload_file
from app.services.dataset_service import DatasetService


router = APIRouter()


@router.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a CSV or Excel dataset.
    
    Args:
        file: Uploaded file
        
    Returns:
        DatasetUploadResponse with dataset info
    """
    try:
        # Save file
        dataset_id, file_path = await save_upload_file(file)
        
        # Load and parse dataset
        info = DatasetService.load_dataset(dataset_id, file_path)
        
        return DatasetUploadResponse(
            success=True,
            message="Dataset uploaded successfully",
            dataset_id=dataset_id,
            info=info
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading dataset: {str(e)}"
        )
