'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Upload, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploader } from '@/components/shared/FileUploader'
import { uploadDataset } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { usePipelineStore } from '@/lib/store'

export const UploadNode = memo<NodeProps>(({ data }) => {
    const {
        uploadStatus,
        datasetInfo,
        setDatasetId,
        setDatasetInfo,
        setUploadStatus
    } = usePipelineStore()

    const handleFileSelect = async (file: File) => {
        setUploadStatus('uploading')
        try {
            const response = await uploadDataset(file)
            setDatasetId(response.dataset_id)
            setDatasetInfo(response.info)
            setUploadStatus('success')
        } catch (error: any) {
            console.error('Upload error:', error)
            setUploadStatus('error')
        }
    }

    return (
        <Card className="min-w-[320px] border-2 border-blue-500/50 bg-slate-900/95 backdrop-blur shadow-xl">
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
                            </div>
                        </div>
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
    )
})

UploadNode.displayName = 'UploadNode'
