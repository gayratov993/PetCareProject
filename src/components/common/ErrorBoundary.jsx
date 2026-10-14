import { Component } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, RotateCcw } from 'lucide-react'

/**
 * Xatolik yuz berganda ko'rsatiladigan zaxira (fallback) interfeys.
 */
function ErrorFallback({ onRetry }) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
        {t('common.errorTitle')}
      </h1>
      <p className="max-w-md text-gray-600 dark:text-gray-300">{t('common.errorText')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
      >
        <RotateCcw className="h-4 w-4" />
        {t('common.retry')}
      </button>
    </div>
  )
}

/**
 * Ilova darajasidagi xatoliklarni ushlovchi Error Boundary.
 * Render paytida yuz bergan xatoni tutib, foydalanuvchiga tushunarli ekran ko'rsatadi.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Ishlab chiqishda yordam berish uchun konsolga yozamiz
    if (import.meta.env.DEV) {
      console.error(error, info)
    }
  }

  handleReset() {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleReset} />
    }
    return this.props.children
  }
}
