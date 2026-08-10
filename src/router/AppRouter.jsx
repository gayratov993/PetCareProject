import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Loader from '../components/common/Loader.jsx'

// Sahifalarni lazy load qilish — tezroq ishga tushish uchun
const HomePage = lazy(() => import('../pages/HomePage.jsx'))
const SymptomCheckerPage = lazy(() => import('../pages/SymptomCheckerPage.jsx'))
const NutritionPage = lazy(() => import('../pages/NutritionPage.jsx'))
const VetConsultationPage = lazy(() => import('../pages/VetConsultationPage.jsx'))
const AboutPage = lazy(() => import('../pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'))
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'))
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx'))
const RemindersPage = lazy(() => import('../pages/RemindersPage.jsx'))
const AdminPage = lazy(() => import('../pages/AdminPage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))

/**
 * Asosiy router konfiguratsiyasi.
 * Barcha sahifalar Layout ichida ko'rsatiladi.
 */
export function AppRouter() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/vet-consultation" element={<VetConsultationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
