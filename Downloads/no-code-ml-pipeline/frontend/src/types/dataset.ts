// Dataset types
export interface DatasetInfo {
    filename: string
    rows: number
    columns: number
    column_names: string[]
    column_types: Record<string, string>
    missing_values: Record<string, number>
    target_column?: string
}

export interface DatasetUploadResponse {
    success: boolean
    message: string
    dataset_id: string
    info?: DatasetInfo
}

export interface DatasetPreview {
    info: DatasetInfo
    preview: Record<string, any>[]
    statistics?: Record<string, any>
}
