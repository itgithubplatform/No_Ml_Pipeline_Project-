"""
Pydantic models for target column operations.
"""
from pydantic import BaseModel
from typing import Optional


class SetTargetRequest(BaseModel):
    """Request to set target column."""
    dataset_id: str
    target_column: str


class TargetValidation(BaseModel):
    """Target column validation response."""
    is_valid: bool
    column_name: str
    unique_values: int
    data_type: str
    warning: Optional[str] = None
    suggestion: Optional[str] = None
