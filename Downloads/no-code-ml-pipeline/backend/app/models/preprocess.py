"""
Pydantic models for preprocessing operations.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class ScalerType(str, Enum):
    """Supported scaler types."""
    STANDARD = "standard"
    MINMAX = "minmax"
    NONE = "none"


class PreprocessRequest(BaseModel):
    """Request for preprocessing operations."""
    dataset_id: str
    scaler_type: ScalerType = Field(default=ScalerType.NONE)
    columns_to_scale: Optional[List[str]] = None
    target_column: Optional[str] = None


class PreprocessResponse(BaseModel):
    """Response after preprocessing."""
    success: bool
    message: str
    dataset_id: str
    scaler_applied: str
    columns_scaled: List[str]
