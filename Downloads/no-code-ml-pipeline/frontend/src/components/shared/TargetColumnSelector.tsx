'use client'

import { useState, useEffect } from 'react'
import { Target, Sparkles, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from './LoadingSpinner'
import { getTargetRecommendations, setTargetColumn } from '@/lib/api'

interface TargetColumnSelectorProps {
    datasetId: string
    columns: string[]
    uniqueCounts?: Record<string, number>
    onTargetSelected: (column: string) => void
    initialTarget?: string
}

interface Recommendation {
    column: string
    score: number
    unique_values: number
    reason: string
}

export function TargetColumnSelector({
    datasetId,
    columns,
    uniqueCounts,
    onTargetSelected,
    initialTarget
}: TargetColumnSelectorProps) {
    const [selectedTarget, setSelectedTarget] = useState<string>(initialTarget || '')
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [loading, setLoading] = useState(false)
    const [validating, setValidating] = useState(false)
    const [validation, setValidation] = useState<any>(null)

    // Fetch recommendations on mount
    useEffect(() => {
        fetchRecommendations()
    }, [datasetId])

    const fetchRecommendations = async () => {
        setLoading(true)
        try {
            const response = await getTargetRecommendations(datasetId)
            setRecommendations(response.recommendations || [])
        } catch (error) {
            console.error('Error fetching recommendations:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectTarget = async (column: string) => {
        setSelectedTarget(column)
        setValidating(true)

        try {
            const result = await setTargetColumn(datasetId, column)
            setValidation(result)
            onTargetSelected(column)
        } catch (error) {
            console.error('Error setting target:', error)
        } finally {
            setValidating(false)
        }
    }

    const getScoreBadgeColor = (score: number) => {
        if (score >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30'
        if (score >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        if (score >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }

    return (
        <Card className="border-slate-700 bg-slate-900/95 backdrop-blur">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span>Select Target Column</span>
                    {selectedTarget && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* AI Recommendations */}
                {loading ? (
                    <div className="flex items-center justify-center py-6">
                        <LoadingSpinner size="md" />
                    </div>
                ) : recommendations.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-purple-400">
                            <Sparkles className="w-3 h-3" />
                            <span className="font-medium">AI Recommendations</span>
                        </div>
                        {recommendations.map((rec) => (
                            <button
                                key={rec.column}
                                onClick={() => handleSelectTarget(rec.column)}
                                disabled={validating}
                                className={`w-full p-3 rounded-lg border transition text-left ${selectedTarget === rec.column
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-200">{rec.column}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${getScoreBadgeColor(rec.score)}`}>
                                        {rec.score}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">{rec.reason}</span>
                                    <span className="text-slate-600">{rec.unique_values} unique</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Dropdown for all columns */}
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        Or select manually
                    </label>
                    <select
                        value={selectedTarget}
                        onChange={(e) => handleSelectTarget(e.target.value)}
                        disabled={validating}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                    >
                        <option value="">Select target column...</option>
                        {columns.map((col) => (
                            <option key={col} value={col}>
                                {col}
                                {uniqueCounts?.[col] !== undefined ? ` (${uniqueCounts[col]} unique)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Validation Result */}
                {validating && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <LoadingSpinner size="sm" />
                        Validating column...
                    </div>
                )}

                {validation && !validating && (
                    <div className={`p-3 rounded-lg border ${validation.is_valid
                            ? validation.warning
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="flex items-start gap-2">
                            {validation.is_valid ? (
                                validation.warning ? (
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                                )
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                            )}
                            <div className="flex-1 space-y-1">
                                {validation.warning && (
                                    <p className={`text-xs font-medium ${validation.is_valid ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {validation.warning}
                                    </p>
                                )}
                                {validation.suggestion && (
                                    <p className="text-xs text-slate-400">{validation.suggestion}</p>
                                )}
                                {!validation.warning && validation.is_valid && (
                                    <p className="text-xs text-green-400">
                                        ✓ Good choice! This column is suitable for classification.
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    {validation.unique_values} unique values • {validation.data_type}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
