import { motion } from 'framer-motion'

/**
 * Umumiy kartochka (Card) komponenti.
 * Hover'da yumshoq ko'tarilish animatsiyasi bilan.
 */
export default function Card({ children, className = '', onClick }) {
  return (
    <motion.div
      whileHover={onClick ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`card-lift overflow-hidden p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
