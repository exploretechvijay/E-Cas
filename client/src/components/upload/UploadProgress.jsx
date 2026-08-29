import { FileText, CheckCircle, Loader2 } from 'lucide-react'

export default function UploadProgress({ progress, status, fileName }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />,
          text: 'Uploading file...',
          color: 'bg-primary-600'
        }
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />,
          text: 'Analyzing statement...',
          color: 'bg-amber-500'
        }
      case 'complete':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: 'Analysis complete!',
          color: 'bg-green-500'
        }
      default:
        return {
          icon: <FileText className="w-5 h-5 text-slate-400" />,
          text: 'Ready to upload',
          color: 'bg-slate-300'
        }
    }
  }

  const { icon, text, color } = getStatusInfo()

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-800">{fileName}</p>
          <p className="text-sm text-slate-500">{text}</p>
        </div>
        <span className="text-sm font-medium text-slate-600">{progress}%</span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {status === 'processing' && (
        <p className="mt-3 text-xs text-slate-500 text-center">
          This may take a moment. Please don't close this page.
        </p>
      )}
    </div>
  )
}
