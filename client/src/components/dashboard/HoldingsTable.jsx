import { useState, useMemo } from 'react'
import { Layers, Search, Filter, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency, formatNumber, truncateText } from '../../utils/formatters'

export default function HoldingsTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'value_numeric', direction: 'desc' })
  const [showFilters, setShowFilters] = useState(false)

  if (!data || data.length === 0) return null

  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.isin.toLowerCase().includes(term)
      )
    }

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(item => {
        if (filter === 'equity') return item.type === 'Equity Shares'
        if (filter === 'mf') return item.type?.includes('Mutual Fund')
        if (filter === 'locked') return item.lock_in !== 'N/A'
        return true
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0
      const bValue = b[sortConfig.key] || 0

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })

    return result
  }, [data, searchTerm, filter, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  const filters = [
    { value: 'all', label: 'All Holdings' },
    { value: 'mf', label: 'Mutual Funds' },
    { value: 'equity', label: 'Equity' },
    { value: 'locked', label: 'Locked-in' }
  ]

  return (
    <Card
      title="Holdings"
      subtitle={`${filteredData.length} of ${data.length} holdings`}
      icon={Layers}
      action={
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-slate-500" />
        </button>
      }
    >
      {showFilters && (
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ISIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  filter === f.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Security / Scheme
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th
                className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('units_numeric')}
              >
                <span className="flex items-center justify-end gap-1">
                  Units <SortIcon column="units_numeric" />
                </span>
              </th>
              <th
                className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('price_numeric')}
              >
                <span className="flex items-center justify-end gap-1">
                  Price <SortIcon column="price_numeric" />
                </span>
              </th>
              <th
                className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                onClick={() => handleSort('value_numeric')}
              >
                <span className="flex items-center justify-end gap-1">
                  Value <SortIcon column="value_numeric" />
                </span>
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Lock-in
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((holding, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-slate-800 text-sm" title={holding.name}>
                      {truncateText(holding.name, 45)}
                    </p>
                    <p className="text-xs text-slate-500">{holding.isin}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={holding.type === 'Equity Shares' ? 'success' : 'primary'}
                    size="sm"
                  >
                    {holding.type === 'Equity Shares' ? 'Equity' : 'MF'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-medium text-slate-700">
                  {formatNumber(holding.units_numeric, 3)}
                </td>
                <td className="py-3 px-4 text-right text-slate-600">
                  {formatCurrency(holding.price_numeric)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-800">
                  {formatCurrency(holding.value_numeric)}
                </td>
                <td className="py-3 px-4 text-center">
                  {holding.lock_in !== 'N/A' ? (
                    <div className="flex items-center justify-center" title={holding.lock_in}>
                      <Lock className="w-4 h-4 text-amber-500" />
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="py-8 text-center text-slate-500">
          No holdings match your search criteria
        </div>
      )}
    </Card>
  )
}
