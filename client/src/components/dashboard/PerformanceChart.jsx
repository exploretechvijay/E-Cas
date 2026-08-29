import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency } from '../../utils/formatters'

const MONTH_NAMES = {
  jan: 'Jan',
  feb: 'Feb',
  mar: 'Mar',
  apr: 'Apr',
  may: 'May',
  jun: 'Jun',
  jul: 'Jul',
  aug: 'Aug',
  sep: 'Sep',
  oct: 'Oct',
  nov: 'Nov',
  dec: 'Dec'
}

export default function PerformanceChart({ data }) {
  if (!data?.monthly_values) return null

  const chartData = Object.entries(data.monthly_values)
    .map(([key, value]) => {
      const [month, year] = key.split('_')
      return {
        month: MONTH_NAMES[month] || month,
        fullMonth: `${MONTH_NAMES[month]} ${year}`,
        value: value.value_numeric
      }
    })

  const minValue = Math.min(...chartData.map(d => d.value))
  const maxValue = Math.max(...chartData.map(d => d.value))
  const minMonth = chartData.find(d => d.value === minValue)
  const maxMonth = chartData.find(d => d.value === maxValue)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-slate-200">
          <p className="text-slate-500 text-sm">{data.fullMonth}</p>
          <p className="text-primary-600 font-bold text-lg">{formatCurrency(data.value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card
      title="Portfolio Performance"
      subtitle="12-month trend"
      icon={TrendingUp}
      action={
        <div className="flex gap-2">
          <Badge variant="success">
            +{data.ytd_growth_percentage}% YTD
          </Badge>
        </div>
      }
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-500">Highest</span>
          </div>
          <p className="font-bold text-green-700 mt-1">{formatCurrency(maxValue)}</p>
          <p className="text-xs text-slate-500">{maxMonth?.fullMonth}</p>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-slate-500">Lowest</span>
          </div>
          <p className="font-bold text-amber-700 mt-1">{formatCurrency(minValue)}</p>
          <p className="text-xs text-slate-500">{minMonth?.fullMonth}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-primary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">YTD Growth</p>
            <p className="text-2xl font-bold text-primary-700">
              {data.ytd_growth_percentage >= 0 ? '+' : ''}{data.ytd_growth_percentage}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Amount</p>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(data.ytd_growth_amount_numeric)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
