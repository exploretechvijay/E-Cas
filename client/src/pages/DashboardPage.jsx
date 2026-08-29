import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/layout'
import { Loading } from '../components/common'
import {
  InvestorCard,
  PortfolioSummary,
  AssetAllocation,
  CategoryAllocation,
  DematAccounts,
  HoldingsTable,
  MutualFundFolios,
  AMCAllocation,
  RecentTransactions,
  PerformanceChart,
  ELSSTracker,
  RiskAnalysis,
  TaxAnalysis,
  NomineeStatus,
  SummaryStats,
  PortfolioInsights
} from '../components/dashboard'
import { useAnalysis } from '../context/AnalysisContext'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { analysisData, isLoading } = useAnalysis()

  useEffect(() => {
    if (!analysisData && !isLoading) {
      navigate('/')
    }
  }, [analysisData, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading analysis..." />
      </div>
    )
  }

  if (!analysisData) {
    return null
  }

  const {
    investor_details,
    portfolio_summary,
    portfolio_performance,
    asset_allocation,
    category_wise_allocation,
    demat_accounts,
    demat_holdings,
    mutual_fund_folios,
    amc_allocation,
    recent_transactions,
    elss_locked_holdings,
    risk_analysis,
    tax_analysis,
    nominee_status,
    summary_statistics,
    key_observations,
    strengths,
    areas_of_improvement,
    recommendations,
    portfolio_score
  } = analysisData

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Investor Info */}
          <div className="mb-6 animate-fade-in">
            <InvestorCard data={investor_details} />
          </div>

          {/* Portfolio Summary */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PortfolioSummary data={portfolio_summary} performance={portfolio_performance} />
          </div>

          {/* Portfolio Insights */}
          {(key_observations?.length > 0 || strengths?.length > 0 || recommendations?.length > 0 || portfolio_score) && (
            <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.12s' }}>
              <PortfolioInsights
                keyObservations={key_observations}
                strengths={strengths}
                areasOfImprovement={areas_of_improvement}
                recommendations={recommendations}
                portfolioScore={portfolio_score}
              />
            </div>
          )}

          {/* Summary Stats */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <SummaryStats data={summary_statistics} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <AssetAllocation data={asset_allocation} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <CategoryAllocation data={category_wise_allocation} />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <PerformanceChart data={portfolio_performance} />
          </div>

          {/* Demat Accounts */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <DematAccounts data={demat_accounts} />
          </div>

          {/* Holdings Table */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <HoldingsTable data={demat_holdings} />
          </div>

          {/* MF Folios and AMC Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.45s' }}>
              <MutualFundFolios data={mutual_fund_folios} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <AMCAllocation data={amc_allocation} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.55s' }}>
            <RecentTransactions data={recent_transactions} />
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <RiskAnalysis data={risk_analysis} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.65s' }}>
              <TaxAnalysis data={tax_analysis} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <NomineeStatus data={nominee_status} />
            </div>
          </div>

          {/* ELSS Tracker */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.75s' }}>
            <ELSSTracker
              data={elss_locked_holdings}
              totalValue={summary_statistics?.total_elss_locked_value}
            />
          </div>

          {/* Timestamp */}
          <div className="text-center text-sm text-slate-500 py-4">
            Analysis generated on {new Date(analysisData.analysis_timestamp).toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short'
            })}
            <span className="mx-2">|</span>
            Version {analysisData.version}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
