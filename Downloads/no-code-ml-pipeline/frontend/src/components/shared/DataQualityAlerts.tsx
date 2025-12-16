import { AlertTriangle, Info, CheckCircle } from 'lucide-react'

interface DataQualityWarning {
    type: 'warning' | 'info' | 'success'
    message: string
    severity: 'high' | 'medium' | 'low'
}

interface DataQualityAlertsProps {
    datasetInfo: any
    datasetPreview: any
}

export function DataQualityAlerts({ datasetInfo, datasetPreview }: DataQualityAlertsProps) {
    if (!datasetInfo || !datasetPreview) return null

    const warnings: DataQualityWarning[] = []

    // Check for small dataset
    if (datasetInfo.rows < 100) {
        warnings.push({
            type: 'warning',
            message: `Small dataset (${datasetInfo.rows} rows). Results may not be reliable. Recommended: 1000+ rows.`,
            severity: 'high',
        })
    } else if (datasetInfo.rows < 500) {
        warnings.push({
            type: 'info',
            message: `Moderate dataset size (${datasetInfo.rows} rows). Consider adding more data for better results.`,
            severity: 'medium',
        })
    }

    // Check for missing values
    const missingValueColumns = Object.entries(datasetInfo.missing_values || {})
        .filter(([_, count]) => (count as number) > 0)

    if (missingValueColumns.length > 0) {
        const totalMissing = missingValueColumns.reduce((sum, [_, count]) => sum + (count as number), 0)
        const missingPercentage = (totalMissing / (datasetInfo.rows * datasetInfo.columns)) * 100

        if (missingPercentage > 20) {
            warnings.push({
                type: 'warning',
                message: `High missing values (${missingPercentage.toFixed(1)}%). Consider data cleaning.`,
                severity: 'high',
            })
        } else if (missingPercentage > 5) {
            warnings.push({
                type: 'info',
                message: `Some missing values detected (${missingPercentage.toFixed(1)}%). May need handling.`,
                severity: 'medium',
            })
        }
    }

    // Check for class imbalance (if target column set)
    if (datasetPreview.unique_counts) {
        const uniqueCounts = Object.values(datasetPreview.unique_counts) as number[]
        const avgUnique = uniqueCounts.reduce((a, b) => a + b, 0) / uniqueCounts.length

        // Find potential target columns (2-50 unique values)
        const potentialTargets = Object.entries(datasetPreview.unique_counts)
            .filter(([_, count]) => (count as number) >= 2 && (count as number) <= 50)

        if (potentialTargets.length === 0) {
            warnings.push({
                type: 'warning',
                message: 'No suitable target column found. All columns have too many or too few unique values.',
                severity: 'high',
            })
        }
    }

    // Check for many columns (potential overfitting)
    if (datasetInfo.columns > 50) {
        warnings.push({
            type: 'info',
            message: `High feature count (${datasetInfo.columns} columns). Consider feature selection.`,
            severity: 'low',
        })
    }

    // Success message if no issues
    if (warnings.length === 0) {
        warnings.push({
            type: 'success',
            message: 'Dataset looks good! No major quality issues detected.',
            severity: 'low',
        })
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Data Quality Insights
            </p>
            <div className="space-y-2">
                {warnings.map((warning, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${warning.type === 'warning'
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : warning.type === 'info'
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-green-500/10 border-green-500/30'
                            }`}
                    >
                        {warning.type === 'warning' ? (
                            <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        ) : warning.type === 'info' ? (
                            <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        ) : (
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        )}
                        <p
                            className={`flex-1 ${warning.type === 'warning'
                                    ? 'text-yellow-400'
                                    : warning.type === 'info'
                                        ? 'text-blue-400'
                                        : 'text-green-400'
                                }`}
                        >
                            {warning.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
