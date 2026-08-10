import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * Sahifaning yuqorisiga qaytaruvchi suzuvchi tugma.
 * 400px pastga siljilganda paydo bo'ladi.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollTop}
          aria-label="Yuqoriga"
          title="Yuqoriga"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-teal-600 text-white shadow-glow transition-shadow hover:shadow-cardlg"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
