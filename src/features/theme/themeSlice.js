import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  // Agar foydalanuvchi o'rnatgan qiymat bo'lmasa, sistema sozlamasiga moslashamiz
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

/**
 * Dark/Light mode uchun Redux slice.
 * Holat localStorage'da saqlanadi, shunda sahifa yangilanganda ham saqlanib qoladi.
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    setTheme(state) {
      const saved = localStorage.getItem('theme')
      state.mode = saved === 'dark' || saved === 'light' ? saved : getInitialTheme()
    },
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.mode)
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
