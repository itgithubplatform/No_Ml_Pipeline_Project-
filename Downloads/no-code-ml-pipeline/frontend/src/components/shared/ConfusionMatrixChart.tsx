'use client'

import { useMemo } from 'react'
import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ConfusionMatrixChartProps {
    matrix: number[][]
    classLabels?: string[]
}

export function ConfusionMatrixChart({ matrix, classLabels }: ConfusionMatrixChartProps) {
    // Calculate totals for percentages
    const { cellData, maxValue } = useMemo(() => {
        const total = matrix.flat().reduce((a, b) => a + b, 0)
        const maxVal = Math.max(...matrix.flat())

        const data = matrix.map((row, i) =>
            row.map((value, j) => ({
                value,
                percentage: total > 0 ? (value / total) * 100 : 0,
                isCorrect: i === j,
            }))
        )

        return { cellData: data, maxValue: maxVal }
    }, [matrix])

    // Generate labels
    const labels = classLabels || matrix.map((_, i) => `Class ${i}`)

    // Color intensity based on value
    const getCellColor = (value: number, isCorrect: boolean) => {
        const intensity = maxValue > 0 ? value / maxValue : 0

        if (isCorrect) {
            // Diagonal - correct predictions (green)
            return `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`
        } else {
            // Off-diagonal - errors (red)
            return `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`
        }
    }

    const getCellBorderColor = (isCorrect: boolean) => {
        return isCorrect ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
    }

    const getCellTextColor = (value: number, maxValue: number) => {
        const intensity = maxValue > 0 ? value / maxValue : 0
        return intensity > 0.5 ? 'rgb(255, 255, 255)' : 'rgb(203, 213, 225)'
    }

    return (
        <Card className="border-slate-700 bg-slate-900/95 backdrop-blur">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span>Confusion Matrix</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                    Rows = Actual • Columns = Predicted
                </p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Column headers - Predicted */}
                        <div className="flex items-end mb-2">
                            <div className="w-24 flex-shrink-0" />
                            <div className="flex-1 text-center">
                                <p className="text-xs text-orange-400 font-medium mb-2">Predicted</p>
                                <div className="flex justify-center gap-1">
                                    {labels.map((label, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 min-w-[80px] max-w-[120px]"
                                        >
                                            <p className="text-xs text-slate-400 truncate" title={label}>
                                                {label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Matrix rows */}
                        {matrix.map((row, i) => (
                            <div key={i} className="flex items-center gap-1 mb-1">
                                {/* Row label - Actual */}
                                {i === 0 && (
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                                        <p className="text-xs text-cyan-400 font-medium whitespace-nowrap">
                                            Actual
                                        </p>
                                    </div>
                                )}
                                <div className="w-24 flex-shrink-0 pr-2 text-right">
                                    <p className="text-xs text-slate-400 truncate" title={labels[i]}>
                                        {labels[i]}
                                    </p>
                                </div>

                                {/* Matrix cells */}
                                <div className="flex-1 flex justify-center gap-1">
                                    {row.map((_, j) => {
                                        const cell = cellData[i][j]
                                        return (
                                            <div
                                                key={j}
                                                className="flex-1 min-w-[80px] max-w-[120px] group relative"
                                            >
                                                <div
                                                    className="aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer flex flex-col items-center justify-center p-2"
                                                    style={{
                                                        backgroundColor: getCellColor(cell.value, cell.isCorrect),
                                                        borderColor: getCellBorderColor(cell.isCorrect),
                                                    }}
                                                >
                                                    <p
                                                        className="text-lg font-bold"
                                                        style={{ color: getCellTextColor(cell.value, maxValue) }}
                                                    >
                                                        {cell.value}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {cell.percentage.toFixed(1)}%
                                                    </p>

                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                        <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                                                            <p className="text-slate-300 font-medium mb-1">
                                                                {cell.isCorrect ? '✓ Correct' : '✗ Error'}
                                                            </p>
                                                            <p className="text-slate-400">
                                                                Actual: {labels[i]}
                                                            </p>
                                                            <p className="text-slate-400">
                                                                Predicted: {labels[j]}
                                                            </p>
                                                            <p className="text-slate-500 mt-1 pt-1 border-t border-slate-700">
                                                                Count: {cell.value} ({cell.percentage.toFixed(1)}%)
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Legend */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/40" />
                                <span className="text-slate-400">Correct Predictions (Diagonal)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-500/30" />
                                <span className="text-slate-400">Misclassifications</span>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-xs text-slate-400">
                                <span className="text-blue-400 font-medium">💡 How to read:</span> Each cell shows how many samples of the actual class (row) were predicted as the predicted class (column).
                                Darker colors = more samples. Green diagonal = correct, Red off-diagonal = errors.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
