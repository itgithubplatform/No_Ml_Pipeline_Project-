'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
    onFileSelect: (file: File) => void
    accept?: string
    maxSize?: number
    className?: string
}

export function FileUploader({
    onFileSelect,
    accept = '.csv,.xlsx,.xls',
    maxSize = 10485760, // 10MB
    className,
}: FileUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                setSelectedFile(file)
                onFileSelect(file)
            }
        },
        [onFileSelect]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxSize,
        multiple: false,
    })

    const removeFile = () => {
        setSelectedFile(null)
    }

    return (
        <div className={cn('w-full', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-card',
                    selectedFile && 'border-green-500 bg-green-500/10'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                    {selectedFile ? (
                        <>
                            <File className="w-12 h-12 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile()
                                }}
                                className="text-destructive hover:text-destructive/80"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {isDragActive
                                        ? 'Drop your file here'
                                        : 'Drag & drop your dataset here'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    or click to browse (CSV, Excel)
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max size: {maxSize / 1024 / 1024}MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
