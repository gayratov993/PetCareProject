import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PawPrint, Menu, X, LogOut, UserCircle2, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../features/auth/authSlice.js'

/**
 * Sayt bosh menyusi (Header).
 * Navigatsiya, til almashtirgich, dark/light toggle va mobil menyuni o'z ichiga oladi.
 */
export default function Header() {
  const { t } = useTranslation()
  const { isAuthenticated, isAdmin } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/symptom-checker', label: t('nav.symptomChecker') },
    { to: '/nutrition', label: t('nav.nutrition') },
    { to: '/vet-consultation', label: t('nav.consultation') },
    { to: '/reminders', label: t('nav.reminders') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-gray-700/70 dark:bg-gray-900/80">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft transition-transform duration-300 group-hover:rotate-6">
            <PawPrint className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-bold text-gray-900 dark:text-white">
            Pet<span className="text-gradient">Care</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Asosiy navigatsiya">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm dark:bg-gray-800 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/70'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* O'ng taraf tugmalar */}
        <div className="hidden items-center gap-2 xl:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-primary-800 dark:bg-gray-800 dark:text-primary-300"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('nav.admin')}
                </Link>
              )}
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                <UserCircle2 className="h-4 w-4" />
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                aria-label={t('nav.logout')}
                title={t('nav.logout')}
                className="rounded-2xl border border-gray-200 p-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-red-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-primary-500 hover:text-primary-600 hover:shadow-md dark:border-gray-600 dark:text-gray-100"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        {/* Mobil menyu tugmasi */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menyu"
            className="rounded-xl border border-gray-200 p-2.5 text-gray-600 dark:border-gray-600 dark:text-gray-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobil menyu */}
      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-200 bg-white/95 backdrop-blur-lg xl:hidden dark:border-gray-700 dark:bg-gray-900/95"
        >
          <div className="container-app flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl border border-primary-300 px-4 py-3 text-center text-sm font-semibold text-primary-700 dark:border-primary-700 dark:text-primary-300"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-soft"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-gradient-to-r from-primary-600 to-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-soft"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </header>
  )
}
