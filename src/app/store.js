import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice.js'
import authReducer from '../features/auth/authSlice.js'
import symptomReducer from '../features/petSymptomChecker/symptomSlice.js'

/**
 * Redux store konfiguratsiyasi.
 * Barcha feature reducer'lari shu yerda birlashtiriladi.
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    symptom: symptomReducer,
  },
})
