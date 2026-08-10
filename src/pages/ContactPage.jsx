import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Input from '../components/common/Input.jsx'
import Textarea from '../components/common/Textarea.jsx'
import Button from '../components/common/Button.jsx'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

/**
 * Kontakt sahifasi.
 * Kontakt formasi Supabase'dagi messages jadvaliga saqlanadi va aloqa ma'lumotlari ko'rsatiladi.
 */
export default function ContactPage() {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const schema = z.object({
    name: z.string().min(1, t('consultation.required')),
    email: z.string().email(t('auth.emailInvalid')),
    message: z.string().min(5, t('consultation.required')),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setSending(true)
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('messages').insert({
          name: data.name,
          email: data.email,
          message: data.message,
        })
        if (error) throw error
      }
      toast.success(t('contact.success'))
      reset()
    } catch {
      toast.error(t('consultation.error'))
    } finally {
      setSending(false)
    }
  }

  const contacts = [
    { icon: Phone, title: t('contact.phone'), value: '+998 90 123 45 67' },
    { icon: Mail, title: 'Email', value: 'info@petcare.uz' },
    { icon: MapPin, title: t('contact.address'), value: t('contact.addressValue') },
    { icon: Clock, title: t('contact.hours'), value: t('contact.hoursValue') },
  ]

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('contact.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('contact.subtitle')}
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Forma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-800"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('contact.name')}
              placeholder="Aziz Rahimov"
              register={register('name')}
              error={errors.name?.message}
            />
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              register={register('email')}
              error={errors.email?.message}
            />
            <Textarea
              label={t('contact.message')}
              placeholder={t('consultation.descriptionPlaceholder')}
              register={register('message')}
              error={errors.message?.message}
            />
            <Button type="submit" disabled={sending} className="w-full sm:w-auto">
              {sending ? '...' : t('contact.send')}
            </Button>
          </form>
        </motion.div>

        {/* Kontakt ma'lumotlari */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {contacts.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
