"""
Dataset information API endpoints.
"""
from fastapi import APIRouter, HTTPException
from app.models.dataset import DatasetInfo, DatasetPreview
from app.services.dataset_service import DatasetService


router = APIRouter()


@router.get("/dataset/{dataset_id}/info", response_model=DatasetInfo)
async def get_dataset_info(dataset_id: str):
    """
    Get dataset information.
    
    Args:
        dataset_id: Dataset identifier
        
    Returns:
        DatasetInfo object
    """
    try:
        return DatasetService.get_dataset_info(dataset_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting dataset info: {str(e)}"
        )


@router.get("/dataset/{dataset_id}/preview", response_model=DatasetPreview)
async def get_dataset_preview(dataset_id: str, num_rows: int = 10):
    """
    Get dataset preview with sample rows.
    
    Args:
        dataset_id: Dataset identifier
        num_rows: Number of rows to preview (default: 10)
        
    Returns:
        DatasetPreview object
    """
    try:
        return DatasetService.get_dataset_preview(dataset_id, num_rows)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting dataset preview: {str(e)}"
        )
