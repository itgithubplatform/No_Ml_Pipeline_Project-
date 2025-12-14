'use client'

import { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { BarChart3, TrendingUp, Target, Award, Maximize2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfusionMatrixChart } from '@/components/shared/ConfusionMatrixChart'
import { usePipelineStore } from '@/lib/store'

export const ResultsNode = memo<NodeProps>(({ data }) => {
    const { modelResults, modelStatus } = usePipelineStore()
    const [showMatrix, setShowMatrix] = useState(false)

    return (
        <>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500" />
            <Card className="min-w-[380px] border-2 border-green-500/50 bg-slate-900/95 backdrop-blur shadow-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="w-5 h-5 text-green-400" />
                        <span>Model Results</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {modelStatus !== 'success' || !modelResults ? (
                        <div className="text-center py-12">
                            <BarChart3 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                                Train a model to see results
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Complete all previous steps
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Main Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Accuracy */}
                                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="w-4 h-4 text-blue-400" />
                                        <p className="text-xs text-slate-400">Accuracy</p>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-400">
                                        {(modelResults.accuracy * 100).toFixed(1)}%
                                    </p>
                                </div>

                                {/* Precision */}
                                {modelResults.precision !== null && modelResults.precision !== undefined && (
                                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-purple-400" />
                                            <p className="text-xs text-slate-400">Precision</p>
                                        </div>
                                        <p className="text-3xl font-bold text-purple-400">
                                            {(modelResults.precision * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                )}

                                {/* Recall */}
                                {modelResults.recall !== null && modelResults.recall !== undefined && (
                                    <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-4 h-4 text-cyan-400" />
                                            <p className="text-xs text-slate-400">Recall</p>
                                        </div>
                                        <p className="text-3xl font-bold text-cyan-400">
                                            {(modelResults.recall * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                )}

                                {/* F1 Score */}
                                {modelResults.f1_score !== null && modelResults.f1_score !== undefined && (
                                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg hover:border-green-500/50 transition">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart3 className="w-4 h-4 text-green-400" />
                                            <p className="text-xs text-slate-400">F1 Score</p>
                                        </div>
                                        <p className="text-3xl font-bold text-green-400">
                                            {(modelResults.f1_score * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Model Information */}
                            <div className="p-4 bg-slate-800/50 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-slate-500">Model Type</p>
                                    <p className="text-sm font-medium text-slate-300 capitalize">
                                        {modelResults.model_type?.replace('_', ' ') || 'Unknown'}
                                    </p>
                                </div>
                                {modelResults.model_id && (
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500">Model ID</p>
                                        <p className="text-xs font-mono text-slate-400">
                                            {modelResults.model_id.slice(0, 12)}...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Success Badge */}
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-xs text-green-400 text-center font-medium">
                                    ✨ Model Training Complete!
                                </p>
                            </div>

                            {/* View Confusion Matrix Button */}
                            {modelResults.confusion_matrix && (
                                <button
                                    onClick={() => setShowMatrix(true)}
                                    className="w-full px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-lg text-sm text-orange-400 font-medium transition flex items-center justify-center gap-2"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                    View Confusion Matrix
                                </button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confusion Matrix Modal */}
            {showMatrix && modelResults?.confusion_matrix && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <button
                            onClick={() => setShowMatrix(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>
                        <ConfusionMatrixChart
                            matrix={modelResults.confusion_matrix}
                            classLabels={modelResults.class_labels}
                        />
                    </div>
                </div>
            )}
        </>
    )
})

ResultsNode.displayName = 'ResultsNode'
