'use client'

import { Download, RotateCcw, FileJson, FileSpreadsheet } from 'lucide-react'
import { usePipelineStore } from '@/lib/store'
import { useState } from 'react'

export function PipelineActions() {
    const {
        modelResults,
        modelStatus,
        datasetInfo,
        reset,
    } = usePipelineStore()

    const [showExportMenu, setShowExportMenu] = useState(false)

    const canExport = modelStatus === 'success' && modelResults

    const handleExportJSON = () => {
        if (!modelResults) return

        const exportData = {
            timestamp: new Date().toISOString(),
            dataset: {
                filename: datasetInfo?.filename,
                rows: datasetInfo?.rows,
                columns: datasetInfo?.columns,
            },
            model: {
                type: modelResults.model_type,
                accuracy: modelResults.accuracy,
                precision: modelResults.precision,
                recall: modelResults.recall,
                f1_score: modelResults.f1_score,
            },
            confusion_matrix: modelResults.confusion_matrix,
            class_labels: modelResults.class_labels,
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ml-results-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportMenu(false)
    }

    const handleExportCSV = () => {
        if (!modelResults) return

        const csvRows = [
            ['Metric', 'Value'],
            ['Model Type', modelResults.model_type || 'N/A'],
            ['Accuracy', `${(modelResults.accuracy * 100).toFixed(2)}%`],
            ['Precision', `${(modelResults.precision * 100).toFixed(2)}%`],
            ['Recall', `${(modelResults.recall * 100).toFixed(2)}%`],
            ['F1 Score', `${(modelResults.f1_score * 100).toFixed(2)}%`],
            [''],
            ['Dataset Info', ''],
            ['Filename', datasetInfo?.filename || 'N/A'],
            ['Rows', datasetInfo?.rows || 'N/A'],
            ['Columns', datasetInfo?.columns || 'N/A'],
        ]

        const csvContent = csvRows.map((row) => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ml-results-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        setShowExportMenu(false)
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the entire pipeline? All progress will be lost.')) {
            reset()
            window.location.reload()
        }
    }

    return (
        <div className="flex items-center gap-3">
            {/* Export Button */}
            <div className="relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={!canExport}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${canExport
                            ? 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400'
                            : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    <Download className="w-4 h-4" />
                    Export Results
                </button>

                {/* Export Dropdown */}
                {showExportMenu && canExport && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
                        <button
                            onClick={handleExportJSON}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition text-left"
                        >
                            <FileJson className="w-4 h-4 text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-200">JSON</p>
                                <p className="text-xs text-slate-500">Full detailed export</p>
                            </div>
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition text-left border-t border-slate-700"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-200">CSV</p>
                                <p className="text-xs text-slate-500">Metrics only</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg font-medium text-sm text-red-400 transition-all"
            >
                <RotateCcw className="w-4 h-4" />
                Reset Pipeline
            </button>
        </div>
    )
}
