import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSession } from '../features/auth/authSlice.js'

/**
 * Foydalanuvchi sessiyasini boshqarish uchun custom hook.
 * Qaytaradi: { user, profile, loading, sessionLoading, isAuthenticated, isAdmin }
 */
export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const profile = useSelector((state) => state.auth.profile)
  const loading = useSelector((state) => state.auth.loading)
  const sessionLoading = useSelector((state) => state.auth.sessionLoading)

  // Birinchi renderda Supabase sessiyasini tekshiramiz
  useEffect(() => {
    dispatch(fetchSession())
  }, [dispatch])

  return {
    user,
    profile,
    loading,
    sessionLoading,
    isAuthenticated: Boolean(user),
    isAdmin: profile?.role === 'admin',
  }
}
