"""
Train-test split service.
"""
import pandas as pd
from typing import Tuple, Dict, Any
from sklearn.model_selection import train_test_split
from fastapi import HTTPException

from app.services.dataset_service import DatasetService
from app.core.config import settings


class SplitService:
    """Service for train-test split operations."""
    
    # Store split data for each dataset
    _splits: Dict[str, Dict[str, Any]] = {}
    
    @classmethod
    def perform_split(
        cls,
        dataset_id: str,
        target_column: str,
        test_size: float = 0.3,
        random_state: int = None
    ) -> Tuple[int, int]:
        """
        Perform train-test split on dataset.
        
        Args:
            dataset_id: Dataset identifier
            target_column: Name of the target column
            test_size: Proportion of dataset for testing (0.1 to 0.5)
            random_state: Random seed for reproducibility
            
        Returns:
            Tuple of (train_size, test_size)
            
        Raises:
            HTTPException: If split fails
        """
        try:
            # Get dataset
            df = DatasetService.get_dataset(dataset_id)
            
            # Validate target column exists
            if target_column not in df.columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Target column '{target_column}' not found in dataset"
                )
            
            # Validate test_size
            if not 0.1 <= test_size <= 0.5:
                raise HTTPException(
                    status_code=400,
                    detail="test_size must be between 0.1 and 0.5"
                )
            
            # Separate features and target
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # Use default random state if not provided
            if random_state is None:
                random_state = settings.RANDOM_STATE
            
            # Perform split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y,
                test_size=test_size,
                random_state=random_state,
                stratify=y if cls._is_classification_target(y) else None
            )
            
            # Store split data
            cls._splits[dataset_id] = {
                'X_train': X_train,
                'X_test': X_test,
                'y_train': y_train,
                'y_test': y_test,
                'target_column': target_column,
                'test_size': test_size,
                'random_state': random_state
            }
            
            return len(X_train), len(X_test)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error performing train-test split: {str(e)}"
            )
    
    @classmethod
    def get_split_data(cls, dataset_id: str) -> Dict[str, Any]:
        """
        Get split data for a dataset.
        
        Args:
            dataset_id: Dataset identifier
            
        Returns:
            Dictionary containing split data
            
        Raises:
            HTTPException: If split data not found
        """
        if dataset_id not in cls._splits:
            raise HTTPException(
                status_code=404,
                detail=f"No split data found for dataset: {dataset_id}. Please perform split first."
            )
        return cls._splits[dataset_id]
    
    @classmethod
    def _is_classification_target(cls, y: pd.Series) -> bool:
        """
        Determine if target is for classification task.
        
        Args:
            y: Target series
            
        Returns:
            True if classification, False otherwise
        """
        # If target is object/string, it's classification
        if y.dtype == 'object':
            return True
        
        # If numeric but has few unique values, likely classification
        unique_count = y.nunique()
        total_count = len(y)
        
        return unique_count < 20 or unique_count / total_count < 0.05
