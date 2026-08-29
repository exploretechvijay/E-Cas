import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, FileText, PieChart, TrendingUp, Lock } from 'lucide-react'
import { Header, Footer } from '../components/layout'
import { Button, Input } from '../components/common'
import { DropZone, UploadProgress } from '../components/upload'
import { useAnalysis } from '../context/AnalysisContext'
import { analyzeCAS } from '../services/api'

export default function HomePage() {
  const navigate = useNavigate()
  const { setAnalysisData, setError } = useAnalysis()

  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('idle')

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile)
    setFileError(error)
  }

  const handleFileRemove = () => {
    setFile(null)
    setFileError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    let hasError = false

    if (!file) {
      setFileError('Please select a CAS PDF file')
      hasError = true
    }

    if (!password.trim()) {
      setPasswordError('Password is required')
      hasError = true
    } else {
      setPasswordError(null)
    }

    if (hasError) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('uploading')

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await analyzeCAS(file, password, (progress) => {
        if (progress < 90) {
          setUploadProgress(progress)
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('complete')

      // Parse response
      const data = Array.isArray(response) ? response[0] : response

      if (data.status === 'success') {
        setAnalysisData(data)

        // Small delay to show completion
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        throw new Error(data.message || 'Analysis failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('idle')
      setUploadProgress(0)
      setIsUploading(false)

      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze statement'
      setError(errorMessage)
      setFileError(errorMessage)
    }
  }

  const features = [
    {
      icon: PieChart,
      title: 'Asset Allocation',
      description: 'Visual breakdown of your portfolio'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monthly trends and returns'
    },
    {
      icon: FileText,
      title: 'Holdings Analysis',
      description: 'Detailed view of all investments'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Analyze Your CAS Statement
            </h2>
            <p className="text-slate-500">
              Upload your Consolidated Account Statement (CAS) PDF to get detailed insights
              about your investment portfolio.
            </p>
          </div>

          {isUploading ? (
            <div className="animate-fade-in">
              <UploadProgress
                progress={uploadProgress}
                status={uploadStatus}
                fileName={file?.name || 'Document'}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <DropZone
                file={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                error={fileError}
              />

              <Input
                label="PDF Password"
                type="password"
                placeholder="Enter your CAS password (usually PAN)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!file || !password}
              >
                Analyze Statement
              </Button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Lock className="w-4 h-4" />
            <span>Your file is processed securely and not stored on our servers</span>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 mx-auto bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-slate-800 text-sm">{feature.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
