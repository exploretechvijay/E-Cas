import { Building, Layers, Briefcase, ArrowRightLeft, Building2, Lock } from 'lucide-react'
import { formatCurrency, formatNumber } from '../../utils/formatters'

export default function SummaryStats({ data }) {
  if (!data) return null

  const stats = [
    {
      label: 'Demat Accounts',
      value: data.total_demat_accounts,
      icon: Building,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Holdings',
      value: data.total_demat_holdings,
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'MF Folios',
      value: data.total_mf_folios,
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Transactions',
      value: data.total_transactions,
      icon: ArrowRightLeft,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'AMCs',
      value: data.total_amcs,
      icon: Building2,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    },
    {
      label: 'ELSS Locked',
      value: formatCurrency(data.total_elss_locked_value),
      icon: Lock,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      isAmount: true
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stat.isAmount ? stat.value : formatNumber(stat.value, 0)}
          </p>
          <p className="text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
