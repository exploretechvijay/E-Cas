import { useState, useMemo } from 'react'
import { Lock, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters'

export default function ELSSTracker({ data, totalValue }) {
  const [showAll, setShowAll] = useState(false)

  if (!data || data.length === 0) return null

  const groupedByDate = useMemo(() => {
    const groups = {}
    data.forEach(item => {
      const date = item.lock_in_till
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
    })
    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        items,
        totalValue: items.reduce((sum, i) => sum + i.value_numeric, 0)
      }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-')
        const [dayB, monthB, yearB] = b.date.split('-')
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
      })
  }, [data])

  const expiringSoon = useMemo(() => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

    return groupedByDate.filter(group => {
      const [day, month, year] = group.date.split('-')
      const expiryDate = new Date(year, month - 1, day)
      return expiryDate <= threeMonthsFromNow
    })
  }, [groupedByDate])

  const displayData = showAll ? groupedByDate : groupedByDate.slice(0, 5)

  return (
    <Card
      title="ELSS Lock-in Tracker"
      subtitle={`${data.length} locked entries`}
      icon={Lock}
      action={
        <Badge variant="warning">
          {formatCurrency(totalValue)} Locked
        </Badge>
      }
    >
      {expiringSoon.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-sm">
              {formatCurrency(expiringSoon.reduce((sum, g) => sum + g.totalValue, 0))} expiring in next 3 months
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {displayData.map((group, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{formatDate(group.date)}</p>
                  <p className="text-xs text-slate-500">{group.items.length} entries</p>
                </div>
              </div>
              <span className="font-bold text-slate-800">{formatCurrency(group.totalValue)}</span>
            </div>

            <div className="mt-2 space-y-1">
              {group.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="text-xs text-slate-500 flex justify-between">
                  <span className="truncate max-w-[60%]" title={item.scheme}>
                    {truncateText(item.scheme, 35)}
                  </span>
                  <span>{item.units_locked} units</span>
                </div>
              ))}
              {group.items.length > 2 && (
                <p className="text-xs text-primary-600">+{group.items.length - 2} more</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {groupedByDate.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1"
        >
          {showAll ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show All ({groupedByDate.length}) <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </Card>
  )
}
