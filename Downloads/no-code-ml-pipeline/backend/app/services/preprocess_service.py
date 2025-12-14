"""
Data preprocessing service using scikit-learn.
"""
import pandas as pd
from typing import List, Optional, Tuple
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from fastapi import HTTPException

from app.models.preprocess import ScalerType
from app.services.dataset_service import DatasetService


class PreprocessService:
    """Service for data preprocessing operations."""
    
    # Store scalers for each dataset
    _scalers = {}
    
    @classmethod
    def apply_scaling(
        cls,
        dataset_id: str,
        scaler_type: ScalerType,
        columns_to_scale: Optional[List[str]] = None,
        target_column: Optional[str] = None
    ) -> Tuple[pd.DataFrame, List[str]]:
        """
        Apply scaling to dataset.
        
        Args:
            dataset_id: Dataset identifier
            scaler_type: Type of scaler to apply
            columns_to_scale: Specific columns to scale (if None, scale all numeric)
            target_column: Target column to exclude from scaling
            
        Returns:
            Tuple of (scaled DataFrame, list of scaled columns)
            
        Raises:
            HTTPException: If scaling fails
        """
        try:
            # Get dataset
            df = DatasetService.get_dataset(dataset_id).copy()
            
            # If no scaler, return original
            if scaler_type == ScalerType.NONE:
                return df, []
            
            # Determine columns to scale
            if columns_to_scale is None:
                # Scale all numeric columns except target
                numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
                if target_column and target_column in numeric_cols:
                    numeric_cols.remove(target_column)
                columns_to_scale = numeric_cols
            
            # Validate columns exist
            missing_cols = set(columns_to_scale) - set(df.columns)
            if missing_cols:
                raise HTTPException(
                    status_code=400,
                    detail=f"Columns not found in dataset: {missing_cols}"
                )
            
            # Check if columns are numeric
            non_numeric = [col for col in columns_to_scale 
                          if not pd.api.types.is_numeric_dtype(df[col])]
            if non_numeric:
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot scale non-numeric columns: {non_numeric}"
                )
            
            # Initialize scaler
            if scaler_type == ScalerType.STANDARD:
                scaler = StandardScaler()
            elif scaler_type == ScalerType.MINMAX:
                scaler = MinMaxScaler()
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported scaler type: {scaler_type}"
                )
            
            # Apply scaling
            df[columns_to_scale] = scaler.fit_transform(df[columns_to_scale])
            
            # Store scaler
            cls._scalers[dataset_id] = {
                'scaler': scaler,
                'type': scaler_type,
                'columns': columns_to_scale
            }
            
            # Update dataset in memory
            DatasetService.update_dataset(dataset_id, df)
            
            return df, columns_to_scale
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error applying scaling: {str(e)}"
            )
    
    @classmethod
    def handle_missing_values(
        cls,
        dataset_id: str,
        strategy: str = 'drop'
    ) -> pd.DataFrame:
        """
        Handle missing values in dataset.
        
        Args:
            dataset_id: Dataset identifier
            strategy: Strategy for handling missing values ('drop', 'mean', 'median', 'mode')
            
        Returns:
            DataFrame with missing values handled
        """
        df = DatasetService.get_dataset(dataset_id).copy()
        
        if strategy == 'drop':
            df = df.dropna()
        elif strategy == 'mean':
            numeric_cols = df.select_dtypes(include=['number']).columns
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
        elif strategy == 'median':
            numeric_cols = df.select_dtypes(include=['number']).columns
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        elif strategy == 'mode':
            for col in df.columns:
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else None)
        
        DatasetService.update_dataset(dataset_id, df)
        return df
