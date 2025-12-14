"""
ML model training and evaluation service.
"""
import numpy as np
from typing import Dict, Any, Optional
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, confusion_matrix
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
        hyperparameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Train ML model on dataset.
        
        Args:
            dataset_id: Dataset identifier
            model_type: Type of model to train
            hyperparameters: Optional model hyperparameters
            
        Returns:
            Dictionary with training results and metrics
            
        Raises:
            HTTPException: If training fails
        """
        try:
            # Get split data
            split_data = SplitService.get_split_data(dataset_id)
            X_train = split_data['X_train']
            X_test = split_data['X_test']
            y_train = split_data['y_train']
            y_test = split_data['y_test']
            
            # Initialize model
            if model_type == ModelType.LOGISTIC_REGRESSION:
                model = cls._create_logistic_regression(hyperparameters)
            elif model_type == ModelType.DECISION_TREE:
                model = cls._create_decision_tree(hyperparameters)
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported model type: {model_type}"
                )
            
            # Train model
            model.fit(X_train, y_train)
            
            # Make predictions
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            metrics = cls._calculate_metrics(y_test, y_pred)
            
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
            
            return {
                'model_id': model_id,
                'model_type': model_type.value,
                'accuracy': metrics['accuracy'],
                'precision': metrics.get('precision'),
                'recall': metrics.get('recall'),
                'f1_score': metrics.get('f1_score'),
                'confusion_matrix': metrics['confusion_matrix'],
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
    def _create_decision_tree(
        cls,
        hyperparameters: Optional[Dict[str, Any]]
    ) -> DecisionTreeClassifier:
        """Create Decision Tree model."""
        params = hyperparameters or {}
        return DecisionTreeClassifier(
            max_depth=params.get('max_depth', None),
            min_samples_split=params.get('min_samples_split', 2),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            random_state=params.get('random_state', 42)
        )
    
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
            'confusion_matrix': confusion_matrix(y_true, y_pred).tolist()
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
