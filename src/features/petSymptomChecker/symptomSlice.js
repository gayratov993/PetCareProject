import { createSlice } from '@reduxjs/toolkit'
import { symptomsData } from './data/symptomsData.js'

/**
 * Symptom Checker uchun Redux slice.
 * Foydalanuvchi tanlagan hayvon turi, muammo va natija shu yerda saqlanadi.
 */
const symptomSlice = createSlice({
  name: 'symptom',
  initialState: {
    species: null,
    symptom: '',
    result: null,
    searched: false,
  },
  reducers: {
    setSpecies(state, action) {
      state.species = action.payload
      // Yangi tur tanlanganda oldingi natijani tozalaymiz
      state.result = null
      state.searched = false
    },
    setSymptom(state, action) {
      state.symptom = action.payload
    },
    searchSymptom(state) {
      state.searched = true
      state.result = null
      const species = state.species
      const query = state.symptom.trim().toLowerCase()
      if (!species) return

      const list = symptomsData[species] || []
      // Avval aniq moslikni qidiramiz, topilmasa so'zdagi moslikni qidiramiz
      const match =
        list.find((item) => item.symptom.toLowerCase() === query) ||
        list.find((item) => item.symptom.toLowerCase().includes(query)) ||
        (query &&
          list.find((item) => query.includes(item.symptom.toLowerCase()))) ||
        null

      state.result = match
    },
    reset(state) {
      state.species = null
      state.symptom = ''
      state.result = null
      state.searched = false
    },
  },
})

export const { setSpecies, setSymptom, searchSymptom, reset } = symptomSlice.actions
export default symptomSlice.reducer
