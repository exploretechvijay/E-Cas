import { User, Mail, Phone, MapPin, Shield, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../common'
import { maskPAN } from '../../utils/formatters'

export default function InvestorCard({ data }) {
  const [showAddress, setShowAddress] = useState(false)

  if (!data) return null

  const { name, pan, email, mobile, address, kyc_status, statement_period } = data

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-800 truncate">{name}</h2>
            <Badge variant={kyc_status === 'KYC OK' ? 'success' : 'warning'}>
              <Shield className="w-3 h-3 mr-1" />
              {kyc_status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-500 text-xs">PAN</p>
                <p className="font-medium text-slate-800">{maskPAN(pan)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-xs">Email</p>
                <p className="font-medium text-slate-800 truncate">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-500 text-xs">Mobile</p>
                <p className="font-medium text-slate-800">{mobile}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-500 text-xs">Statement Period</p>
                <p className="font-medium text-slate-800">{statement_period}</p>
              </div>
            </div>
          </div>

          {address && (
            <div className="mt-4">
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <MapPin className="w-4 h-4" />
                {showAddress ? 'Hide Address' : 'Show Address'}
                {showAddress ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showAddress && (
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {address}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
