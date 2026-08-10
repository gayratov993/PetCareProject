import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PetTypeSelector from '../features/petSymptomChecker/components/PetTypeSelector.jsx'
import SymptomForm from '../features/petSymptomChecker/components/SymptomForm.jsx'
import ResultCard from '../features/petSymptomChecker/components/ResultCard.jsx'
import { setSpecies, setSymptom, searchSymptom, reset } from '../features/petSymptomChecker/symptomSlice.js'

/**
 * Muammoni aniqlash sahifasi (Symptom Checker).
 * Hayvon turi + muammo tanlanadi, natija ko'rsatiladi.
 */
export default function SymptomCheckerPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { species, symptom, result, searched } = useSelector((state) => state.symptom)

  const handleSearch = () => {
    if (!species) return
    dispatch(searchSymptom())
  }

  const handleReset = () => dispatch(reset())

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('symptomChecker.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('symptomChecker.subtitle')}
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Chap: tanlash paneli */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Search className="h-5 w-5 text-primary-600" />
              {t('symptomChecker.selectPet')}
            </h2>
            <PetTypeSelector species={species} onSelect={(s) => dispatch(setSpecies(s))} />
          </motion.div>

          {species && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('symptomChecker.selectSymptom')}
              </h2>
              <SymptomForm
                symptom={symptom}
                onSymptomChange={(value) => dispatch(setSymptom(value))}
                onSearch={handleSearch}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </div>

        {/* O'ng: natija */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {searched && !result && (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-300">{t('symptomChecker.noResult')}</p>
            </div>
          )}
          {result && <ResultCard result={result} />}
        </motion.div>
      </div>
    </div>
  )
}
