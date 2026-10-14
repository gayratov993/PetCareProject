import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'

/**
 * Profil ma'lumotini olish (role bilan birga).
 */
async function fetchProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

/**
 * Supabase orqali login qilish.
 * Email va parol bilan tizimga kiradi.
 */
export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  if (!isSupabaseConfigured) {
    return rejectWithValue('SUPABASE_NOT_CONFIGURED')
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return rejectWithValue(error.message)
  const profile = await fetchProfile(data.user.id)
  return { user: data.user, profile }
})

/**
 * Supabase orqali ro'yxatdan o'tish.
 * Ro'yxatdan o'tgach, foydalanuvchi profiling (full_name) ham yaratiladi.
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return rejectWithValue(error.message)

    // Profil jadvaliga foydalanuvchi haqida ma'lumot yozamiz
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
      })
      if (profileError) return rejectWithValue(profileError.message)
    }
    const profile = await fetchProfile(data.user.id)
    return { user: data.user, profile }
  },
)

/**
 * Parolni tiklash — foydalanuvchi emailiga qayta tiklash havolasi yuboriladi.
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) return rejectWithValue(error.message)
    return true
  },
)

/**
 * Hozirgi sessiyani tekshirish (sahifa yangilanganda user saqlanib qoladi).
 */
export const fetchSession = createAsyncThunk('auth/session', async (_, { rejectWithValue }) => {
  if (!isSupabaseConfigured) return { user: null, profile: null }
  const { data, error } = await supabase.auth.getSession()
  if (error) return rejectWithValue(error.message)
  const user = data.session?.user ?? null
  const profile = await fetchProfile(user?.id)
  return { user, profile }
})

/**
 * Profildan foydalanuvchi hayvonlarini olish.
 */
export const fetchUserPets = createAsyncThunk('auth/fetchPets', async (userId, { rejectWithValue }) => {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return rejectWithValue(error.message)
  return data
})

/**
 * Yangi hayvon qo'shish.
 */
