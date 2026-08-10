import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { petImage } from '../../lib/petImages.js'

const SLIDES = ['dog', 'cat', 'rabbit', 'hamster', 'turtle']
const INTERVAL = 4500

/**
 * Hero qismidagi avtomatik aylanadigan hayvonlar karuseli.
 * O'tish effekti: yumshoq crossfade + sekin zoom (ken burns).
 */
export default function HeroCarousel() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(id)
  }, [paused])

  const go = (dir) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length)

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-3xl shadow-cardlg ring-4 ring-white/70 dark:ring-gray-800">
        <AnimatePresence>
          <motion.img
            key={index}
            src={petImage(SLIDES[index])}
            alt={t(`symptomChecker.pets.${SLIDES[index]}`)}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Pastki yorliq */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 pt-16">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="font-display text-xl font-bold text-white"
            >
              {t(`symptomChecker.pets.${SLIDES[index]}`)}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Chap/o'ng strelkalar */}
        <button
          onClick={() => go(-1)}
          aria-label="Oldingi"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition-all hover:bg-white/40 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Keyingi"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition-all hover:bg-white/40 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Nuqtalar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s}
            onClick={() => setIndex(i)}
            aria-label={`Slayd ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-gradient-to-r from-primary-600 to-teal-600' : 'w-2 bg-gray-300 hover:bg-primary-400 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
