import { Link, useLocation } from 'react-router-dom'
import { FileText, ArrowLeft, Printer } from 'lucide-react'
import { useAnalysis } from '../../context/AnalysisContext'

export default function Header() {
  const location = useLocation()
  const { clearAnalysis } = useAnalysis()
  const isDashboard = location.pathname === '/dashboard'

  const handleNewAnalysis = () => {
    clearAnalysis()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {isDashboard && (
              <Link
                to="/"
                onClick={handleNewAnalysis}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
            )}
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">CAS Analyzer</h1>
              <p className="text-xs text-slate-500">Portfolio Analysis Tool</p>
            </div>
          </div>

          {isDashboard && (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                onClick={handleNewAnalysis}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                New Analysis
              </Link>
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Print Report"
              >
                <Printer className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
