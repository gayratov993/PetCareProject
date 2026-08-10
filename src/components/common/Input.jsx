/**
 * Umumiy matn kiritish (Input) komponenti.
 * React Hook Form bilan ishlash uchun register prop qabul qiladi.
 */
export default function Input({
  label,
  type = 'text',
  error,
  className = '',
  register,
  icon,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-gray-100 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500/40 dark:border-gray-600'
          } ${icon ? 'pl-10' : ''} ${className}`}
          {...(register || {})}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
