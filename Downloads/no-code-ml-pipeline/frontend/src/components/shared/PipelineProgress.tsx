'use client'

import { usePipelineStore } from '@/lib/store'
import { Check, Loader2 } from 'lucide-react'

const steps = [
    { id: 1, name: 'Upload', status: 'uploadStatus' },
    { id: 2, name: 'Preprocess', status: 'preprocessStatus' },
    { id: 3, name: 'Split', status: 'splitStatus' },
    { id: 4, name: 'Train', status: 'modelStatus' },
    { id: 5, name: 'Results', status: 'modelStatus' },
]

export function PipelineProgress() {
    const {
        uploadStatus,
        preprocessStatus,
        splitStatus,
        modelStatus,
    } = usePipelineStore()

    const statusMap: any = {
        uploadStatus,
        preprocessStatus,
        splitStatus,
        modelStatus,
    }

    const getCurrentStep = () => {
        if (modelStatus === 'success') return 5
        if (modelStatus === 'training') return 4
        if (splitStatus === 'success') return 4
        if (splitStatus === 'splitting') return 3
        if (preprocessStatus === 'success') return 3
        if (preprocessStatus === 'processing') return 2
        if (uploadStatus === 'success') return 2
        if (uploadStatus === 'uploading') return 1
        return 1
    }

    const currentStep = getCurrentStep()
    const progress = (currentStep / steps.length) * 100

    const getStepStatus = (step: typeof steps[0]) => {
        const status = statusMap[step.status]

        if (step.id < currentStep) return 'complete'
        if (step.id === currentStep) {
            if (status === 'uploading' || status === 'processing' || status === 'splitting' || status === 'training') {
                return 'processing'
            }
            return 'current'
        }
        return 'upcoming'
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Compact Info Row */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">
                    Step {currentStep}/{steps.length}
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Slim Progress Bar */}
            <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Compact Step Indicators */}
            <div className="grid grid-cols-5 gap-2">
                {steps.map((step) => {
                    const status = getStepStatus(step)

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-1">
                            {/* Small Circle */}
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'complete'
                                        ? 'bg-green-500 shadow-sm'
                                        : status === 'processing'
                                            ? 'bg-blue-500 animate-pulse shadow-sm'
                                            : status === 'current'
                                                ? 'bg-slate-700 border border-blue-500'
                                                : 'bg-slate-800 border border-slate-700'
                                    }`}
                            >
                                {status === 'complete' ? (
                                    <Check className="w-3 h-3 text-white" />
                                ) : status === 'processing' ? (
                                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                                ) : (
                                    <span className={`text-[9px] font-bold ${status === 'current' ? 'text-blue-400' : 'text-slate-600'}`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>

                            {/* Compact Label */}
                            <span
                                className={`text-[9px] font-medium text-center leading-tight transition-colors duration-300 ${status === 'complete'
                                        ? 'text-green-400'
                                        : status === 'processing' || status === 'current'
                                            ? 'text-blue-400'
                                            : 'text-slate-500'
                                    }`}
                            >
                                {step.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
