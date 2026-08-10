import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { petTypeKeys, petImage } from '../../../lib/petImages.js'

/**
 * Hayvon turini tanlash uchun kartochkalar qatori (real rasmlar bilan).
 */
export default function PetTypeSelector({ species, onSelect }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {petTypeKeys.map((type) => {
        const active = species === type
        return (
          <motion.button
            key={type}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(type)}
            className={`group flex flex-col items-center gap-2 overflow-hidden rounded-2xl border-2 p-2 pb-3 transition-all ${
              active
                ? 'border-primary-500 bg-primary-50 shadow-soft dark:bg-primary-900/20'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <img
              src={petImage(type)}
              alt={t(`symptomChecker.pets.${type}`)}
              className={`h-16 w-16 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110 ${
                active ? 'ring-2 ring-primary-400' : ''
              }`}
            />
            <span
              className={`text-sm font-medium ${
                active ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(`symptomChecker.pets.${type}`)}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
