import { AlertTriangle, Shield, TrendingUp, Building2, Layers, Gauge } from 'lucide-react'
import { Card, Badge } from '../common'

export default function RiskAnalysis({ data }) {
  if (!data) return null

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700', badge: 'success' }
      case 'moderately low':
      case 'moderate': return { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'warning' }
      case 'moderately high':
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'warning' }
      case 'very high': return { bg: 'bg-red-100', text: 'text-red-700', badge: 'danger' }
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', badge: 'default' }
    }
  }

  const riskLevelColors = getRiskLevelColor(data.overall_risk_level)

  const metrics = [
    {
      label: 'Equity Exposure',
      value: data.equity_exposure_percentage,
      icon: TrendingUp,
      threshold: { low: 30, high: 70 },
      description: 'Direct equity holdings'
    },
    {
      label: 'ELSS Lock-in Exposure',
      value: data.elss_lockin_exposure_percentage,
      icon: Shield,
      threshold: { low: 20, high: 50 },
      description: 'Tax-saving locked funds'
    },
    {
      label: 'Top 3 Holdings',
      value: data.concentration_top_3_holdings_percentage,
      icon: Layers,
      threshold: { low: 30, high: 60 },
      description: 'Concentration risk'
    },
    {
      label: 'Max AMC Exposure',
      value: data.single_amc_max_exposure_percentage,
      icon: Building2,
      threshold: { low: 20, high: 30 },
      description: 'Single AMC concentration'
    }
  ]

  const getColor = (value, threshold) => {
    if (value <= threshold.low) return { bar: 'bg-green-500', text: 'text-green-600' }
    if (value <= threshold.high) return { bar: 'bg-amber-500', text: 'text-amber-600' }
    return { bar: 'bg-red-500', text: 'text-red-600' }
  }

  const getRiskLevel = (value, threshold) => {
    if (value <= threshold.low) return 'Low'
    if (value <= threshold.high) return 'Moderate'
    return 'High'
  }

  return (
    <Card title="Risk Analysis" icon={AlertTriangle}>
      {/* Overall Risk Level */}
      {data.overall_risk_level && (
        <div className={`mb-5 p-4 rounded-lg ${riskLevelColors.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className={`w-5 h-5 ${riskLevelColors.text}`} />
              <span className="font-medium text-slate-700">Overall Risk Level</span>
            </div>
            <Badge variant={riskLevelColors.badge} size="lg">
              {data.overall_risk_level}
            </Badge>
          </div>
          {data.diversification_status && (
            <p className="mt-2 text-sm text-slate-600">
              Diversification: <span className="font-medium">{data.diversification_status}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-5">
        {metrics.map((metric, index) => {
          const colors = getColor(metric.value || 0, metric.threshold)
          const riskLevel = getRiskLevel(metric.value || 0, metric.threshold)

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {metric.value?.toFixed(1) || 0}%
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                    riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {riskLevel}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.bar} transition-all duration-500`}
                  style={{ width: `${Math.min(metric.value || 0, 100)}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-medium text-slate-800 mb-2">Risk Legend</h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">Low Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-slate-600">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600">High Risk</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
