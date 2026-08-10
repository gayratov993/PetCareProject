import { motion } from 'framer-motion'

/**
 * Umumiy tugma komponenti.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-soft hover:-translate-y-0.5 hover:shadow-glow active:scale-95',
    secondary:
      'border border-gray-300 bg-white text-gray-700 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ghost: 'text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-gray-800',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
