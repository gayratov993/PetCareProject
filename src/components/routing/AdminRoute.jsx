import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../common/Loader.jsx'
import { useAuth } from '../../hooks/useAuth.js'

/**
 * Admin marshruti.
 * Faqat admin rolidagi foydalanuvchilarni o'tkazadi. Qolganlarini login yoki bosh sahifaga yuboradi.
 */
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, sessionLoading } = useAuth()
  const location = useLocation()

  if (sessionLoading) return <Loader fullScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
