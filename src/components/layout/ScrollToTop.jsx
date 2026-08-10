import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sahifa almashganda tepaga qaytaruvchi yordamchi komponent.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
