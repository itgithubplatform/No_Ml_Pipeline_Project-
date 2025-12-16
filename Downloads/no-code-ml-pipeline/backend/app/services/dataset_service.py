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
        Get dataset from memory, reload from disk if necessary.
        
        Args:
            dataset_id: Dataset identifier
            
        Returns:
            pandas DataFrame
            
        Raises:
            HTTPException: If dataset not found
        """
        # Check if in memory
        if dataset_id in cls._datasets:
            return cls._datasets[dataset_id]
        
        # Try to reload from disk
        try:
            print(f"Dataset {dataset_id} not in memory, attempting to reload from disk...")
            file_path = get_dataset_path(dataset_id)
            
            # Load based on file extension
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file_path)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format")
            
            # Store in memory
            cls._datasets[dataset_id] = df
            
            # Recreate metadata if missing
            if dataset_id not in cls._metadata:
                info = DatasetInfo(
                    filename=file_path.split('/')[-1].split('\\')[-1],
                    rows=len(df),
                    columns=len(df.columns),
                    column_names=df.columns.tolist(),
                    column_types={col: str(dtype) for col, dtype in df.dtypes.items()},
                    missing_values={col: int(df[col].isna().sum()) for col in df.columns}
                )
                cls._metadata[dataset_id] = info
            
            print(f"Successfully reloaded dataset {dataset_id} from disk")
            return df
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=f"Dataset not found: {dataset_id}. Error: {str(e)}"
            )
    
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
        
        # Get preview rows (replace NaN with None for JSON serialization)
        preview_data = df.head(num_rows).where(pd.notnull(df.head(num_rows)), None).to_dict(orient='records')
        
        # Get basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        statistics = None
        if numeric_cols:
            statistics = df[numeric_cols].describe().to_dict()
        
        # Categorize columns by type
        column_categories = {}
        unique_counts = {}
        
        for col in df.columns:
            # Count unique values
            unique_counts[col] = int(df[col].nunique())
            
            # Categorize column type
            if pd.api.types.is_numeric_dtype(df[col]):
                column_categories[col] = 'numeric'
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                column_categories[col] = 'datetime'
            else:
                column_categories[col] = 'categorical'
        
        return DatasetPreview(
            info=info,
            preview=preview_data,
            statistics=statistics,
            column_categories=column_categories,
            unique_counts=unique_counts
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
    
    @classmethod
    def set_target_column(cls, dataset_id: str, target_column: str) -> Dict[str, Any]:
        """
        Set and validate target column for ML.
        
        Args:
            dataset_id: Dataset identifier
            target_column: Name of target column
            
        Returns:
            Validation result with warnings/suggestions
        """
        df = cls.get_dataset(dataset_id)
        
        # Validate column exists
        if target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Column '{target_column}' not found in dataset"
            )
        
        # Get column info
        unique_values = int(df[target_column].nunique())
        data_type = str(df[target_column].dtype)
        
        # Validation logic
        is_valid = True
        warning = None
        suggestion = None
        
        # Too many unique values for classification
        if unique_values > 50:
            warning = f"Column has {unique_values} unique values. This may not be suitable for classification."
            suggestion = "Consider using a regression model instead, or bin the values into categories."
        
        # Too few samples per class
        elif unique_values > 2:
            value_counts = df[target_column].value_counts()
            min_samples = value_counts.min()
            if min_samples < 5:
                warning = f"Some classes have very few samples (minimum: {min_samples})."
                suggestion = "Consider collecting more data or combining rare classes."
        
        # All values are the same
        if unique_values == 1:
            is_valid = False
            warning = "All values are identical. Cannot train a classifier."
            suggestion = "This column cannot be used as a target."
        
        # Update metadata
        if dataset_id in cls._metadata:
            cls._metadata[dataset_id].target_column = target_column
        
        return {
            'is_valid': is_valid,
            'column_name': target_column,
            'unique_values': unique_values,
            'data_type': data_type,
            'warning': warning,
            'suggestion': suggestion
        }
    
    @classmethod
    def get_target_recommendations(cls, dataset_id: str) -> Dict[str, Any]:
        """
        Get recommended target columns based on data analysis.
        
        Args:
            dataset_id: Dataset identifier
            
        Returns:
            List of recommended columns with scores
        """
        df = cls.get_dataset(dataset_id)
        recommendations = []
        
        for col in df.columns:
            unique_values = df[col].nunique()
            is_numeric = pd.api.types.is_numeric_dtype(df[col])
            
            # Score based on suitability for classification
            score = 0
            reason = ""
            
            # Ideal: 2-10 unique values
            if 2 <= unique_values <= 10:
                score = 100
                reason = "Perfect for classification"
            # Good: 11-20 unique values
            elif 11 <= unique_values <= 20:
                score = 80
                reason = "Good for classification"
            # Okay: 21-50 unique values
            elif 21 <= unique_values <= 50:
                score = 60
                reason = "Acceptable for classification"
            # Not ideal: 1 or >50 unique values
            elif unique_values == 1:
                score = 0
                reason = "All values are the same"
            else:
                score = 30
                reason = "Too many unique values"
            
            # Boost score for categorical/object types
            if not is_numeric and score > 0:
                score = min(score + 10, 100)
            
            if score >= 50:  # Only recommend decent options
                recommendations.append({
                    'column': col,
                    'score': score,
                    'unique_values': unique_values,
                    'reason': reason
                })
        
        # Sort by score descending
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            'recommendations': recommendations[:5],  # Top 5
            'total_columns': len(df.columns)
        }

