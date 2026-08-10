import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Input from '../../../components/common/Input.jsx'
import Textarea from '../../../components/common/Textarea.jsx'
import Button from '../../../components/common/Button.jsx'
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient.js'

/**
 * Veterinar konsultatsiyasi so'rov formasi.
 * Forma Supabase'dagi `consultations` jadvaliga yoziladi.
 */
export default function ConsultationForm() {
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth.user)

  const schema = z.object({
    fullName: z.string().min(1, t('consultation.required')),
    petName: z.string().min(1, t('consultation.required')),
    species: z.string().min(1, t('consultation.required')),
    description: z.string().min(5, t('consultation.required')),
    contact: z.string().min(5, t('consultation.required')),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      // Supabase sozlanmagan bo'lsa — simulyatsiya qilamiz
      if (!isSupabaseConfigured) {
        toast.success(t('consultation.success'))
        reset()
        return
      }

      const { error } = await supabase.from('consultations').insert({
        user_id: user?.id || null,
        pet_name: data.petName,
        species: data.species,
        description: data.description,
        contact: data.contact,
        status: 'yangi',
      })
      if (error) throw error
      toast.success(t('consultation.success'))
      reset()
    } catch (err) {
      console.error(err)
      toast.error(t('consultation.error'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('consultation.fullName')}
          placeholder="Aziz Rahimov"
          register={register('fullName')}
          error={errors.fullName?.message}
        />
        <Input
          label={t('consultation.petName')}
          placeholder="Rex"
          register={register('petName')}
          error={errors.petName?.message}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('consultation.species')}
          placeholder={t('consultation.speciesPlaceholder')}
          register={register('species')}
          error={errors.species?.message}
        />
        <Input
          label={t('consultation.contact')}
          placeholder={t('consultation.contactPlaceholder')}
          register={register('contact')}
          error={errors.contact?.message}
        />
      </div>

      <Textarea
        label={t('consultation.description')}
        placeholder={t('consultation.descriptionPlaceholder')}
        register={register('description')}
        error={errors.description?.message}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? '...' : t('consultation.submit')}
      </Button>
    </form>
  )
}
