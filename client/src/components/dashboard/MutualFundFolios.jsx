import { useState } from 'react'
import { Briefcase, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency, formatNumber, getGainLossColor, getGainLossBgColor } from '../../utils/formatters'

export default function MutualFundFolios({ data }) {
  const [sortBy, setSortBy] = useState('value')
  const [expanded, setExpanded] = useState(null)

  if (!data || data.length === 0) return null

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'returns':
        return b.returns_percentage - a.returns_percentage
      case 'gain':
        return b.gain_loss_numeric - a.gain_loss_numeric
      default:
        return b.current_value_numeric - a.current_value_numeric
    }
  })

  const totalInvested = data.reduce((sum, f) => sum + f.invested_amount_numeric, 0)
  const totalCurrent = data.reduce((sum, f) => sum + f.current_value_numeric, 0)
  const totalGainLoss = totalCurrent - totalInvested

  return (
    <Card
      title="Mutual Fund Folios"
      subtitle={`${data.length} folios`}
      icon={Briefcase}
      action={
        <div className="flex gap-1 text-sm">
          {['value', 'returns', 'gain'].map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-lg capitalize ${
                sortBy === option
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      }
    >
      {/* Summary Row */}
      <div className={`mb-4 p-4 rounded-lg ${getGainLossBgColor(totalGainLoss)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Folios Value</p>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(totalCurrent)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total Gain/Loss</p>
            <p className={`text-xl font-bold ${getGainLossColor(totalGainLoss)}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sortedData.map((folio, index) => {
          const isExpanded = expanded === index
          const isProfit = folio.gain_loss_numeric >= 0

          return (
            <div
              key={index}
              className="border border-slate-200 rounded-lg overflow-hidden hover:border-primary-200 transition-colors"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-800 text-sm truncate">
                        {folio.scheme_name}
                      </h4>
                      <Badge variant="info" size="sm">{folio.amc.split(' ')[0]}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Folio: {folio.folio_no}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        {formatCurrency(folio.current_value_numeric)}
                      </p>
                      <div className={`flex items-center gap-1 text-sm ${getGainLossColor(folio.gain_loss_numeric)}`}>
                        {isProfit ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{folio.returns_percentage >= 0 ? '+' : ''}{folio.returns_percentage}%</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-100 bg-slate-50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Units</p>
                      <p className="font-medium text-slate-700">{formatNumber(folio.units_numeric, 3)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">NAV</p>
                      <p className="font-medium text-slate-700">₹{formatNumber(folio.nav_numeric, 4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Invested</p>
                      <p className="font-medium text-slate-700">{formatCurrency(folio.invested_amount_numeric)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gain/Loss</p>
                      <p className={`font-medium ${getGainLossColor(folio.gain_loss_numeric)}`}>
                        {folio.gain_loss_numeric >= 0 ? '+' : ''}{formatCurrency(folio.gain_loss_numeric)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant={folio.nominee === 'Registered' ? 'success' : 'warning'} size="sm">
                      Nominee: {folio.nominee}
                    </Badge>
                    <span className="text-xs text-slate-500">ISIN: {folio.isin}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
