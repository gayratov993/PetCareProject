import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Stethoscope, PhoneCall, Send } from 'lucide-react'
import ConsultationForm from '../features/vetConsultation/components/ConsultationForm.jsx'

/**
 * Veterinar bilan bog'lanish sahifasi.
 * Konsultatsiya so'rov formasi Supabase'dagi `consultations` jadvaliga yoziladi.
 */
export default function VetConsultationPage() {
  const { t } = useTranslation()

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
          <Stethoscope className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('consultation.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('consultation.subtitle')}
        </p>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-800"
        >
          <ConsultationForm />
        </motion.div>

        {/* Qo'shimcha ma'lumot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                +998 90 123 45 67
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('contact.phone')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                info@petcare.uz
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
