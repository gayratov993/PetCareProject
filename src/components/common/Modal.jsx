import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Umumiy Modal komponenti.
 * open: modal ko'rinishini boshqaradi, onClose: yopish funksiyasi.
 */
export default function Modal({ open, onClose, title, subtitle, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-cardlg dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-primary-600 to-teal-600 px-6 py-5 text-white">
              <div className="bg-paw-pattern absolute inset-0 opacity-20" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  {subtitle && <p className="mt-0.5 text-sm text-primary-100">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Yopish"
                  className="rounded-xl bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
