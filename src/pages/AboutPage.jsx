import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Target, Users, Award, Globe, Shield } from 'lucide-react'

/**
 * "Biz haqimizda" sahifasi.
 */
export default function AboutPage() {
  const { t } = useTranslation()

  const values = [
    { icon: Heart, label: t('about.value1') },
    { icon: Shield, label: t('about.value2') },
    { icon: Award, label: t('about.value3') },
    { icon: Globe, label: t('about.value4') },
  ]

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
          <Users className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('about.title')}
        </h1>
        <p className="mt-6 leading-relaxed text-gray-600 dark:text-gray-300">{t('about.text1')}</p>
        <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">{t('about.text2')}</p>
      </motion.div>

      {/* Vazifa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-14 max-w-3xl rounded-2xl bg-primary-600 p-8 text-center text-white"
      >
        <Target className="mx-auto mb-4 h-10 w-10" />
        <h2 className="text-2xl font-bold">{t('about.mission')}</h2>
        <p className="mt-3 leading-relaxed text-primary-100">{t('about.missionText')}</p>
      </motion.div>

      {/* Qadriyatlar */}
      <div className="mx-auto mt-14 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white"
        >
          {t('about.valuesTitle')}
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
                <value.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