export const addPet = createAsyncThunk(
  'auth/addPet',
  async ({ userId, name, species, breed, age }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('pets')
      .insert({ user_id: userId, name, species, breed, age })
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Hayvon ma'lumotini tahrirlash.
 */
export const updatePet = createAsyncThunk(
  'auth/updatePet',
  async ({ id, name, species, breed, age }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('pets')
      .update({ name, species, breed, age })
      .eq('id', id)
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Hayvonni o'chirish.
 */
export const deletePet = createAsyncThunk(
  'auth/deletePet',
  async (id, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { error } = await supabase.from('pets').delete().eq('id', id)
    if (error) return rejectWithValue(error.message)
    return id
  },
)

/**
 * Profil ma'lumotini yangilash (full_name).
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, fullName }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', id)
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Parolni o'zgartirish.
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (password, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return rejectWithValue(error.message)
    return true
  },
)

/**
 * Foydalanuvchi eslatmalarini olish.
 */
export const fetchReminders = createAsyncThunk(
  'auth/fetchReminders',
  async (userId, { rejectWithValue }) => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('time', { ascending: true })
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Yangi eslatma qo'shish.
 */
export const addReminder = createAsyncThunk(
  'auth/addReminder',
  async ({ userId, petId, title, time, days, notes }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('reminders')
      .insert({ user_id: userId, pet_id: petId || null, title, time, days, notes })
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Eslatmani yangilash (tahrirlash yoki active holatini almashtirish).
 */
export const updateReminder = createAsyncThunk(
  'auth/updateReminder',
  async ({ id, ...updates }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Eslatmani o'chirish.
 */
export const deleteReminder = createAsyncThunk(
  'auth/deleteReminder',
  async (id, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { error } = await supabase.from('reminders').delete().eq('id', id)
    if (error) return rejectWithValue(error.message)
    return id
  },
)

/**
 * Foydalanuvchi so'rovlarini olish.
 */
export const fetchUserConsultations = createAsyncThunk(
  'auth/fetchConsultations',
  async (userId, { rejectWithValue }) => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) return rejectWithValue(error.message)
    return data
  },
)

// ============================================
// ADMIN
// ============================================

/**
 * Admin statistikalarini olish.
 */
export const fetchAdminStats = createAsyncThunk(
  'admin/stats',
  async (_, { rejectWithValue }) => {
    if (!isSupabaseConfigured) return null
    const count = async (table, filter) => {
      let query = supabase.from(table).select('*', { count: 'exact', head: true })
      if (filter) query = query.eq(filter.field, filter.value)
      const { count: c } = await query
      return c ?? 0
    }
    try {
      const totalUsers = await count('profiles')
      const totalPets = await count('pets')
      const totalConsultations = await count('consultations')
      const pendingConsultations = await count('consultations', { field: 'status', value: 'yangi' })
      return { totalUsers, totalPets, totalConsultations, pendingConsultations }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

/**
 * Barcha konsultatsiya so'rovlarini olish.
 */
export const fetchAllConsultations = createAsyncThunk(
  'admin/consultations',
  async (_, { rejectWithValue }) => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Barcha foydalanuvchilarni olish (profiles jadvalidan).
 */
export const fetchAllUsers = createAsyncThunk(
  'admin/users',
  async (_, { rejectWithValue }) => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Konsultatsiya statusini o'zgartirish.
 */
export const updateConsultationStatus = createAsyncThunk(
  'admin/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { data, error } = await supabase
      .from('consultations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) return rejectWithValue(error.message)
    return data
  },
)

/**
 * Konsultatsiyani o'chirish.
 */
export const deleteConsultation = createAsyncThunk(
  'admin/deleteConsultation',
  async (id, { rejectWithValue }) => {
    if (!isSupabaseConfigured) {
      return rejectWithValue('SUPABASE_NOT_CONFIGURED')
    }
    const { error } = await supabase.from('consultations').delete().eq('id', id)
    if (error) return rejectWithValue(error.message)
    return id
  },
)

/**
 * Tizimdan chiqish — Supabase sessiyasini ham tozalaydi.
 * Reducer toza bo'lishi uchun yon ta'sir (signOut) shu thunk ichida.
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
  }
  return true
})

/**
 * Auth state'ni boshlang'ich holatga qaytaradi.
 */
function resetAuthState(state) {
  state.user = null
  state.profile = null
  state.pets = []
  state.consultations = []
  state.reminders = []
  state.adminStats = null
  state.allConsultations = []
  state.allUsers = []
  state.error = null
}

/**
 * Auth state uchun Redux slice.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    loading: false,
    sessionLoading: true,
    error: null,
    pets: [],
    consultations: [],
    reminders: [],
    adminStats: null,
    allConsultations: [],
    allUsers: [],
    adminLoading: false,
  },
  reducers: {
    logout(state) {
      resetAuthState(state)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchSession.pending, (state) => {
        state.sessionLoading = true
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.sessionLoading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
      })
      .addCase(fetchSession.rejected, (state) => {
        state.sessionLoading = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        resetAuthState(state)
      })
      .addCase(fetchUserPets.fulfilled, (state, action) => {
        state.pets = action.payload
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.pets = [action.payload, ...state.pets]
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        const updated = action.payload
        state.pets = state.pets.map((p) => (p.id === updated.id ? updated : p))
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((p) => p.id !== action.payload)
      })
      .addCase(fetchUserConsultations.fulfilled, (state, action) => {
        state.consultations = action.payload
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.reminders = action.payload
      })
      .addCase(addReminder.fulfilled, (state, action) => {
        state.reminders = [...state.reminders, action.payload].sort((a, b) =>
          a.time.localeCompare(b.time),
        )
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        const updated = action.payload
        state.reminders = state.reminders.map((r) => (r.id === updated.id ? updated : r))
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter((r) => r.id !== action.payload)
      })
      .addCase(fetchAdminStats.pending, (state) => {
        state.adminLoading = true
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.adminLoading = false
        state.adminStats = action.payload
      })
      .addCase(fetchAdminStats.rejected, (state) => {
        state.adminLoading = false
      })
      .addCase(fetchAllConsultations.fulfilled, (state, action) => {
        state.allConsultations = action.payload
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload
      })
      .addCase(updateConsultationStatus.fulfilled, (state, action) => {
        const updated = action.payload
        state.allConsultations = state.allConsultations.map((c) =>
          c.id === updated.id ? updated : c,
        )
        state.consultations = state.consultations.map((c) =>
          c.id === updated.id ? updated : c,
        )
      })
      .addCase(deleteConsultation.fulfilled, (state, action) => {
        state.allConsultations = state.allConsultations.filter((c) => c.id !== action.payload)
        state.consultations = state.consultations.filter((c) => c.id !== action.payload)
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
