import { Receipt, IndianRupee, Calendar, FileText } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency } from '../../utils/formatters'

const SECTION_80C_LIMIT = 150000

export default function TaxAnalysis({ data }) {
  if (!data) return null

  const elssInvestment = data.total_elss_investment_numeric || 0
  const utilizationPercentage = Math.min((elssInvestment / SECTION_80C_LIMIT) * 100, 100)
  const remaining = Math.max(SECTION_80C_LIMIT - elssInvestment, 0)
  const expiringThisYear = data.lockin_expiring_this_year_numeric || 0

  return (
    <Card title="Tax Analysis" subtitle="Section 80C Benefits" icon={Receipt}>
      {/* 80C Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">80C Utilization</span>
          <span className="text-sm font-medium text-slate-800">
            {formatCurrency(elssInvestment)} / {formatCurrency(SECTION_80C_LIMIT)}
          </span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              utilizationPercentage >= 100 ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">
            {utilizationPercentage.toFixed(0)}% utilized
          </span>
          {remaining > 0 && (
            <span className="text-xs text-primary-600">
              {formatCurrency(remaining)} remaining
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-4 h-4 text-primary-600" />
            <span className="text-xs text-slate-500">Total ELSS</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatCurrency(elssInvestment)}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-slate-500">ELSS Schemes</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {data.elss_schemes_count || 0}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-green-600" />
            <span className="text-xs text-slate-500">Tax Benefit</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatCurrency(Math.min(elssInvestment, SECTION_80C_LIMIT))}
          </p>
          <p className="text-xs text-slate-500">Max deduction eligible</p>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-slate-500">Expiring This Year</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {formatCurrency(expiringThisYear)}
          </p>
          <p className="text-xs text-slate-500">Lock-in ending</p>
        </div>
      </div>

      {/* Tax Tip */}
      {remaining > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Tax Tip:</span> You can invest up to{' '}
            <span className="font-bold">{formatCurrency(remaining)}</span> more in ELSS
            to maximize your Section 80C benefits.
          </p>
        </div>
      )}

      {utilizationPercentage >= 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Badge variant="success">Maxed Out</Badge>
          <p className="text-sm text-green-700">
            You've fully utilized your Section 80C ELSS limit!
          </p>
        </div>
      )}
    </Card>
  )
}
