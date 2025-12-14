import { create } from 'zustand'
import { Node, Edge } from 'reactflow'

interface PipelineState {
    // Dataset
    datasetId: string | null
    datasetInfo: any | null
    datasetPreview: any | null
    targetColumn: string | null

    // Nodes & Edges
    nodes: Node[]
    edges: Edge[]

    // Status tracking
    uploadStatus: 'idle' | 'uploading' | 'success' | 'error'
    preprocessStatus: 'idle' | 'processing' | 'success' | 'error'
    splitStatus: 'idle' | 'splitting' | 'success' | 'error'
    modelStatus: 'idle' | 'training' | 'success' | 'error'

    // Results
    modelResults: any | null

    // Actions
    setDatasetId: (id: string) => void
    setDatasetInfo: (info: any) => void
    setDatasetPreview: (preview: any) => void
    setTargetColumn: (column: string) => void
    setUploadStatus: (status: 'idle' | 'uploading' | 'success' | 'error') => void
    setPreprocessStatus: (status: 'idle' | 'processing' | 'success' | 'error') => void
    setSplitStatus: (status: 'idle' | 'splitting' | 'success' | 'error') => void
    setModelStatus: (status: 'idle' | 'training' | 'success' | 'error') => void
    setModelResults: (results: any) => void
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    reset: () => void
}

export const usePipelineStore = create<PipelineState>((set) => ({
    // Initial state
    datasetId: null,
    datasetInfo: null,
    datasetPreview: null,
    targetColumn: null,
    nodes: [],
    edges: [],
    uploadStatus: 'idle',
    preprocessStatus: 'idle',
    splitStatus: 'idle',
    modelStatus: 'idle',
    modelResults: null,

    // Actions
    setDatasetId: (id) => set({ datasetId: id }),
    setDatasetInfo: (info) => set({ datasetInfo: info }),
    setDatasetPreview: (preview) => set({ datasetPreview: preview }),
    setTargetColumn: (column) => set({ targetColumn: column }),
    setUploadStatus: (status) => set({ uploadStatus: status }),
    setPreprocessStatus: (status) => set({ preprocessStatus: status }),
    setSplitStatus: (status) => set({ splitStatus: status }),
    setModelStatus: (status) => set({ modelStatus: status }),
    setModelResults: (results) => set({ modelResults: results }),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    reset: () => set({
        datasetId: null,
        datasetInfo: null,
        datasetPreview: null,
        targetColumn: null,
        uploadStatus: 'idle',
        preprocessStatus: 'idle',
        splitStatus: 'idle',
        modelStatus: 'idle',
        modelResults: null,
    }),
}))
