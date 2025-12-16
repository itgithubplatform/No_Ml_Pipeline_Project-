'use client'

import { usePipelineStore } from '@/lib/store'
import { Check, Circle, Loader2 } from 'lucide-react'

const steps = [
    { id: 1, name: 'Upload Dataset', status: 'uploadStatus' },
    { id: 2, name: 'Preprocess', status: 'preprocessStatus' },
    { id: 3, name: 'Train-Test Split', status: 'splitStatus' },
    { id: 4, name: 'Train Model', status: 'modelStatus' },
    { id: 5, name: 'View Results', status: 'modelStatus' },
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

    // Calculate current step and completion
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
            {/* Progress Text */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-sm font-medium text-slate-200">
                        Pipeline Progress
                    </p>
                    <p className="text-xs text-slate-500">
                        Step {currentStep} of {steps.length}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-blue-400">
                        {Math.round(progress)}%
                    </p>
                    <p className="text-xs text-slate-500">Complete</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(step)

                    return (
                        <div key={step.id} className="flex flex-col items-center flex-1">
                            {/* Step Circle */}
                            <div className="relative">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${status === 'complete'
                                            ? 'bg-green-500 border-green-500'
                                            : status === 'processing'
                                                ? 'bg-blue-500 border-blue-500 animate-pulse'
                                                : status === 'current'
                                                    ? 'bg-slate-700 border-blue-500'
                                                    : 'bg-slate-800 border-slate-700'
                                        }`}
                                >
                                    {status === 'complete' ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : status === 'processing' ? (
                                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    ) : (
                                        <Circle className={`w-3 h-3 ${status === 'current' ? 'text-blue-400' : 'text-slate-600'}`} />
                                    )}
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute top-4 left-8 w-full h-0.5 transition-all duration-300 ${step.id < currentStep ? 'bg-green-500' : 'bg-slate-700'
                                            }`}
                                        style={{ width: 'calc(100% + 2rem)' }}
                                    />
                                )}
                            </div>

                            {/* Step Label */}
                            <p
                                className={`text-xs mt-2 text-center transition-colors duration-300 ${status === 'complete'
                                        ? 'text-green-400 font-medium'
                                        : status === 'processing' || status === 'current'
                                            ? 'text-blue-400 font-medium'
                                            : 'text-slate-500'
                                    }`}
                            >
                                {step.name}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
