'use client'

import { memo, useState, useEffect } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Scissors, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePipelineStore } from '@/lib/store'
import { performTrainTestSplit } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const SplitNode = memo<NodeProps>(({ data }) => {
    const {
        datasetId,
        datasetInfo,
        targetColumn,
        splitStatus,
        preprocessStatus,
        setTargetColumn,
        setSplitStatus,
    } = usePipelineStore()

    const [testSize, setTestSize] = useState(30)
    const [selectedTarget, setSelectedTarget] = useState('')
    const [splitInfo, setSplitInfo] = useState<any>(null)

    const canSplit = datasetId && selectedTarget && preprocessStatus === 'success'

    useEffect(() => {
        if (selectedTarget) {
            setTargetColumn(selectedTarget)
        }
    }, [selectedTarget, setTargetColumn])

    const handleSplit = async () => {
        if (!datasetId || !selectedTarget) return

        setSplitStatus('splitting')
        try {
            const response = await performTrainTestSplit({
                dataset_id: datasetId,
                test_size: testSize / 100,
                target_column: selectedTarget,
                random_state: 42,
            })
            setSplitInfo(response)
            setSplitStatus('success')
        } catch (error) {
            console.error('Split error:', error)
            setSplitStatus('error')
        }
    }

    return (
        <>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-500" />
            <Card className="min-w-[320px] border-2 border-purple-500/50 bg-slate-900/95 backdrop-blur shadow-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Scissors className="w-5 h-5 text-purple-400" />
                        <span>Train-Test Split</span>
                        {splitStatus === 'success' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                        {splitStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {preprocessStatus !== 'success' ? (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-xs text-yellow-400">Complete preprocessing first</p>
                        </div>
                    ) : (
                        <>
                            {/* Target Column Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Target Column</label>
                                <select
                                    value={selectedTarget}
                                    onChange={(e) => setSelectedTarget(e.target.value)}
                                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">Select target...</option>
                                    {datasetInfo?.column_names.map((col: string) => (
                                        <option key={col} value={col}>
                                            {col}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Test Size Slider */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Test Size: {testSize}%
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    step="5"
                                    value={testSize}
                                    onChange={(e) => setTestSize(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Train: {100 - testSize}%</span>
                                    <span>Test: {testSize}%</span>
                                </div>
                            </div>

                            {splitStatus === 'splitting' ? (
                                <div className="flex flex-col items-center py-4">
                                    <LoadingSpinner size="md" />
                                    <p className="text-xs text-muted-foreground mt-2">Splitting...</p>
                                </div>
                            ) : splitStatus === 'success' && splitInfo ? (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg space-y-2">
                                    <p className="text-xs text-green-400 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Split Complete
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <p className="text-slate-500">Train</p>
                                            <p className="text-slate-300 font-medium">{splitInfo.train_size}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Test</p>
                                            <p className="text-slate-300 font-medium">{splitInfo.test_size}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button onClick={handleSplit} className="w-full" disabled={!canSplit}>
                                    Perform Split
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
        </>
    )
})

SplitNode.displayName = 'SplitNode'
