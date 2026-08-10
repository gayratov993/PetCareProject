import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { KeyRound, Mail } from 'lucide-react'
import Input from '../../../components/common/Input.jsx'
import Button from '../../../components/common/Button.jsx'
import Modal from '../../../components/common/Modal.jsx'
import { loginUser, resetPassword } from '../authSlice.js'
import { isSupabaseConfigured } from '../../../lib/supabaseClient.js'

/**
 * Kirish (Login) formasi.
 * Supabase Auth orqali email+parol bilan tizimga kiradi.
 */
export default function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const schema = z.object({
    email: z.string().email(t('auth.emailInvalid')),
    password: z.string().min(6, t('auth.passwordMin')),
  })

  const resetSchema = z.object({
    email: z.string().email(t('auth.emailInvalid')),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm({ resolver: zodResolver(resetSchema) })

  const onSubmit = async (data) => {
    // Supabase sozlanmagan bo'lsa — demo rejim
    if (!isSupabaseConfigured) {
      toast.error(t('auth.loginError'))
      return
    }
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      toast.success(t('auth.loginSuccess'))
      navigate('/profile')
    } else {
      toast.error(t('auth.loginError'))
    }
  }

  const onResetSubmit = async (data) => {
    if (!isSupabaseConfigured) return
    setResetLoading(true)
    const result = await dispatch(resetPassword(data.email))
    setResetLoading(false)
    if (resetPassword.fulfilled.match(result)) {
      toast.success(t('auth.resetSent'))
      setResetOpen(false)
    } else {
      toast.error(t('auth.resetError'))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="email"
          label={t('auth.email')}
          placeholder="you@example.com"
          register={register('email')}
          error={errors.email?.message}
        />
        <div>
          <Input
            type="password"
            label={t('auth.password')}
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
          />
          <div className="mt-1.5 text-right">
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '...' : t('auth.loginBtn')}
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </form>

      {/* Parolni tiklash modali */}
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title={t('auth.forgotPassword')}
        subtitle={t('auth.resetHint')}
      >
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
          <Input
            type="email"
            label={t('auth.email')}
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5" />}
            register={registerReset('email')}
            error={resetErrors.email?.message}
          />
          <Button type="submit" disabled={resetLoading} className="w-full">
            {resetLoading ? '...' : <KeyRound className="h-4 w-4" />}{' '}
            {t('auth.sendReset')}
          </Button>
        </form>
      </Modal>
    </>
  )
}
