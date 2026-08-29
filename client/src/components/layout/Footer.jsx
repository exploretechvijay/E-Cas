import { Shield, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Secure Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Files are not stored</span>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} CAS Statement Analyzer
          </p>
        </div>
      </div>
    </footer>
  )
}
