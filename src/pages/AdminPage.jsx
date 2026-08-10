import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  PawPrint,
  ClipboardList,
  Clock,
  Trash2,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Loader from '../components/common/Loader.jsx'
import { petImage } from '../lib/petImages.js'
import {
  fetchAdminStats,
  fetchAllConsultations,
  fetchAllUsers,
  updateConsultationStatus,
  deleteConsultation,
} from '../features/auth/authSlice.js'

const STATUS_OPTIONS = ['yangi', 'jarayonda', 'bajarildi', 'rad_etildi']

const statusBadge = {
  yangi: 'badge-green',
  jarayonda: 'badge-blue',
  bajarildi: 'badge-purple',
  rad_etildi: 'badge-amber',
}

const statusBtnActive = {
  yangi: 'bg-primary-500 text-white border-primary-500',
  jarayonda: 'bg-blue-500 text-white border-blue-500',
  bajarildi: 'bg-purple-500 text-white border-purple-500',
  rad_etildi: 'bg-accent-500 text-white border-accent-500',
}

const statusBtnIdle =
  'border border-gray-300 text-gray-600 hover:border-primary-400 dark:border-gray-600 dark:text-gray-300'

const statCards = (t) => [
  {
    label: t('admin.totalUsers'),
    key: 'totalUsers',
    icon: Users,
    gradient: 'from-primary-500 to-teal-600',
  },
  {
    label: t('admin.totalPets'),
    key: 'totalPets',
    icon: PawPrint,
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    label: t('admin.totalConsultations'),
    key: 'totalConsultations',
    icon: ClipboardList,
    gradient: 'from-accent-400 to-orange-500',
  },
  {
    label: t('admin.pending'),
    key: 'pendingConsultations',
    icon: Clock,
    gradient: 'from-emerald-500 to-primary-600',
  },
]

/**
 * Admin panel.
 * Faqat admin rolidagi foydalanuvchilar uchun: statistika, barcha so'rovlar va foydalanuvchilar.
 */
export default function AdminPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, profile, loading, adminStats, allConsultations, allUsers } = useSelector(
    (state) => state.auth,
  )
  const [tab, setTab] = useState('consultations')
  const [busyId, setBusyId] = useState(null)

  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    if (!user) return
    if (isAdmin) {
      dispatch(fetchAdminStats())
      dispatch(fetchAllConsultations())
      dispatch(fetchAllUsers())
    }
  }, [user, isAdmin, dispatch])

  // Kirilmagan bo'lsa — login sahifasiga
  if (!user && !loading) {
    navigate('/login')
    return null
  }

  // Profil hali yuklanmagan bo'lsa
  if (!profile) return <Loader fullScreen />

  // Admin emas — bosh sahifaga qaytaramiz
  if (!isAdmin) {
    navigate('/')
    return null
  }

  const handleStatus = async (id, status) => {
    setBusyId(id)
    const result = await dispatch(updateConsultationStatus({ id, status }))
    setBusyId(null)
    if (updateConsultationStatus.fulfilled.match(result)) {
      toast.success(t('admin.statusUpdated'))
      dispatch(fetchAdminStats())
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    setBusyId(id)
    const result = await dispatch(deleteConsultation(id))
    setBusyId(null)
    if (deleteConsultation.fulfilled.match(result)) {
      toast.success(t('admin.deleted'))
      dispatch(fetchAdminStats())
    } else {
      toast.error(t('consultation.error'))
    }
  }

  return (
    <div className="pb-16">
      {/* Sarlavha */}
      <section className="relative overflow-hidden bg-mesh pb-16 pt-12">
        <div className="bg-paw-pattern absolute inset-0" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="container-app relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-glow">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                {t('admin.title')}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                {t('admin.subtitle')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-app -mt-8">
        {/* Statistika */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards(t).map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-lift flex items-center gap-4 p-5"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft ${card.gradient}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                  {adminStats?.[card.key] ?? '—'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab tugmalari */}
        <div className="mb-6 flex w-fit items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setTab('consultations')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'consultations'
                ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-soft'
                : 'text-gray-600 hover:text-primary-600 dark:text-gray-300'
            }`}
          >
            {t('admin.consultations')}
          </button>
          <button
            onClick={() => setTab('users')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'users'
                ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-soft'
                : 'text-gray-600 hover:text-primary-600 dark:text-gray-300'
            }`}
          >
            {t('admin.users')}
          </button>
        </div>

        {/* Konsultatsiyalar */}
        {tab === 'consultations' && (
          <div className="space-y-4">
            {allConsultations.length === 0 ? (
              <div className="card-lift flex flex-col items-center border-dashed p-12 text-center">
                <ClipboardList className="mb-3 h-12 w-12 text-primary-300 dark:text-primary-700" />
                <p className="font-display font-semibold text-gray-700 dark:text-gray-200">
                  {t('admin.noConsultations')}
                </p>
              </div>
            ) : (
              allConsultations.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className="card-lift p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-sm">
                          <img
                            src={petImage(item.species)}
                            alt={item.species}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="font-display text-lg font-bold capitalize text-gray-900 dark:text-white">
                          {item.pet_name}
                        </p>
                        <span className={statusBadge[item.status] || 'badge-gray'}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {t('consultation.species')}: {item.species} · {t('consultation.contact')}:{' '}
                        {item.contact} · {t('profile.createdAt')}:{' '}
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            disabled={busyId === item.id}
                            onClick={() => handleStatus(item.id, status)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                              item.status === status
                                ? statusBtnActive[status]
                                : statusBtnIdle
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      <button
                        disabled={busyId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-900/20"
                      >
                        {busyId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        {t('admin.delete')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Foydalanuvchilar */}
        {tab === 'users' && (
          <div className="card-lift overflow-hidden">
            {allUsers.length === 0 ? (
              <div className="flex flex-col items-center p-12 text-center">
                <Users className="mb-3 h-12 w-12 text-primary-300 dark:text-primary-700" />
                <p className="font-display font-semibold text-gray-700 dark:text-gray-200">
                  {t('admin.noUsers')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-lg font-bold text-white">
                      {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900 dark:text-white">
                        {u.full_name || '—'}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {u.role === 'admin' && (
                        <span className="badge-purple">
                          <ShieldCheck className="h-3 w-3" />
                          {t('admin.admin')}
                        </span>
                      )}
                      <span className="hidden text-xs text-gray-400 sm:block dark:text-gray-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
