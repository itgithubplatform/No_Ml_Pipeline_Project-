"""
Dataset parsing and validation service.
"""
import pandas as pd
from typing import Dict, Any
from fastapi import HTTPException
from app.models.dataset import DatasetInfo, DatasetPreview
from app.utils.file_handler import get_dataset_path


class DatasetService:
    """Service for dataset operations."""
    
    # In-memory storage for datasets (in production, use Redis or database)
    _datasets: Dict[str, pd.DataFrame] = {}
    _metadata: Dict[str, DatasetInfo] = {}
    
    @classmethod
    def load_dataset(cls, dataset_id: str, file_path: str) -> DatasetInfo:
        """
        Load and parse dataset from file.
        
        Args:
            dataset_id: Unique dataset identifier
            file_path: Path to the dataset file
            
        Returns:
            DatasetInfo object
            
        Raises:
            HTTPException: If file cannot be parsed
        """
        try:
            # Load based on file extension
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file_path)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")
            
            # Store in memory
            cls._datasets[dataset_id] = df
            
            # Extract metadata
            info = DatasetInfo(
                filename=file_path.split('/')[-1],
                rows=len(df),
                columns=len(df.columns),
                column_names=df.columns.tolist(),
                column_types={col: str(dtype) for col, dtype in df.dtypes.items()},
                missing_values={col: int(df[col].isna().sum()) for col in df.columns}
            )
            
            cls._metadata[dataset_id] = info
            return info
            
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error parsing dataset: {str(e)}"
            )
    
    @classmethod
    def get_dataset(cls, dataset_id: str) -> pd.DataFrame:
        """
        Get dataset from memory.
        
        Args:
            dataset_id: Dataset identifier
            
        Returns:
            pandas DataFrame
            
        Raises:
            HTTPException: If dataset not found
        """
        if dataset_id not in cls._datasets:
            raise HTTPException(
                status_code=404,
                detail=f"Dataset not found in memory: {dataset_id}"
            )
        return cls._datasets[dataset_id]
    
    @classmethod
    def get_dataset_info(cls, dataset_id: str) -> DatasetInfo:
        """
        Get dataset metadata.
        
        Args:
            dataset_id: Dataset identifier
            
        Returns:
            DatasetInfo object
        """
        if dataset_id not in cls._metadata:
            raise HTTPException(
                status_code=404,
                detail=f"Dataset metadata not found: {dataset_id}"
            )
        return cls._metadata[dataset_id]
    
    @classmethod
    def get_dataset_preview(cls, dataset_id: str, num_rows: int = 10) -> DatasetPreview:
        """
        Get dataset preview with sample rows.
        
        Args:
            dataset_id: Dataset identifier
            num_rows: Number of rows to preview
            
        Returns:
            DatasetPreview object
        """
        df = cls.get_dataset(dataset_id)
        info = cls.get_dataset_info(dataset_id)
        
        # Get preview rows
        preview_data = df.head(num_rows).fillna("").to_dict(orient='records')
        
        # Get basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        statistics = None
        if numeric_cols:
            statistics = df[numeric_cols].describe().to_dict()
        
        return DatasetPreview(
            info=info,
            preview=preview_data,
            statistics=statistics
        )
    
    @classmethod
    def update_dataset(cls, dataset_id: str, df: pd.DataFrame):
        """
        Update dataset in memory.
        
        Args:
            dataset_id: Dataset identifier
            df: Updated DataFrame
        """
        cls._datasets[dataset_id] = df
        
        # Update metadata
        info = DatasetInfo(
            filename=cls._metadata[dataset_id].filename,
            rows=len(df),
            columns=len(df.columns),
            column_names=df.columns.tolist(),
            column_types={col: str(dtype) for col, dtype in df.dtypes.items()},
            missing_values={col: int(df[col].isna().sum()) for col in df.columns}
        )
        cls._metadata[dataset_id] = info
