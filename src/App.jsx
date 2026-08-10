import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter.jsx'
import { setTheme } from './features/theme/themeSlice.js'

/**
 * Asosiy App komponenti.
 * Loyiha boshlanganda saqlangan tema holatini Redux store'ga yuklaydi.
 */
export default function App() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.mode)

  // Sahifa yuklanganda/localStorage o'zgarganda 'dark' yoki 'light' klassini html elementiga qo'llash
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Birinchi yuklanishda Redux'dagi boshlang'ich qiymat localStorage'dan keladi
  useEffect(() => {
    dispatch(setTheme())
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
