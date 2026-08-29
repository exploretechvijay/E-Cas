import { Users, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, Badge } from '../common'

export default function NomineeStatus({ data }) {
  if (!data) return null

  const accounts = [
    {
      name: 'Demat Account 1',
      nominee: data.demat_account_1_nominee,
      isRegistered: data.demat_account_1_nominee !== 'Not Registered'
    },
    {
      name: 'Demat Account 2',
      nominee: data.demat_account_2_nominee,
      isRegistered: data.demat_account_2_nominee !== 'Not Registered'
    },
    {
      name: 'Mutual Fund Folios',
      nominee: data.mf_folios_nominee_status,
      isRegistered: data.mf_folios_nominee_status === 'Registered'
    }
  ]

  const allRegistered = accounts.every(a => a.isRegistered)
  const noneRegistered = accounts.every(a => !a.isRegistered)

  return (
    <Card title="Nominee Status" icon={Users}>
      {/* Summary Banner */}
      {allRegistered ? (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-green-700">
            All accounts have nominees registered
          </span>
        </div>
      ) : noneRegistered ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-700">
            No nominees registered! Please add nominees for safety.
          </span>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-amber-700">
            Some accounts are missing nominees
          </span>
        </div>
      )}

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((account, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              account.isRegistered
                ? 'border-green-200 bg-green-50/50'
                : 'border-red-200 bg-red-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {account.isRegistered ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-slate-800">{account.name}</p>
                  <p className="text-sm text-slate-500">
                    {account.isRegistered ? account.nominee : 'Not Registered'}
                  </p>
                </div>
              </div>
              <Badge variant={account.isRegistered ? 'success' : 'danger'} size="sm">
                {account.isRegistered ? 'Active' : 'Missing'}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {!allRegistered && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Important:</span> Adding a nominee ensures smooth
            transfer of your investments to your loved ones. Please contact your broker or
            AMC to register nominees.
          </p>
        </div>
      )}
    </Card>
  )
}
