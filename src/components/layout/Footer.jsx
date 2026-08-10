import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PawPrint, Phone, Mail, MapPin, Camera, Send, ThumbsUp } from 'lucide-react'

/**
 * Sayt tag qismi (Footer).
 * Sayt haqida qisqacha, tezkor havolalar va kontaktlar ko'rsatiladi.
 */
export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { to: '/symptom-checker', label: t('nav.symptomChecker') },
    { to: '/nutrition', label: t('nav.nutrition') },
    { to: '/vet-consultation', label: t('nav.consultation') },
    { to: '/reminders', label: t('nav.reminders') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <footer className="relative overflow-hidden bg-gray-950 text-gray-300">
      <div className="bg-paw-pattern absolute inset-0 opacity-40" />
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="container-app relative grid gap-10 py-14 md:grid-cols-3">
        {/* Sayt haqida */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft">
              <PawPrint className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold text-white">
              Pet<span className="text-gradient">Care</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{t('footer.about')}</p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-xl border border-gray-700 p-2.5 text-gray-400 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:text-primary-400"
            >
              <Camera className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="rounded-xl border border-gray-700 p-2.5 text-gray-400 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:text-primary-400"
            >
              <Send className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-xl border border-gray-700 p-2.5 text-gray-400 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:text-primary-400"
            >
              <ThumbsUp className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Tezkor havolalar */}
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
            {t('footer.quickLinks')}
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-gray-400 transition-colors hover:text-primary-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontaktlar */}
        <div className="md:justify-self-end">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
            {t('footer.contact')}
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
                <Phone className="h-4 w-4" />
              </span>
              +998 90 123 45 67
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
                <Mail className="h-4 w-4" />
              </span>
              info@petcare.uz
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
                <MapPin className="h-4 w-4" />
              </span>
              {t('contact.addressValue')}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-gray-800 py-6">
        <div className="container-app flex flex-col items-center justify-between gap-2 text-sm text-gray-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} PetCare. {t('footer.rights')}
          </p>
          <p>
            {t('footer.madeWith')} <span className="text-red-400">❤</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
