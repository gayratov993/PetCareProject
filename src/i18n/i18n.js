import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const savedLang = localStorage.getItem('language') || 'uz'

/**
 * i18next konfiguratsiyasi.
 * Uch til: O'zbek (uz), Rus (ru), Ingliz (en).
 * Tarjima fayllari public/locales papkasidan yuklanadi.
 * Tanlangan til localStorage'da saqlanadi.
 */
export async function initI18n() {
  // Har bir til uchun translation.json faylini serverdan yuklaymiz
  const [uz, ru, en] = await Promise.all([
    fetch('/locales/uz/translation.json').then((r) => r.json()),
    fetch('/locales/ru/translation.json').then((r) => r.json()),
    fetch('/locales/en/translation.json').then((r) => r.json()),
  ])

  await i18n.use(initReactI18next).init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false, // React XSS'dan himoyalanganligi uchun escape kerak emas
    },
  })

  // Til o'zgarganida html lang atributini yangilash
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
  })

  return i18n
}

export default i18n
