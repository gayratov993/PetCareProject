import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'

/**
 * Muayyan hayvon turi uchun yosh guruhlari bo'yicha ratsion matnini Supabase'dan oladi.
 * Supabase sozlanmagan yoki yozuv bo'lmasa — null (statik zaxira ishlatiladi).
 */
export async function fetchNutritionAges(species, lang = 'uz') {
  if (!isSupabaseConfigured || !species) return null

  const { data, error } = await supabase
    .from('nutrition')
    .select('*')
    .eq('species', species)
    .maybeSingle()

  if (error || !data) return null

  const localized = data[`ages_${lang}`]
  if (localized && Object.keys(localized).length) return localized
  if (data.ages_uz && Object.keys(data.ages_uz).length) return data.ages_uz
  return null
}
