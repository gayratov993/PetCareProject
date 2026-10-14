import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Select from '../components/common/Select.jsx'
import NutritionCard from '../features/nutrition/components/NutritionCard.jsx'
import { fetchNutritionAges } from '../features/nutrition/nutritionApi.js'

const petOptions = [
  { value: 'dog' },
  { value: 'cat' },
  { value: 'rabbit' },
  { value: 'bird' },
  { value: 'hamster' },
]

/**
 * Oziqlantirish sahifasi.
 * Hayvon turi va yosh guruhi bo'yicha ratsion tavsiyalari.
 */
export default function NutritionPage() {
  const { t, i18n } = useTranslation()
  const [species, setSpecies] = useState('dog')
  const [ageGroup, setAgeGroup] = useState('adult')
  const [ages, setAges] = useState(null)

  // Supabase'dan yosh bo'yicha ratsion matnini olamiz (bo'lmasa statik zaxira ishlatiladi)
  useEffect(() => {
    let active = true
    fetchNutritionAges(species, i18n.language).then((data) => {
      if (active) setAges(data)
    })
    return () => {
      active = false
    }
  }, [species, i18n.language])

  const petSelectOptions = petOptions.map((p) => ({
    value: p.value,
    label: t(`symptomChecker.pets.${p.value}`),
  }))

  const ageOptions = [
    { value: 'puppy', label: t('nutrition.agePuppy') },
    { value: 'adult', label: t('nutrition.ageAdult') },
    { value: 'senior', label: t('nutrition.ageSenior') },
  ]

  const tips = [
    t('nutrition.tip1'),
    t('nutrition.tip2'),
    t('nutrition.tip3'),
    t('nutrition.tip4'),
  ]

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('nutrition.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('nutrition.subtitle')}
        </p>
      </motion.div>

      {/* Filtrlar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 grid gap-4 sm:grid-cols-2"
      >
        <Select
          label={t('nutrition.selectPet')}
          options={petSelectOptions}
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        />
        <Select
          label={t('nutrition.selectAge')}
          options={ageOptions}
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
        />
      </motion.div>

      {/* Natija */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <NutritionCard species={species} ageGroup={ageGroup} ages={ages} />
      </motion.div>

      {/* Maslahatlar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t('nutrition.dietTips')}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
