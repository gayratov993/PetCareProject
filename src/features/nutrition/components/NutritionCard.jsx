import { useTranslation } from 'react-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { nutritionData } from '../data/nutritionData.js'

/**
 * Bitta hayvon turi uchun oziqlantirish kartochkasi.
 * Tavsiya etilgan va taqiqlangan ovqatlar + yosh guruhiga qarab ratsion.
 */
export default function NutritionCard({ species, ageGroup }) {
  const { t } = useTranslation()
  const data = nutritionData[species]

  if (!data) return null

  const goodItems = data.good.map((key) => t(`nutrition.foods.${key}`))
  const badItems = data.bad.map((key) => t(`nutrition.foods.${key}`))
  const ageAdvice = data.ages[ageGroup] || data.ages.adult

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Tavsiya etilgan */}
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
          <CheckCircle2 className="h-5 w-5" />
          {t('nutrition.recommended')}
        </h3>
        <ul className="space-y-2">
          {goodItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Taqiqlangan */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-800 dark:text-red-300">
          <XCircle className="h-5 w-5" />
          {t('nutrition.forbidden')}
        </h3>
        <ul className="space-y-2">
          {badItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Yoshga qarab ratsion */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:col-span-2 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
          {t('symptomChecker.pets.' + species)}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{ageAdvice}</p>
      </div>
    </div>
  )
}
