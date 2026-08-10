import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

/**
 * Yuklanish (Loader) komponenti.
 */
export default function Loader({ fullScreen = false }) {
  const { t } = useTranslation()

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    )
  }

  return <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
}
