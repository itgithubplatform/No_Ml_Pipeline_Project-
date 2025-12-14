"""
Train-test split API endpoints.
"""
from fastapi import APIRouter, HTTPException
from app.models.model import TrainTestSplitRequest, TrainTestSplitResponse
from app.services.split_service import SplitService


router = APIRouter()


@router.post("/train-test-split", response_model=TrainTestSplitResponse)
async def perform_train_test_split(request: TrainTestSplitRequest):
    """
    Perform train-test split on dataset.
    
    Args:
        request: Split configuration
        
    Returns:
        TrainTestSplitResponse with split sizes
    """
    try:
        # Perform split
        train_size, test_size = SplitService.perform_split(
            dataset_id=request.dataset_id,
            target_column=request.target_column,
            test_size=request.test_size,
            random_state=request.random_state
        )
        
        return TrainTestSplitResponse(
            success=True,
            message="Train-test split completed successfully",
            dataset_id=request.dataset_id,
            train_size=train_size,
            test_size=test_size,
            target_column=request.target_column
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing train-test split: {str(e)}"
        )
