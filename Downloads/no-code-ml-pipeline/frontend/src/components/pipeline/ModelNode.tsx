'use client'

import { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Brain, Check, AlertCircle, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePipelineStore } from '@/lib/store'
import { trainModel } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getNodeClasses } from '@/lib/nodeStyles'

export const ModelNode = memo<NodeProps>(({ data }) => {
    const {
        datasetId,
        targetColumn,
        splitStatus,
        modelStatus,
        setModelStatus,
        setModelResults,
    } = usePipelineStore()

    const [modelType, setModelType] = useState<'logistic_regression' | 'decision_tree'>('logistic_regression')

    const canTrain = datasetId && targetColumn

    const handleTrain = async () => {
        if (!datasetId || !targetColumn) return

        setModelStatus('training')
        try {
            const response = await trainModel({
                dataset_id: datasetId,
                model_type: modelType,
                target_column: targetColumn,
            })
            setModelResults(response)
            setModelStatus('success')
        } catch (error) {
            console.error('Training error:', error)
            setModelStatus('error')
        }
    }

    return (
        <>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
            <Card className={`min-w-[320px] border-2 backdrop-blur shadow-xl transition-all duration-300 ${getNodeClasses(modelStatus === 'training' ? 'processing' : modelStatus)}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5 text-orange-400" />
                        <span>Train Model</span>
                        {modelStatus === 'success' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                        {modelStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!datasetId || !targetColumn ? (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-xs text-yellow-400">Upload dataset and select target column first</p>
                        </div>
                    ) : (
                        <>
                            {splitStatus !== 'success' && (
                                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-xs text-blue-300">💡 Train-test split will be performed automatically (70/30)</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Model Type</label>
                                <div className="space-y-2 bg-slate-800/50 p-3 rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded group">
                                        <input
                                            type="radio"
                                            name="model"
                                            value="logistic_regression"
                                            checked={modelType === 'logistic_regression'}
                                            onChange={() => setModelType('logistic_regression')}
                                            className="accent-orange-500"
                                            disabled={modelStatus === 'training'}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-300 group-hover:text-white transition">
                                                Logistic Regression
                                            </p>
                                            <p className="text-xs text-slate-500">Fast, interpretable classifier</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded group">
                                        <input
                                            type="radio"
                                            name="model"
                                            value="decision_tree"
                                            checked={modelType === 'decision_tree'}
                                            onChange={() => setModelType('decision_tree')}
                                            className="accent-orange-500"
                                            disabled={modelStatus === 'training'}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-300 group-hover:text-white transition">
                                                Decision Tree
                                            </p>
                                            <p className="text-xs text-slate-500">Non-linear, feature importance</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {modelStatus === 'training' ? (
                                <div className="flex flex-col items-center py-6">
                                    <div className="relative">
                                        <LoadingSpinner size="lg" />
                                        <Zap className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-3">Training model...</p>
                                    <p className="text-xs text-slate-500 mt-1">This may take a moment</p>
                                </div>
                            ) : modelStatus === 'success' ? (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-xs text-green-400 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Model Trained Successfully!
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        View results in the Results node →
                                    </p>
                                </div>
                            ) : modelStatus === 'error' ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-xs text-red-400">Training failed. Please try again.</p>
                                    </div>
                                    <Button onClick={handleTrain} className="w-full" disabled={!canTrain}>
                                        Retry Training
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleTrain}
                                    className="w-full bg-orange-600 hover:bg-orange-500"
                                    disabled={!canTrain}
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Train Model
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-500" />
        </>
    )
})

ModelNode.displayName = 'ModelNode'
