import { useState } from 'react'
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react'
import { Card, Badge } from '../common'

export default function PortfolioInsights({
  keyObservations,
  strengths,
  areasOfImprovement,
  recommendations,
  portfolioScore
}) {
  const [expandedSections, setExpandedSections] = useState({
    observations: true,
    strengths: true,
    improvements: true,
    recommendations: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getScoreColor = (score) => {
    const numericScore = parseInt(score)
    if (numericScore >= 80) return { bg: 'bg-green-500', text: 'text-green-600', ring: 'ring-green-200' }
    if (numericScore >= 60) return { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-200' }
    return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-200' }
  }

  const scoreColors = portfolioScore?.overall_score
    ? getScoreColor(portfolioScore.overall_score)
    : { bg: 'bg-slate-500', text: 'text-slate-600', ring: 'ring-slate-200' }

  const numericScore = portfolioScore?.overall_score
    ? parseInt(portfolioScore.overall_score)
    : 0

  return (
    <div className="space-y-6">
      {/* Portfolio Score Card */}
      {portfolioScore && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full ${scoreColors.ring} ring-8 flex items-center justify-center bg-white`}>
                <div className="text-center">
                  <span className={`text-4xl font-bold ${scoreColors.text}`}>
                    {numericScore}
                  </span>
                  <span className="text-slate-400 text-lg">/100</span>
                </div>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 ${scoreColors.bg} rounded-full`}>
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Assessment */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Portfolio Health Score</h3>
              <p className="text-slate-300 leading-relaxed">
                {portfolioScore.assessment}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {numericScore >= 80 && (
                  <Badge variant="success" size="lg">Excellent</Badge>
                )}
                {numericScore >= 60 && numericScore < 80 && (
                  <Badge variant="warning" size="lg">Good</Badge>
                )}
                {numericScore < 60 && (
                  <Badge variant="danger" size="lg">Needs Attention</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Observations */}
      {keyObservations && keyObservations.length > 0 && (
        <Card className="overflow-hidden">
          <button
            onClick={() => toggleSection('observations')}
            className="w-full px-6 py-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Key Observations</h3>
                <p className="text-sm text-slate-500">{keyObservations.length} insights about your portfolio</p>
              </div>
            </div>
            {expandedSections.observations ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.observations && (
            <div className="p-6 space-y-3">
              {keyObservations.map((observation, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{observation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection('strengths')}
              className="w-full px-6 py-4 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">Strengths</h3>
                  <p className="text-sm text-slate-500">{strengths.length} positive aspects</p>
                </div>
              </div>
              {expandedSections.strengths ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedSections.strengths && (
              <div className="p-6 space-y-3">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg border border-green-100 bg-green-50/50"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 text-sm leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Areas of Improvement */}
        {areasOfImprovement && areasOfImprovement.length > 0 && (
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection('improvements')}
              className="w-full px-6 py-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">Areas of Improvement</h3>
                  <p className="text-sm text-slate-500">{areasOfImprovement.length} areas to address</p>
                </div>
              </div>
              {expandedSections.improvements ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedSections.improvements && (
              <div className="p-6 space-y-3">
                {areasOfImprovement.map((area, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50/50"
                  >
                    <XCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 text-sm leading-relaxed">{area}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="overflow-hidden">
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full px-6 py-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Recommendations</h3>
                <p className="text-sm text-slate-500">{recommendations.length} action items for you</p>
              </div>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.recommendations && (
            <div className="p-6 space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 leading-relaxed">{recommendation}</p>
                    <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                      Take Action <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
