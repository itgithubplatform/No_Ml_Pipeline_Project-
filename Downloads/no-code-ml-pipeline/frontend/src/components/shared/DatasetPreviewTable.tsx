'use client'

import { DatasetPreview } from '@/types/dataset'
import { Database, Hash, Calendar, Type, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DatasetPreviewTableProps {
    preview: DatasetPreview
}

export function DatasetPreviewTable({ preview }: DatasetPreviewTableProps) {
    const { info, preview: rows, column_categories, unique_counts } = preview

    // Get icon for column type
    const getColumnIcon = (columnName: string) => {
        const category = column_categories?.[columnName]
        switch (category) {
            case 'numeric':
                return <Hash className="w-3 h-3 text-blue-400" />
            case 'datetime':
                return <Calendar className="w-3 h-3 text-purple-400" />
            case 'categorical':
                return <Type className="w-3 h-3 text-green-400" />
            default:
                return <Database className="w-3 h-3 text-slate-400" />
        }
    }

    // Get color for column type
    const getColumnColor = (columnName: string) => {
        const category = column_categories?.[columnName]
        switch (category) {
            case 'numeric':
                return 'text-blue-400'
            case 'datetime':
                return 'text-purple-400'
            case 'categorical':
                return 'text-green-400'
            default:
                return 'text-slate-400'
        }
    }

    // Format cell value
    const formatCellValue = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-red-400 italic text-xs">null</span>
        }
        if (typeof value === 'number') {
            return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
        }
        return String(value)
    }

    return (
        <Card className="border-slate-700 bg-slate-900/95 backdrop-blur">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Dataset Preview</span>
                    <span className="text-xs text-slate-500 font-normal ml-auto">
                        Showing {rows.length} of {info.rows.toLocaleString()} rows
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Scrollable table container */}
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                {/* Row number column */}
                                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 sticky left-0 bg-slate-800/95 backdrop-blur">
                                    #
                                </th>
                                {/* Data columns */}
                                {info.column_names.map((columnName) => (
                                    <th
                                        key={columnName}
                                        className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getColumnIcon(columnName)}
                                            <span className={getColumnColor(columnName)}>
                                                {columnName}
                                            </span>
                                            {info.missing_values[columnName] > 0 && (
                                                <span title={`${info.missing_values[columnName]} missing values`}>
                                                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                                            <span>{column_categories?.[columnName] || 'unknown'}</span>
                                            {unique_counts?.[columnName] !== undefined && (
                                                <span className="text-slate-600">
                                                    • {unique_counts[columnName]} unique
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                                >
                                    {/* Row number */}
                                    <td className="px-3 py-2 text-slate-500 text-xs sticky left-0 bg-slate-900/95 backdrop-blur">
                                        {rowIndex + 1}
                                    </td>
                                    {/* Data cells */}
                                    {info.column_names.map((columnName) => (
                                        <td
                                            key={columnName}
                                            className="px-3 py-2 text-slate-300 text-xs whitespace-nowrap"
                                        >
                                            {formatCellValue(row[columnName])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Column Statistics Summary */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Hash className="w-3 h-3 text-blue-400" />
                            <p className="text-xs text-slate-400">Numeric Columns</p>
                        </div>
                        <p className="text-lg font-bold text-blue-400">
                            {Object.values(column_categories || {}).filter(c => c === 'numeric').length}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Type className="w-3 h-3 text-green-400" />
                            <p className="text-xs text-slate-400">Categorical Columns</p>
                        </div>
                        <p className="text-lg font-bold text-green-400">
                            {Object.values(column_categories || {}).filter(c => c === 'categorical').length}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                            <p className="text-xs text-slate-400">Missing Values</p>
                        </div>
                        <p className="text-lg font-bold text-yellow-400">
                            {Object.values(info.missing_values).reduce((a, b) => a + b, 0)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
