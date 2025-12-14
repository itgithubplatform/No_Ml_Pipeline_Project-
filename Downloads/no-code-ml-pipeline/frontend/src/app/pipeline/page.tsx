'use client'

import { PipelineCanvas } from '@/components/pipeline/PipelineCanvas'

export default function PipelinePage() {
    return (
        <div className="h-screen flex flex-col bg-slate-950">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">ML Pipeline Builder</h1>
                        <p className="text-sm text-slate-400">Build your machine learning workflow visually</p>
                    </div>
                </div>
            </header>

            {/* Pipeline Canvas */}
            <div className="flex-1">
                <PipelineCanvas />
            </div>
        </div>
    )
}
