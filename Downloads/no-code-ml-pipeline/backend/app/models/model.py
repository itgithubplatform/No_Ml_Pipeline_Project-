"""
Pydantic models for ML model operations.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum


class ModelType(str, Enum):
    """Supported ML model types."""
    LOGISTIC_REGRESSION = "logistic_regression"
    DECISION_TREE = "decision_tree"


class TrainTestSplitRequest(BaseModel):
    """Request for train-test split."""
    dataset_id: str
    test_size: float = Field(default=0.3, ge=0.1, le=0.5)
    target_column: str
    random_state: Optional[int] = 42


class TrainTestSplitResponse(BaseModel):
    """Response after train-test split."""
    success: bool
    message: str
    dataset_id: str
    train_size: int
    test_size: int
    target_column: str


class ModelTrainRequest(BaseModel):
    """Request for model training."""
    dataset_id: str
    model_type: ModelType
    target_column: str
    hyperparameters: Optional[Dict[str, Any]] = None


class ModelTrainResponse(BaseModel):
    """Response after model training."""
    success: bool
    message: str
    model_id: str
    model_type: str
    accuracy: float
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    confusion_matrix: Optional[list] = None
    feature_importance: Optional[Dict[str, float]] = None
