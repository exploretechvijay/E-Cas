import { Building, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, Badge } from '../common'
import { formatCurrency } from '../../utils/formatters'

export default function DematAccounts({ data }) {
  if (!data || data.length === 0) return null

  return (
    <Card title="Demat Accounts" icon={Building}>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((account, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg p-4 hover:border-primary-200 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-slate-800 text-sm">{account.dp_name}</h4>
                <Badge
                  variant={account.status === 'Active' ? 'success' : 'warning'}
                  size="sm"
                  className="mt-1"
                >
                  {account.status}
                </Badge>
              </div>
              <span className="text-lg font-bold text-slate-800">
                {formatCurrency(account.value_numeric)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-500 text-xs">DP ID</p>
                <p className="font-medium text-slate-700">{account.dp_id}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Client ID</p>
                <p className="font-medium text-slate-700">{account.client_id}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              {account.nominee === 'Not Registered' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-600">Nominee not registered</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Nominee: {account.nominee}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
