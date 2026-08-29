import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Card } from '../common'
import { formatCurrency } from '../../utils/formatters'

const COLORS = ['#2563eb', '#7c3aed', '#16a34a']

export default function AssetAllocation({ data }) {
  if (!data) return null

  const chartData = [
    {
      name: 'Mutual Funds (Demat)',
      value: data.mutual_funds_demat?.value_numeric || 0,
      percentage: data.mutual_funds_demat?.percentage || 0
    },
    {
      name: 'Mutual Fund Folios',
      value: data.mutual_fund_folios?.value_numeric || 0,
      percentage: data.mutual_fund_folios?.percentage || 0
    },
    {
      name: 'Equity Shares',
      value: data.equity_shares?.value_numeric || 0,
      percentage: data.equity_shares?.percentage || 0
    }
  ].filter(item => item.value > 0)

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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card title="Asset Allocation" icon={PieChartIcon}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={40}
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="font-medium text-slate-800">{formatCurrency(item.value)}</p>
              <p className="text-xs text-slate-500">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
