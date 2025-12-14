"""
Model training API endpoints.
"""
from fastapi import APIRouter, HTTPException
from app.models.model import ModelTrainRequest, ModelTrainResponse
from app.services.model_service import ModelService


router = APIRouter()


@router.post("/train-model", response_model=ModelTrainResponse)
async def train_model(request: ModelTrainRequest):
    """
    Train a machine learning model.
    
    Args:
        request: Model training configuration
        
    Returns:
        ModelTrainResponse with metrics and results
    """
    try:
        # Train model
        results = ModelService.train_model(
            dataset_id=request.dataset_id,
            model_type=request.model_type,
            hyperparameters=request.hyperparameters
        )
        
        return ModelTrainResponse(
            success=True,
            message="Model trained successfully",
            model_id=results['model_id'],
            model_type=results['model_type'],
            accuracy=results['accuracy'],
            precision=results.get('precision'),
            recall=results.get('recall'),
            f1_score=results.get('f1_score'),
            confusion_matrix=results.get('confusion_matrix'),
            feature_importance=results.get('feature_importance')
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error training model: {str(e)}"
        )


@router.get("/model/{model_id}")
async def get_model_results(model_id: str):
    """
    Get results for a trained model.
    
    Args:
        model_id: Model identifier
        
    Returns:
        Model results and metrics
    """
    try:
        model_data = ModelService.get_model(model_id)
        return {
            'model_id': model_id,
            'model_type': model_data['model_type'],
            'metrics': model_data['metrics'],
            'feature_importance': model_data.get('feature_importance'),
            'hyperparameters': model_data.get('hyperparameters', {})
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting model results: {str(e)}"
        )
