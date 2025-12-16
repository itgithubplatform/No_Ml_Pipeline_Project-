'use client'

import { usePipelineStore } from '@/lib/store'
import { Upload, Settings, Scissors, Brain, BarChart3, Check, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ProgressTracker() {
    const { uploadStatus, preprocessStatus, splitStatus, modelStatus } = usePipelineStore()

    const steps = [
        {
            id: 'upload',
            label: 'Upload Data',
            icon: Upload,
            status: uploadStatus,
            step: 1
        },
        {
            id: 'preprocess',
            label: 'Preprocess',
            icon: Settings,
            status: preprocessStatus,
            step: 2,
            optional: true
        },
        {
            id: 'split',
            label: 'Split Data',
            icon: Scissors,
            status: splitStatus,
            step: 3,
            auto: true
        },
        {
            id: 'model',
            label: 'Train Model',
            icon: Brain,
            status: modelStatus,
            step: 4
        },
        {
            id: 'results',
            label: 'View Results',
            icon: BarChart3,
            status: modelStatus === 'success' ? 'success' : 'idle',
            step: 5
        }
    ]

    const getStepColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-500/20 border-green-500 text-green-400'
            case 'uploading':
            case 'processing':
            case 'splitting':
            case 'training':
                return 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse'
            case 'error':
                return 'bg-red-500/20 border-red-500 text-red-400'
            default:
                return 'bg-slate-700/20 border-slate-600 text-slate-500'
        }
    }

    const getStatusIcon = (status: string) => {
        if (status === 'success') return <Check className="w-3 h-3" />
        if (['uploading', 'processing', 'splitting', 'training'].includes(status)) {
            return <Loader2 className="w-3 h-3 animate-spin" />
        }
        return null
    }

    const completedSteps = steps.filter(s => s.status === 'success').length
    const totalSteps = steps.length
    const progress = (completedSteps / totalSteps) * 100

    return (
        <div className="fixed top-6 left-6 z-40 w-64">
            <Card className="bg-slate-900/95 backdrop-blur border-2 border-slate-700 shadow-2xl">
                <CardContent className="p-4">
                    {/* Header */}
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-slate-200 mb-1">Pipeline Progress</h3>
                        <p className="text-xs text-slate-400">
                            {completedSteps} of {totalSteps} steps complete
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = step.status !== 'idle'
                            const isComplete = step.status === 'success'

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${getStepColor(step.status)}`}
                                >
                                    {/* Step Number */}
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800/80 flex items-center justify-center">
                                        <span className="text-xs font-bold">{step.step}</span>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Label */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{step.label}</p>
                                        {step.optional && (
                                            <p className="text-[10px] text-slate-500">Optional</p>
                                        )}
                                        {step.auto && (
                                            <p className="text-[10px] text-blue-400">Auto</p>
                                        )}
                                    </div>

                                    {/* Status Icon */}
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(step.status)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Success Message */}
                    {completedSteps === totalSteps && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-xs text-green-400 text-center font-medium">
                                🎉 Pipeline Complete!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
