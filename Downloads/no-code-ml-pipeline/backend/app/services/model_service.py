"""
ML model training and evaluation service.
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, confusion_matrix,
    mean_squared_error, mean_absolute_error, r2_score
)
from fastapi import HTTPException

from app.models.model import ModelType
from app.services.split_service import SplitService


class ModelService:
    """Service for ML model training and evaluation."""
    
    # Store trained models
    _models: Dict[str, Dict[str, Any]] = {}
    
    @classmethod
    def train_model(
        cls,
        dataset_id: str,
        model_type: ModelType,
        target_column: str,
        hyperparameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Train ML model on dataset.
        
        Args:
            dataset_id: Dataset identifier
            model_type: Type of model to train
            target_column: Name of the target column
            hyperparameters: Optional model hyperparameters
            
        Returns:
            Dictionary with training results and metrics
            
        Raises:
            HTTPException: If training fails
        """
        try:
            print(f"\n{'='*60}")
            print(f"TRAINING MODEL - Start")
            print(f"Dataset ID: {dataset_id}")
            print(f"Model Type: {model_type}")
            print(f"Target Column: {target_column}")
            print(f"{'='*60}\n")
            
            # Get split data - if not exists, perform split first
            try:
                print("Step 1: Getting split data...")
                split_data = SplitService.get_split_data(dataset_id)
                print(f"✓ Split data found in memory")
            except HTTPException as e:
                if e.status_code == 404:
                    # Split hasn't been performed yet - do it now with defaults
                    print(f"✗ No split data found. Performing automatic split...")
                    SplitService.perform_split(
                        dataset_id=dataset_id,
                        target_column=target_column,
                        test_size=0.3,
                        random_state=42
                    )
                    split_data = SplitService.get_split_data(dataset_id)
                    print(f"✓ Automatic split completed")
                else:
                    print(f"✗ Error getting split data: {e.detail}")
                    raise
            
            print(f"Step 2: Extracting train/test data...")
            X_train = split_data['X_train']
            X_test = split_data['X_test']
            y_train = split_data['y_train']
            y_test = split_data['y_test']
            print(f"✓ Train shape: {X_train.shape}, Test shape: {X_test.shape}")
            
            # Detect task type (regression vs classification)
            print(f"\nStep 3: Detecting task type...")
            is_regression = cls._is_regression_task(y_train)
            task_type = "regression" if is_regression else "classification"
            print(f"✓ Detected task type: {task_type.upper()}")
            print(f"  Target unique values: {y_train.nunique()}")
            print(f"  Target dtype: {y_train.dtype}")
            
            # Initialize model based on task type
            print(f"Step 4: Initializing {model_type.value} model for {task_type}...")
            if model_type == ModelType.LOGISTIC_REGRESSION:
                if is_regression:
                    print(f"  → Using Linear Regression (continuous target)")
                    model = cls._create_linear_regression(hyperparameters)
                else:
                    print(f"  → Using Logistic Regression (discrete target)")
                    model = cls._create_logistic_regression(hyperparameters)
            elif model_type == ModelType.DECISION_TREE:
                if is_regression:
                    print(f"  → Using Decision Tree Regressor (continuous target)")
                    model = cls._create_decision_tree_regressor(hyperparameters)
                else:
                    print(f"  → Using Decision Tree Classifier (discrete target)")
                    model = cls._create_decision_tree_classifier(hyperparameters)
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported model type: {model_type}"
                )
            print(f"✓ Model initialized")
            
            # Hyperparameter tuning
            print(f"\nStep 5: Hyperparameter tuning with GridSearchCV...")
            
            # Define parameter grids
            param_grid = cls._get_param_grid(model_type, is_regression)
            
            # Perform grid search only if there are parameters to tune
            try:
                if param_grid:
                    print(f"  Searching for best parameters to maximize performance...")
                    print(f"  Parameter grid: {param_grid}")
                    
                    scoring = 'r2' if is_regression else 'accuracy'
                    grid_search = GridSearchCV(
                        estimator=model,
                        param_grid=param_grid,
                        cv=5,  # 5-fold cross-validation
                        scoring=scoring,
                        n_jobs=-1,  # Use all CPU cores
                        verbose=0
                    )
                    
                    grid_search.fit(X_train, y_train)
                    
                    # Get best model
                    model = grid_search.best_estimator_
                    best_params = grid_search.best_params_
                    best_score = grid_search.best_score_
                    
                    print(f"✓ Hyperparameter tuning completed!")
                    print(f"  Best parameters: {best_params}")
                    print(f"  Best CV {scoring}: {best_score:.4f}")
                    
                    # Store best params for return
                    hyperparameters = best_params
                else:
                    # No hyperparameters to tune (e.g., Linear Regression)
                    print(f"  No hyperparameters to tune for this model. Training directly...")
                    model.fit(X_train, y_train)
                    print(f"✓ Model training completed!")
                
            except Exception as fit_error:
                print(f"✗ HYPERPARAMETER TUNING FAILED!")
                print(f"Error: {str(fit_error)}")
                print(f"\nDEBUG INFO:")
                print(f"X_train dtypes:\n{X_train.dtypes}")
                print(f"\nX_train sample:\n{X_train.head()}")
                print(f"y_train dtype: {y_train.dtype}")
                print(f"y_train sample:\n{y_train.head()}")
                raise
            
            # Make predictions
            print(f"Step 6: Making predictions on test set...")
            y_pred = model.predict(X_test)
            print(f"✓ Predictions completed")
            
            # Calculate metrics based on task type
            print(f"Step 7: Calculating {task_type} metrics...")
            if is_regression:
                metrics = cls._calculate_regression_metrics(y_test, y_pred)
                print(f"✓ Regression Metrics:")
                print(f"  - R² Score: {metrics['r2_score']:.4f}")
                print(f"  - RMSE: {metrics['rmse']:.4f}")
                print(f"  - MAE: {metrics['mae']:.4f}")
            else:
                metrics = cls._calculate_classification_metrics(y_test, y_pred)
                print(f"✓ Classification Metrics:")
                print(f"  - Accuracy: {metrics['accuracy']:.4f}")
            
            # Add feature importance for Decision Tree
            feature_importance = None
            if model_type == ModelType.DECISION_TREE:
                feature_importance = dict(zip(
                    X_train.columns,
                    model.feature_importances_.tolist()
                ))
            
            # Generate model ID
            model_id = f"{dataset_id}_{model_type.value}"
            
            # Store model and results
            cls._models[model_id] = {
                'model': model,
                'model_type': model_type.value,
                'dataset_id': dataset_id,
                'metrics': metrics,
                'feature_importance': feature_importance,
                'hyperparameters': hyperparameters or {}
            }
            
            print(f"✓ Model stored with ID: {model_id}")
            print(f"{'='*60}")
            print(f"TRAINING MODEL - Success!")
            print(f"{'='*60}\n")
            
            return {
                'model_id': model_id,
                'model_type': model_type.value,
                'accuracy': metrics['accuracy'],
                'precision': metrics.get('precision'),
                'recall': metrics.get('recall'),
                'f1_score': metrics.get('f1_score'),
                'confusion_matrix': metrics['confusion_matrix'],
                'class_labels': metrics['class_labels'],
                'feature_importance': feature_importance
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error training model: {str(e)}"
            )
    
    @classmethod
    def _get_param_grid(cls, model_type: ModelType, is_regression: bool) -> Dict[str, list]:
        """
        Get hyperparameter grid for tuning.
        
        Args:
            model_type: Type of model
            is_regression: Whether this is a regression task
            
        Returns:
            Dictionary of parameter ranges to search
        """
        if model_type == ModelType.LOGISTIC_REGRESSION:
            if is_regression:
                # Linear Regression (no hyperparameters to tune)
                return {}
            else:
                # Logistic Regression
                return {
                    'C': [0.001, 0.01, 0.1, 1.0, 10.0, 100.0],
                    'penalty': ['l2'],
                    'solver': ['lbfgs', 'liblinear'],
                    'max_iter': [1000, 2000]
                }
        
        elif model_type == ModelType.DECISION_TREE:
            if is_regression:
                # Decision Tree Regressor
                return {
                    'max_depth': [3, 5, 7, 10, 15, 20, None],
                    'min_samples_split': [2, 5, 10, 20],
                    'min_samples_leaf': [1, 2, 4, 8],
                    'max_features': ['sqrt', 'log2', None],
                    'splitter': ['best', 'random']
                }
            else:
                # Decision Tree Classifier
                return {
                    'max_depth': [3, 5, 7, 10, 15, 20, None],
                    'min_samples_split': [2, 5, 10, 20],
                    'min_samples_leaf': [1, 2, 4, 8],
                    'criterion': ['gini', 'entropy'],
                    'max_features': ['sqrt', 'log2', None],
                    'splitter': ['best', 'random']
                }
        
        return {}
    
    @classmethod
    def _create_logistic_regression(
        cls,
        hyperparameters: Optional[Dict[str, Any]]
    ) -> LogisticRegression:
        """Create Logistic Regression model."""
        params = hyperparameters or {}
        return LogisticRegression(
            max_iter=params.get('max_iter', 1000),
            random_state=params.get('random_state', 42),
            C=params.get('C', 1.0)
        )
    
    @classmethod
    def _create_linear_regression(
        cls,
        hyperparameters: Optional[Dict[str, Any]]
    ) -> LinearRegression:
        """Create Linear Regression model."""
        return LinearRegression()
    
    @classmethod
    def _create_decision_tree_classifier(
        cls,
        hyperparameters: Optional[Dict[str, Any]]
    ) -> DecisionTreeClassifier:
        """Create Decision Tree Classifier model."""
        params = hyperparameters or {}
        return DecisionTreeClassifier(
            max_depth=params.get('max_depth', None),
            min_samples_split=params.get('min_samples_split', 2),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            random_state=params.get('random_state', 42)
        )
    
    @classmethod
    def _create_decision_tree_regressor(
        cls,
        hyperparameters: Optional[Dict[str, Any]]
    ) -> DecisionTreeRegressor:
        """Create Decision Tree Regressor model."""
        params = hyperparameters or {}
        return DecisionTreeRegressor(
            max_depth=params.get('max_depth', None),
            min_samples_split=params.get('min_samples_split', 2),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            random_state=params.get('random_state', 42)
        )
    
    @classmethod
    def _is_regression_task(cls, y: pd.Series) -> bool:
        """
        Determine if this is a regression task based on target values.
        
        Args:
            y: Target series
            
        Returns:
            True if regression, False if classification
        """
        # If target is float and has many unique values, it's regression
        if pd.api.types.is_float_dtype(y):
            unique_ratio = y.nunique() / len(y)
            # If more than 5% of values are unique, likely regression
            return unique_ratio > 0.05
        
        # If integer but has many unique continuous-like values
        if pd.api.types.is_integer_dtype(y):
            unique_count = y.nunique()
            # If more than 20 unique values, likely regression  
            return unique_count > 20
        
        # Otherwise classification
        return False
    
    @classmethod
    def _calculate_classification_metrics(
        cls,
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, Any]:
        """Calculate classification metrics."""
        metrics = {
            'accuracy': float(accuracy_score(y_true, y_pred)),
            'confusion_matrix': confusion_matrix(y_true, y_pred).tolist(),
            'class_labels': [str(label) for label in sorted(np.unique(y_true))]
        }
        
        # Calculate precision, recall, f1 (handle binary and multiclass)
        try:
            metrics['precision'] = float(precision_score(y_true, y_pred, average='binary'))
            metrics['recall'] = float(recall_score(y_true, y_pred, average='binary'))
            metrics['f1_score'] = float(f1_score(y_true, y_pred, average='binary'))
        except:
            metrics['precision'] = float(precision_score(y_true, y_pred, average='weighted'))
            metrics['recall'] = float(recall_score(y_true, y_pred, average='weighted'))
            metrics['f1_score'] = float(f1_score(y_true, y_pred, average='weighted'))
        
        return metrics
    
    @classmethod
    def _calculate_regression_metrics(
        cls,
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, Any]:
        """Calculate regression metrics."""
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_true, y_pred)
        r2 = r2_score(y_true, y_pred)
        
        return {
            'accuracy': float(r2),  # Use R² as "accuracy" for consistency
            'r2_score': float(r2),
            'mse': float(mse),
            'rmse': float(rmse),
            'mae': float(mae),
            'confusion_matrix': None,
            'class_labels': None,
            'precision': None,
            'recall': None,
            'f1_score': None
        }
    
    @classmethod
    def _calculate_metrics(
        cls,
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, Any]:
        """
        Calculate evaluation metrics.
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            
        Returns:
            Dictionary of metrics
        """
        metrics = {
            'accuracy': float(accuracy_score(y_true, y_pred)),
            'confusion_matrix': confusion_matrix(y_true, y_pred).tolist(),
            'class_labels': [str(label) for label in sorted(np.unique(y_true))]
        }
        
        # Calculate precision, recall, f1 (handle binary and multiclass)
        try:
            # Try binary first
            metrics['precision'] = float(precision_score(y_true, y_pred, average='binary'))
            metrics['recall'] = float(recall_score(y_true, y_pred, average='binary'))
            metrics['f1_score'] = float(f1_score(y_true, y_pred, average='binary'))
        except:
            # Fall back to weighted average for multiclass
            metrics['precision'] = float(precision_score(y_true, y_pred, average='weighted'))
            metrics['recall'] = float(recall_score(y_true, y_pred, average='weighted'))
            metrics['f1_score'] = float(f1_score(y_true, y_pred, average='weighted'))
        
        return metrics
    
    @classmethod
    def get_model(cls, model_id: str) -> Dict[str, Any]:
        """
        Get trained model and its results.
        
        Args:
            model_id: Model identifier
            
        Returns:
            Model data dictionary
            
        Raises:
            HTTPException: If model not found
        """
        if model_id not in cls._models:
            raise HTTPException(
                status_code=404,
                detail=f"Model not found: {model_id}"
            )
        return cls._models[model_id]
