import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Building2, AlertTriangle } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency } from '../../utils/formatters'

const COLORS = [
  '#2563eb', '#7c3aed', '#16a34a', '#f59e0b', '#ef4444',
  '#06b6d4', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#6b7280'
]

export default function AMCAllocation({ data }) {
  if (!data || data.length === 0) return null

  const sortedData = [...data].sort((a, b) => b.value_numeric - a.value_numeric)
  const maxExposure = Math.max(...data.map(d => d.percentage))
  const isConcentrated = maxExposure > 25

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium text-slate-800">{item.name}</p>
          <p className="text-primary-600 font-bold">{formatCurrency(item.value_numeric)}</p>
          <p className="text-slate-500 text-sm">{item.percentage}% of portfolio</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      title="AMC Allocation"
      subtitle={`${data.length} AMCs`}
      icon={Building2}
      action={
        isConcentrated && (
          <Badge variant="warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            High Concentration
          </Badge>
        )
      }
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData.slice(0, 8)}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={(value) => value.split(' ').slice(0, 2).join(' ')}
            />
            <YAxis
              tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value_numeric" radius={[4, 4, 0, 0]}>
              {sortedData.slice(0, 8).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
        {sortedData.map((amc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-slate-600 truncate">{amc.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">
                {formatCurrency(amc.value_numeric)}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                amc.percentage > 25
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {amc.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
