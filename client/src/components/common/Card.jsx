export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  action,
  ...props
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`} {...props}>
      {(title || action) && (
        <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}
