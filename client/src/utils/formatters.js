export function formatCurrency(value) {
  if (value === null || value === undefined) return '₹ 0.00'

  const num = typeof value === 'string' ? parseFloat(value.replace(/[₹,\s]/g, '')) : value

  if (isNaN(num)) return '₹ 0.00'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return '0'

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export function formatPercentage(value) {
  if (value === null || value === undefined) return '0%'

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0%'

  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
}

export function formatDate(dateString) {
  if (!dateString) return ''

  // Handle DD-MM-YYYY format
  const parts = dateString.split('-')
  if (parts.length === 3 && parts[0].length <= 2) {
    const [day, month, year] = parts
    const date = new Date(year, parseInt(month) - 1, day)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Handle ISO format
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function maskPAN(pan) {
  if (!pan || pan.length < 10) return pan
  return pan.substring(0, 2) + 'XXXX' + pan.substring(6)
}

export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getGainLossColor(value) {
  if (value === null || value === undefined) return 'text-slate-600'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (num > 0) return 'text-green-600'
  if (num < 0) return 'text-red-600'
  return 'text-slate-600'
}

export function getGainLossBgColor(value) {
  if (value === null || value === undefined) return 'bg-slate-100'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (num > 0) return 'bg-green-50'
  if (num < 0) return 'bg-red-50'
  return 'bg-slate-50'
}
