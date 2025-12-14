"""
Pydantic models for dataset operations.
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class DatasetInfo(BaseModel):
    """Dataset information response."""
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    column_types: Dict[str, str]
    missing_values: Dict[str, int]
    target_column: Optional[str] = None
    

class DatasetUploadResponse(BaseModel):
    """Response after dataset upload."""
    success: bool
    message: str
    dataset_id: str
    info: Optional[DatasetInfo] = None


class DatasetPreview(BaseModel):
    """Dataset preview with sample rows."""
    info: DatasetInfo
    preview: List[Dict[str, Any]] = Field(description="First 10 rows of data")
    statistics: Optional[Dict[str, Any]] = None
    column_categories: Optional[Dict[str, str]] = Field(default=None, description="Column type categories (numeric, categorical, datetime)")
    unique_counts: Optional[Dict[str, int]] = Field(default=None, description="Number of unique values per column")
