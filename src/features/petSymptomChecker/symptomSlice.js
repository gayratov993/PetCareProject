import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { symptomsData } from './data/symptomsData.js'
import { fetchSymptomsBySpecies } from './symptomsApi.js'

/**
 * Tanlangan hayvon turi uchun muammolar ro'yxatini yuklaydi.
 * Supabase'dan oladi, bo'lmasa statik zaxiraga qaytadi.
 */
export const loadSymptoms = createAsyncThunk(
  'symptom/load',
  async ({ species, lang }) => {
    const dbItems = await fetchSymptomsBySpecies(species, lang)
    if (dbItems && dbItems.length) return { items: dbItems, source: 'db' }
    return { items: symptomsData[species] || [], source: 'static' }
  },
)

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
    items: [],
    source: 'static',
    loading: false,
  },
  reducers: {
    setSpecies(state, action) {
      state.species = action.payload
      // Yangi tur tanlanganda oldingi natija va ro'yxatni tozalaymiz
      state.result = null
      state.searched = false
      state.items = []
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

      // Supabase'dan yuklangan ro'yxat, bo'lmasa statik zaxira
      const list = state.items.length ? state.items : symptomsData[species] || []
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
      state.items = []
      state.source = 'static'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSymptoms.pending, (state) => {
        state.loading = true
      })
      .addCase(loadSymptoms.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.source = action.payload.source
      })
      .addCase(loadSymptoms.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setSpecies, setSymptom, searchSymptom, reset } = symptomSlice.actions
export default symptomSlice.reducer
