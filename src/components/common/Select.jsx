/**
 * Umumiy tanlash (Select) komponenti.
 */
export default function Select({ label, error, options, placeholder, className = '', register, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:ring-2 dark:bg-gray-800 dark:text-gray-100 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600'
        } ${className}`}
        {...(register || {})}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
