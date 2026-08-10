import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase klient sozlamasi.
 *
 * Ulash uchun:
 * 1. supabase.com saytida bepul loyiha yarating
 * 2. Project Settings → API bo'limidan Project URL va anon public key ni oling
 * 3. Ularini .env fayliga yozing:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=eyJhbGci...
 *
 * Agar kalitlar yozilmagan bo'lsa, app ishdan chiqmaydi,
 * shunchaki funksiyalar (auth, konsultatsiya) ishlamaydi.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConfigured = Boolean(supabase)
