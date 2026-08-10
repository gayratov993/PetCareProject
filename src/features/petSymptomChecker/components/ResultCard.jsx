import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Stethoscope, CheckCircle2, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../../components/common/Button.jsx'

/**
 * Natija kartochkasi.
 * Topilgan muammo bo'yicha ehtimoliy sabablar va tavsiyalar ko'rsatiladi.
 */
export default function ResultCard({ result }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyResult = async () => {
    const text = [
      result.symptom,
      '',
      t('symptomChecker.possibleCauses'),
      ...result.causes.map((c) => `• ${c}`),
      '',
      t('symptomChecker.recommendations'),
      ...result.recommendations.map((r) => `• ${r}`),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(t('symptomChecker.copied'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('consultation.error'))
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-white">
          {result.symptom}
        </h3>
        <button
          onClick={copyResult}
          aria-label={t('symptomChecker.copy')}
          title={t('symptomChecker.copy')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Ehtimoliy sabablar */}
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Stethoscope className="h-4 w-4 text-primary-600" />
          {t('symptomChecker.possibleCauses')}
        </h4>
        <ul className="space-y-2">
          {result.causes.map((cause, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              {cause}
            </li>
          ))}
        </ul>
      </div>

      {/* Tavsiyalar */}
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <CheckCircle2 className="h-4 w-4 text-primary-600" />
          {t('symptomChecker.recommendations')}
        </h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Ogohlantirish */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800 dark:text-amber-200">{t('symptomChecker.warning')}</p>
      </div>

      <Link to="/vet-consultation">
        <Button className="w-full sm:w-auto">{t('symptomChecker.consultBtn')}</Button>
      </Link>
    </div>
  )
}
