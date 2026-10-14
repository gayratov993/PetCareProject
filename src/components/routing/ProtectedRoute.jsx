import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../common/Loader.jsx'
import { useAuth } from '../../hooks/useAuth.js'

/**
 * Himoyalangan marshrut.
 * Sessiya tekshirilguncha Loader ko'rsatadi, keyin kirmagan foydalanuvchini login sahifasiga yuboradi.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, sessionLoading } = useAuth()
  const location = useLocation()

  if (sessionLoading) return <Loader fullScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
