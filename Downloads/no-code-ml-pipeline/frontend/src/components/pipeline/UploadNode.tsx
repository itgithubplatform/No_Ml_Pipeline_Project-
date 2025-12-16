'use client'

import { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Upload, Check, AlertCircle, Eye, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploader } from '@/components/shared/FileUploader'
import { uploadDataset, getDatasetPreview } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { DatasetPreviewTable } from '@/components/shared/DatasetPreviewTable'
import { TargetColumnSelector } from '@/components/shared/TargetColumnSelector'
import { DataQualityAlerts } from '@/components/shared/DataQualityAlerts'
import { getNodeClasses } from '@/lib/nodeStyles'
import { usePipelineStore } from '@/lib/store'

export const UploadNode = memo<NodeProps>(({ data }) => {
    const {
        uploadStatus,
        datasetInfo,
        datasetId,
        datasetPreview,
        targetColumn,
        setDatasetId,
        setDatasetInfo,
        setDatasetPreview,
        setTargetColumn,
        setUploadStatus
    } = usePipelineStore()

    const [showPreview, setShowPreview] = useState(false)
    const [loadingPreview, setLoadingPreview] = useState(false)

    const handleFileSelect = async (file: File) => {
        setUploadStatus('uploading')
        try {
            const response = await uploadDataset(file)
            setDatasetId(response.dataset_id)
            setDatasetInfo(response.info)
            setUploadStatus('success')

            // Automatically fetch preview
            await fetchPreview(response.dataset_id)
        } catch (error: any) {
            console.error('Upload error:', error)
            setUploadStatus('error')
        }
    }

    const fetchPreview = async (id: string) => {
        setLoadingPreview(true)
        try {
            const preview = await getDatasetPreview(id)
            setDatasetPreview(preview)
        } catch (error) {
            console.error('Preview error:', error)
        } finally {
            setLoadingPreview(false)
        }
    }

    const handleViewData = () => {
        setShowPreview(true)
    }

    return (
        <>
            <Card className={`min-w-[320px] border-2 backdrop-blur shadow-xl transition-all duration-300 ${getNodeClasses(uploadStatus === 'uploading' ? 'processing' : uploadStatus)}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Upload className="w-5 h-5 text-blue-400" />
                        <span>Upload Dataset</span>
                        {uploadStatus === 'success' && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                        {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {uploadStatus === 'uploading' ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <LoadingSpinner size="lg" />
                            <p className="text-sm text-muted-foreground mt-3">Processing file...</p>
                        </div>
                    ) : uploadStatus === 'success' && datasetInfo ? (
                        <div className="space-y-3">
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-xs text-green-400 font-medium flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Upload Successful
                                </p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-slate-300">
                                        <span className="text-slate-500">Rows:</span> {datasetInfo.rows.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-300">
                                        <span className="text-slate-500">Columns:</span> {datasetInfo.columns}
                                    </p>
                                    <p className="text-xs text-slate-300">
                                        <span className="text-slate-500">File:</span> {datasetInfo.filename}
                                    </p>
                                    {targetColumn && (
                                        <p className="text-xs text-purple-400 flex items-center gap-1 mt-2 pt-2 border-t border-slate-700">
                                            <Check className="w-3 h-3" />
                                            Target: <span className="font-medium">{targetColumn}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Data Quality Alerts */}
                            {datasetPreview && (
                                <DataQualityAlerts
                                    datasetInfo={datasetInfo}
                                    datasetPreview={datasetPreview}
                                />
                            )}

                            {/* View Data Button */}
                            <button
                                onClick={handleViewData}
                                disabled={loadingPreview}
                                className="w-full px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-sm text-blue-400 font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingPreview ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Loading Preview...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        {targetColumn ? 'View Data & Change Target' : 'View Data & Select Target'}
                                    </>
                                )}
                            </button>
                        </div>
                    ) : uploadStatus === 'error' ? (
                        <div className="space-y-3">
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-xs text-red-400 font-medium">Upload Failed</p>
                                <p className="text-xs text-slate-400 mt-1">Please try again</p>
                            </div>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>
                    ) : (
                        <FileUploader onFileSelect={handleFileSelect} />
                    )}
                </CardContent>
                <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
            </Card>

            {/* Preview Modal */}
            {showPreview && datasetPreview && datasetId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto space-y-4">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>
                        <DatasetPreviewTable preview={datasetPreview} />
                        <TargetColumnSelector
                            datasetId={datasetId}
                            columns={datasetPreview.info.column_names}
                            uniqueCounts={datasetPreview.unique_counts}
                            onTargetSelected={setTargetColumn}
                            initialTarget={targetColumn || undefined}
                        />
                    </div>
                </div>
            )}
        </>
    )
})

UploadNode.displayName = 'UploadNode'
