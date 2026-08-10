import { useTranslation } from 'react-i18next'
import Button from '../../../components/common/Button.jsx'
import Textarea from '../../../components/common/Textarea.jsx'

/**
 * Muammoni kiritish formasi.
 * Foydalanuvchi muammoni tanlaydi yoki o'zi yozadi.
 */
export default function SymptomForm({ symptom, onSymptomChange, onSearch, onReset }) {
  const { t } = useTranslation()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
      className="space-y-4"
    >
      <Textarea
        label={t('symptomChecker.writeSymptom')}
        placeholder={t('symptomChecker.symptomPlaceholder')}
        value={symptom}
        onChange={(e) => onSymptomChange(e.target.value)}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="flex-1">
          {t('symptomChecker.getResult')}
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          {t('symptomChecker.reset')}
        </Button>
      </div>
    </form>
  )
}
