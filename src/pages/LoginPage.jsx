import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LogIn } from 'lucide-react'
import LoginForm from '../features/auth/components/LoginForm.jsx'

/**
 * Kirish sahifasi.
 */
export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-hidden bg-mesh py-12">
      <div className="bg-paw-pattern absolute inset-0" />
      <div className="container-app relative flex min-h-[75vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card-lift p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-glow">
                <LogIn className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {t('auth.loginTitle')}
              </h1>
            </div>
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
