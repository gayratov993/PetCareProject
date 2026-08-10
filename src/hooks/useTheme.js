import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/theme/themeSlice.js'

/**
 * Dark/Light mode ni boshqarish uchun custom hook.
 * Qaytaradi: { theme, isDark, toggle }
 */
export function useTheme() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.mode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => dispatch(toggleTheme())

  return { theme, isDark: theme === 'dark', toggle }
}
