import { Wallet, Building2, Briefcase, TrendingUp } from 'lucide-react'
import { formatCurrency, formatNumber } from '../../utils/formatters'

export default function PortfolioSummary({ data, performance }) {
  if (!data) return null

  const stats = [
    {
      label: 'Demat Holdings',
      value: data.demat_holdings_value_numeric,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Mutual Fund Folios',
      value: data.mutual_fund_folios_value_numeric,
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Equity Holdings',
      value: data.equity_value_numeric,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-primary-100 text-sm">Total Portfolio Value</p>
          <h2 className="text-3xl font-bold">{formatCurrency(data.total_portfolio_value_numeric)}</h2>
        </div>
      </div>

      {performance && (
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-primary-100">YTD Growth</span>
            <div className="text-right">
              <span className="text-xl font-bold">
                {performance.ytd_growth_percentage >= 0 ? '+' : ''}{performance.ytd_growth_percentage}%
              </span>
              <p className="text-sm text-primary-200">
                {formatCurrency(performance.ytd_growth_amount_numeric)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-slate-500 text-sm">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(stat.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
        <span className="text-primary-100">Total Schemes/Securities</span>
        <span className="text-xl font-bold">{formatNumber(data.total_schemes_securities, 0)}</span>
      </div>
    </div>
  )
}
