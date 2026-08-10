import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'

/**
 * Til almashtirgich (Language Switcher).
 * Uch til: O'zbek, Rus, Ingliz. Tanlangan til localStorage'da saqlanadi.
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const languages = [
    { code: 'uz', label: 'O\'zbek', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  const current = languages.find((l) => l.code === i18n.language) || languages[0]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setOpen(false)
  }

  // Tashqariga bosilganda dropdownni yopish
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        <Globe className="h-4 w-4" />
        <span>{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <span>
                {lang.flag} {lang.label}
              </span>
              {lang.code === i18n.language && <Check className="h-4 w-4 text-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
