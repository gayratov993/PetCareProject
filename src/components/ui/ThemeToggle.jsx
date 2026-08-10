import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme.js'

/**
 * Dark/Light mode almashtirgich tugmasi.
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      aria-label={isDark ? 'Light mode' : 'Dark mode'}
      className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </motion.button>
  )
}
