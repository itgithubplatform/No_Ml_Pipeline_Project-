import { type Node, type Edge } from 'reactflow'

// Pipeline node types
export type PipelineNodeType =
    | 'upload'
    | 'preprocess'
    | 'split'
    | 'model'
    | 'results'

export interface PipelineNodeData {
    label: string
    type?: PipelineNodeType
    config?: any
    status?: 'idle' | 'running' | 'success' | 'error'
    data?: any
    [key: string]: any
}

export type PipelineNode = Node<PipelineNodeData>
export type PipelineEdge = Edge

export interface PipelineState {
    nodes: PipelineNode[]
    edges: PipelineEdge[]
    datasetId?: string
    targetColumn?: string
}
