'use client'

import { useCallback } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type Connection,
    type Node,
    type Edge,
    type NodeTypes,
} from 'reactflow'

import 'reactflow/dist/style.css'

import { UploadNode } from './UploadNode'
import { PreprocessNode } from './PreprocessNode'
import { SplitNode } from './SplitNode'
import { ModelNode } from './ModelNode'
import { ResultsNode } from './ResultsNode'
import { HelpPanel } from './HelpPanel'
import { ProgressTracker } from './ProgressTracker'

const nodeTypes: NodeTypes = {
    upload: UploadNode as any,
    preprocess: PreprocessNode as any,
    split: SplitNode as any,
    model: ModelNode as any,
    results: ResultsNode as any,
}

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'upload',
        position: { x: 100, y: 50 },
        data: { label: 'Upload Dataset' },
    },
    {
        id: '2',
        type: 'preprocess',
        position: { x: 100, y: 280 },
        data: { label: 'Preprocess Data' },
    },
    {
        id: '3',
        type: 'split',
        position: { x: 100, y: 560 },
        data: { label: 'Train-Test Split' },
    },
    {
        id: '4',
        type: 'model',
        position: { x: 100, y: 880 },
        data: { label: 'Train Model' },
    },
    {
        id: '5',
        type: 'results',
        position: { x: 550, y: 750 },
        data: { label: 'View Results' },
    },
]

const initialEdges: Edge[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#3b82f6' },
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        animated: true,
        style: { stroke: '#06b6d4' },
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        animated: true,
        style: { stroke: '#a855f7' },
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        animated: true,
        style: { stroke: '#f97316' },
    },
]

export function PipelineCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    return (
        <div className="w-full h-full bg-slate-950 relative">
            {/* Progress Tracker - Now in header, hidden here */}
            {/* <ProgressTracker /> */}

            {/* Help Panel */}
            <HelpPanel />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                className="bg-slate-950"
                defaultEdgeOptions={{
                    animated: true,
                    style: { strokeWidth: 2 },
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#334155"
                />
                <Controls
                    className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg shadow-xl"
                    showInteractive={false}
                />
                <MiniMap
                    className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg shadow-xl"
                    nodeColor="#3b82f6"
                    maskColor="rgba(15, 23, 42, 0.8)"
                />
            </ReactFlow>
        </div>
    )
}
