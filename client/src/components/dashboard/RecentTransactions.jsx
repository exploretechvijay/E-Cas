import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency, formatNumber, formatDate, truncateText } from '../../utils/formatters'

export default function RecentTransactions({ data }) {
  if (!data || data.length === 0) return null

  const getTransactionIcon = (type) => {
    if (type?.toLowerCase().includes('credit') || type?.toLowerCase().includes('investment')) {
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />
    }
    if (type?.toLowerCase().includes('debit') || type?.toLowerCase().includes('redemption')) {
      return <ArrowUpRight className="w-4 h-4 text-red-500" />
    }
    return <RefreshCw className="w-4 h-4 text-blue-500" />
  }

  const getTransactionColor = (type) => {
    if (type?.toLowerCase().includes('credit') || type?.toLowerCase().includes('investment')) {
      return 'success'
    }
    if (type?.toLowerCase().includes('debit') || type?.toLowerCase().includes('redemption')) {
      return 'danger'
    }
    return 'info'
  }

  return (
    <Card title="Recent Transactions" subtitle={`Last ${data.length} transactions`}>
      <div className="space-y-3">
        {data.map((transaction, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              {getTransactionIcon(transaction.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate" title={transaction.security_scheme}>
                    {truncateText(transaction.security_scheme, 40)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{formatDate(transaction.date)}</span>
                    <Badge variant={getTransactionColor(transaction.type)} size="sm">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {transaction.amount_numeric ? (
                    <p className="font-bold text-slate-800">
                      {formatCurrency(transaction.amount_numeric)}
                    </p>
                  ) : (
                    <p className="font-medium text-slate-600">
                      {formatNumber(transaction.units_numeric, 3)} units
                    </p>
                  )}
                  {transaction.nav_price_numeric && (
                    <p className="text-xs text-slate-500">
                      NAV: ₹{formatNumber(transaction.nav_price_numeric, 4)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
