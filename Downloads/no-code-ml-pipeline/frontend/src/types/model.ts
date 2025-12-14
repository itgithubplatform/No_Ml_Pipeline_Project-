// Model types
export type ModelType = 'logistic_regression' | 'decision_tree'

export interface TrainTestSplitResponse {
    success: boolean
    message: string
    dataset_id: string
    train_size: number
    test_size: number
    target_column: string
}

export interface ModelTrainResponse {
    success: boolean
    message: string
    model_id: string
    model_type: string
    accuracy: number
    precision?: number
    recall?: number
    f1_score?: number
    confusion_matrix?: number[][]
    feature_importance?: Record<string, number>
}
