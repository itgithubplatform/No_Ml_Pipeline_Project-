'use client'

import { PipelineCanvas } from '@/components/pipeline/PipelineCanvas'
import { PipelineProgress } from '@/components/shared/PipelineProgress'
import { PipelineActions } from '@/components/shared/PipelineActions'
import { AnimatedDataFlow } from '@/components/shared/AnimatedDataFlow'

export default function PipelinePage() {
    return (
        <div className="h-screen flex flex-col bg-slate-950">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">ML Pipeline Builder</h1>
                            <p className="text-sm text-slate-400">Build your machine learning workflow visually</p>
                        </div>

                        {/* Action Buttons */}
                        <PipelineActions />
                    </div>

                    {/* Progress Indicator */}
                    <PipelineProgress />
                </div>
            </header>

            {/* Pipeline Canvas */}
            <div className="flex-1">
                <PipelineCanvas />
            </div>

            {/* Animated Background Effect */}
            <AnimatedDataFlow />
        </div>
    )
}
