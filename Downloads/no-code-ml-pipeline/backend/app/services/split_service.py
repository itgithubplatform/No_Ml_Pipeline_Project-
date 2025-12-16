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
            print(f"\n--- TRAIN-TEST SPLIT ---")
            print(f"Dataset ID: {dataset_id}")
            print(f"Target Column: {target_column}")
            print(f"Test Size: {test_size}")
            
            # Get dataset
            print(f"Loading dataset...")
            df = DatasetService.get_dataset(dataset_id)
            print(f"✓ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
            
            # Validate target column exists
            if target_column not in df.columns:
                print(f"✗ Target column '{target_column}' not found!")
                raise HTTPException(
                    status_code=400,
                    detail=f"Target column '{target_column}' not found in dataset. Available: {list(df.columns)}"
                )
            print(f"✓ Target column '{target_column}' found")
            
            # Validate test_size
            if not 0.1 <= test_size <= 0.5:
                raise HTTPException(
                    status_code=400,
                    detail="test_size must be between 0.1 and 0.5"
                )
            
            # Separate features and target
            X = df.drop(columns=[target_column])
            y = df[target_column]
            print(f"✓ Features shape: {X.shape}, Target shape: {y.shape}")
            
            # Automatic preprocessing: encode categorical columns
            print(f"\nStep: Preprocessing categorical columns...")
            categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
            
            if categorical_cols:
                print(f"✓ Found {len(categorical_cols)} categorical columns: {categorical_cols}")
                from sklearn.preprocessing import LabelEncoder
                
                for col in categorical_cols:
                    try:
                        le = LabelEncoder()
                        # Handle NaN values by converting to string first
                        X[col] = X[col].fillna('missing')
                        X[col] = le.fit_transform(X[col].astype(str))
                        print(f"  ✓ Encoded '{col}' ({len(le.classes_)} unique values)")
                    except Exception as e:
                        print(f"  ✗ Failed to encode '{col}': {str(e)}")
                        raise
            else:
                print(f"✓ No categorical columns found")
            
            # Handle missing values in numeric columns
            numeric_cols = X.select_dtypes(include=['number']).columns.tolist()
            if numeric_cols:
                missing_counts = X[numeric_cols].isna().sum()
                if missing_counts.sum() > 0:
                    print(f"\nStep: Handling missing values...")
                    print(f"  Found missing values in: {missing_counts[missing_counts > 0].to_dict()}")
                    # Fill numeric missing values with median
                    for col in numeric_cols:
                        if X[col].isna().sum() > 0:
                            median_val = X[col].median()
                            X[col] = X[col].fillna(median_val)
                            print(f"  ✓ Filled '{col}' missing values with median: {median_val}")
            
            # Handle missing values in target
            if y.isna().sum() > 0:
                print(f"\nWarning: Target column has {y.isna().sum()} missing values. Dropping these rows...")
                valid_indices = ~y.isna()
                X = X[valid_indices]
                y = y[valid_indices]
                print(f"✓ New shape after dropping NaN targets: {X.shape}")
            
            print(f"\n✓ Preprocessing completed. All data is now numeric.")
            print(f"Final X dtypes:\n{X.dtypes}")
            
            # Use default random state if not provided
            if random_state is None:
                random_state = settings.RANDOM_STATE
            
            # Perform split - try stratified first, fall back to non-stratified
            try:
                # Try stratified split for classification
                if cls._is_classification_target(y):
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y,
                        test_size=test_size,
                        random_state=random_state,
                        stratify=y
                    )
                else:
                    # Non-stratified for regression
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y,
                        test_size=test_size,
                        random_state=random_state
                    )
            except ValueError:
                # If stratified fails (too few samples), use non-stratified
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y,
                    test_size=test_size,
                    random_state=random_state
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
