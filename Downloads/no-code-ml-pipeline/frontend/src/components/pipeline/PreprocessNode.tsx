'use client'

import { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Settings, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePipelineStore } from '@/lib/store'
import { preprocessDataset } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getNodeClasses } from '@/lib/nodeStyles'

export const PreprocessNode = memo<NodeProps>(({ data }) => {
    const {
        datasetId,
        targetColumn,
        preprocessStatus,
        uploadStatus,
        setPreprocessStatus
    } = usePipelineStore()

    const [scalerType, setScalerType] = useState<'none' | 'standard' | 'minmax'>('none')

    const canApply = uploadStatus === 'success' && datasetId

    const handleApply = async () => {
        if (!datasetId) return

        setPreprocessStatus('processing')
        try {
            await preprocessDataset({
                dataset_id: datasetId,
                scaler_type: scalerType,
                target_column: targetColumn || undefined,
            })
            setPreprocessStatus('success')
        } catch (error) {
            console.error('Preprocessing error:', error)
            setPreprocessStatus('error')
        }
    }

    return (
        <>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
            <Card className={`min-w-[320px] border-2 backdrop-blur shadow-xl transition-all duration-300 ${getNodeClasses(preprocessStatus)}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        <span>Preprocess Data</span>
                        {preprocessStatus === 'success' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                        {preprocessStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!canApply ? (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-xs text-yellow-400">Upload a dataset first</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Scaler Type</label>
                                <div className="space-y-2 bg-slate-800/50 p-3 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/30 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="scaler"
                                            value="none"
                                            checked={scalerType === 'none'}
                                            onChange={() => setScalerType('none')}
                                            className="accent-cyan-500"
                                        />
                                        <span className="text-sm text-slate-300">None</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/30 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="scaler"
                                            value="standard"
                                            checked={scalerType === 'standard'}
                                            onChange={() => setScalerType('standard')}
                                            className="accent-cyan-500"
                                        />
                                        <span className="text-sm text-slate-300">StandardScaler</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/30 p-2 rounded">
                                        <input
                                            type="radio"
                                            name="scaler"
                                            value="minmax"
                                            checked={scalerType === 'minmax'}
                                            onChange={() => setScalerType('minmax')}
                                            className="accent-cyan-500"
                                        />
                                        <span className="text-sm text-slate-300">MinMaxScaler</span>
                                    </label>
                                </div>
                            </div>

                            {preprocessStatus === 'processing' ? (
                                <div className="flex flex-col items-center py-4">
                                    <LoadingSpinner size="md" />
                                    <p className="text-xs text-muted-foreground mt-2">Applying...</p>
                                </div>
                            ) : preprocessStatus === 'success' ? (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-xs text-green-400 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Preprocessing Applied
                                    </p>
                                </div>
                            ) : (
                                <Button onClick={handleApply} className="w-full" disabled={!canApply}>
                                    Apply Preprocessing
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-500" />
        </>
    )
})

PreprocessNode.displayName = 'PreprocessNode'
