import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

// Create axios instance
export const api = axios.create({
    baseURL: `${API_URL}${API_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// API methods
export const uploadDataset = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const getDatasetInfo = async (datasetId: string) => {
    const response = await api.get(`/dataset/${datasetId}/info`)
    return response.data
}

export const getDatasetPreview = async (datasetId: string, numRows: number = 10) => {
    const response = await api.get(`/dataset/${datasetId}/preview`, {
        params: { num_rows: numRows },
    })
    return response.data
}

export const preprocessDataset = async (data: {
    dataset_id: string
    scaler_type: string
    columns_to_scale?: string[]
    target_column?: string
}) => {
    const response = await api.post('/preprocess', data)
    return response.data
}

export const performTrainTestSplit = async (data: {
    dataset_id: string
    test_size: number
    target_column: string
    random_state?: number
}) => {
    const response = await api.post('/train-test-split', data)
    return response.data
}

export const trainModel = async (data: {
    dataset_id: string
    model_type: string
    target_column: string
    hyperparameters?: Record<string, any>
}) => {
    const response = await api.post('/train-model', data)
    return response.data
}

export const getModelResults = async (modelId: string) => {
    const response = await api.get(`/model/${modelId}`)
    return response.data
}
