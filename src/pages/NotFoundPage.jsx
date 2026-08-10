import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SearchX, Home } from 'lucide-react'
import Button from '../components/common/Button.jsx'

/**
 * 404 sahifasi — topilmagan sahifa.
 */
export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-100 text-primary-600 dark:bg-primary-900/40"
      >
        <SearchX className="h-12 w-12" />
      </motion.div>
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        {t('notFound.title')}
      </h2>
      <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400">{t('notFound.text')}</p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="h-4 w-4" /> {t('common.backHome')}
        </Button>
      </Link>
    </div>
  )
}
