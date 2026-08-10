import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../../../components/common/Input.jsx'
import Button from '../../../components/common/Button.jsx'
import { registerUser } from '../authSlice.js'
import { isSupabaseConfigured } from '../../../lib/supabaseClient.js'

/**
 * Ro'yxatdan o'tish (Register) formasi.
 * Supabase Auth orqali yangi foydalanuvchi yaratiladi va profile yoziladi.
 */
export default function RegisterForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const schema = z
    .object({
      fullName: z.string().min(1, t('auth.nameRequired')),
      email: z.string().email(t('auth.emailInvalid')),
      password: z.string().min(6, t('auth.passwordMin')),
      confirmPassword: z.string().min(6, t('auth.passwordMin')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordMismatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    // Supabase sozlanmagan bo'lsa — demo rejim
    if (!isSupabaseConfigured) {
      toast.error(t('auth.registerError'))
      return
    }
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      toast.success(t('auth.registerSuccess'))
      navigate('/profile')
    } else {
      toast.error(t('auth.registerError'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label={t('auth.fullName')}
        placeholder="Aziz Rahimov"
        register={register('fullName')}
        error={errors.fullName?.message}
      />
      <Input
        type="email"
        label={t('auth.email')}
        placeholder="you@example.com"
        register={register('email')}
        error={errors.email?.message}
      />
      <Input
        type="password"
        label={t('auth.password')}
        placeholder="••••••••"
        register={register('password')}
        error={errors.password?.message}
      />
      <Input
        type="password"
        label={t('auth.confirmPassword')}
        placeholder="••••••••"
        register={register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '...' : t('auth.registerBtn')}
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          {t('nav.login')}
        </Link>
      </p>
    </form>
  )
}
