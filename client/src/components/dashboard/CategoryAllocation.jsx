import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card } from '../common'
import { formatCurrency } from '../../utils/formatters'

const COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#f59e0b', '#ef4444', '#6b7280']

const CATEGORY_LABELS = {
  elss_tax_saver: 'ELSS Tax Saver',
  flexi_cap: 'Flexi Cap',
  small_cap: 'Small Cap',
  mid_cap_index: 'Mid Cap Index',
  international: 'International',
  other: 'Other'
}

export default function CategoryAllocation({ data }) {
  if (!data) return null

  const chartData = Object.entries(data)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      value: value?.value_numeric || 0,
      percentage: value?.percentage || 0
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium text-slate-800">{data.name}</p>
          <p className="text-primary-600 font-bold">{formatCurrency(data.value)}</p>
          <p className="text-slate-500 text-sm">{data.percentage}% of portfolio</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card title="Category-wise Allocation" icon={BarChart3}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
            <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <div
              className="w-2 h-8 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 truncate">{item.name}</p>
              <p className="font-medium text-slate-800 text-sm">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
