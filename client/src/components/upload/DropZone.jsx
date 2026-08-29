import { useCallback, useState } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

export default function DropZone({ file, onFileSelect, onFileRemove, error }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSelectFile(droppedFile)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      validateAndSelectFile(selectedFile)
    }
  }, [onFileSelect])

  const validateAndSelectFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      onFileSelect(null, 'Please select a PDF file')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      onFileSelect(null, 'File size must be less than 10MB')
      return
    }

    onFileSelect(selectedFile, null)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (file) {
    return (
      <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary-400 bg-primary-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
        }`}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-primary-100' : error ? 'bg-red-100' : 'bg-slate-100'
          }`}>
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-slate-400'}`} />
            )}
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium">
              {isDragging ? 'Drop your CAS PDF here' : 'Drag & drop your CAS PDF here'}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              or <span className="text-primary-600 font-medium">browse files</span>
            </p>
          </div>
          <p className="text-slate-400 text-xs">
            PDF files only, max 10MB
          </p>
        </div>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
