import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'

/**
 * Berilgan tildagi massivni tanlaydi, bo'sh bo'lsa o'zbekcha zaxiraga qaytadi.
 */
function pickLangArray(row, field, lang) {
  const value = row[`${field}_${lang}`]
  if (Array.isArray(value) && value.length) return value
  const uz = row[`${field}_uz`]
  return Array.isArray(uz) ? uz : []
}

/**
 * Muayyan hayvon turi uchun muammolar ro'yxatini Supabase'dan oladi.
 * Supabase sozlanmagan yoki jadval bo'sh bo'lsa — null qaytaradi (ilova statik zaxirani ishlatadi).
 */
export async function fetchSymptomsBySpecies(species, lang = 'uz') {
  if (!isSupabaseConfigured || !species) return null

  const { data, error } = await supabase
    .from('symptoms')
    .select('*')
    .eq('species', species)
    .order('sort_order', { ascending: true })

  if (error || !data || data.length === 0) return null

  return data
    .map((row) => ({
      symptom: row[`symptom_name_${lang}`] || row.symptom_name_uz,
      causes: pickLangArray(row, 'causes', lang),
      recommendations: pickLangArray(row, 'recommendations', lang),
    }))
    .filter((item) => item.symptom)
}
