"""
Data preprocessing API endpoints.
"""
from fastapi import APIRouter, HTTPException
from app.models.preprocess import PreprocessRequest, PreprocessResponse
from app.services.preprocess_service import PreprocessService


router = APIRouter()


@router.post("/preprocess", response_model=PreprocessResponse)
async def preprocess_dataset(request: PreprocessRequest):
    """
    Apply preprocessing to dataset.
    
    Args:
        request: Preprocessing configuration
        
    Returns:
        PreprocessResponse with results
    """
    try:
        # Apply scaling
        df, scaled_columns = PreprocessService.apply_scaling(
            dataset_id=request.dataset_id,
            scaler_type=request.scaler_type,
            columns_to_scale=request.columns_to_scale,
            target_column=request.target_column
        )
        
        return PreprocessResponse(
            success=True,
            message=f"Preprocessing applied successfully",
            dataset_id=request.dataset_id,
            scaler_applied=request.scaler_type.value,
            columns_scaled=scaled_columns
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error preprocessing dataset: {str(e)}"
        )
