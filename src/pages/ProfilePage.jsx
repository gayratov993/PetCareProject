import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Plus, ClipboardList, CalendarDays, HeartHandshake, Mail, MessageSquare, Pencil, Trash2, Bell, KeyRound, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Modal from '../components/common/Modal.jsx'
import Loader from '../components/common/Loader.jsx'
import { petImage } from '../lib/petImages.js'
import {
  fetchUserPets,
  fetchUserConsultations,
  addPet,
  updatePet,
  deletePet,
  updateProfile,
  changePassword,
} from '../features/auth/authSlice.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

const statusBadge = {
  yangi: 'badge-green',
  jarayonda: 'badge-blue',
  bajarildi: 'badge-purple',
  rad_etildi: 'badge-amber',
}

const statusDot = {
  yangi: 'bg-primary-500',
  jarayonda: 'bg-blue-500',
  bajarildi: 'bg-purple-500',
  rad_etildi: 'bg-accent-500',
}

/**
 * Profil sahifasi.
 * Foydalanuvchi o'z hayvonlari va oldingi so'rovlarini ko'radi, yangi hayvon qo'shadi.
 */
export default function ProfilePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, profile, pets, consultations, loading } = useSelector((state) => state.auth)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [form, setForm] = useState({ name: '', species: '', breed: '', age: '' })
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [nameForm, setNameForm] = useState('')
  const [passForm, setPassForm] = useState({ password: '', confirm: '' })

  useEffect(() => {
    if (!user) return
    if (isSupabaseConfigured) {
      dispatch(fetchUserPets(user.id))
      dispatch(fetchUserConsultations(user.id))
    }
  }, [user, dispatch])

  // Foydalanuvchi kirmagan bo'lsa login sahifasiga yuboramiz
  if (!user && !loading) {
    navigate('/login')
    return null
  }

  if (!user) return <Loader fullScreen />

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : new Date().toLocaleDateString()

  const handleAddPet = async () => {
    if (!form.name || !form.species) {
      toast.error(t('consultation.required'))
      return
    }
    const payload = { name: form.name, species: form.species, breed: form.breed, age: form.age }
    const action = editingPet
      ? updatePet({ id: editingPet.id, ...payload })
      : addPet({ userId: user.id, ...payload })
    const result = await dispatch(action)
    if ((addPet.fulfilled.match(result) || updatePet.fulfilled.match(result))) {
      toast.success(t('profile.save'))
      setModalOpen(false)
      setEditingPet(null)
      setForm({ name: '', species: '', breed: '', age: '' })
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const openAddModal = () => {
    setEditingPet(null)
    setForm({ name: '', species: '', breed: '', age: '' })
    setModalOpen(true)
  }

  const openEditModal = (pet) => {
    setEditingPet(pet)
    setForm({ name: pet.name, species: pet.species, breed: pet.breed || '', age: pet.age || '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPet(null)
    setForm({ name: '', species: '', breed: '', age: '' })
  }

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`${t('profile.deleteConfirm')} "${pet.name}"?`)) return
    const result = await dispatch(deletePet(pet.id))
    if (deletePet.fulfilled.match(result)) {
      toast.success(t('profile.petDeleted'))
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const openNameModal = () => {
    setNameForm(profile?.full_name || '')
    setNameModalOpen(true)
  }

  const saveName = async () => {
    if (!nameForm.trim()) {
      toast.error(t('consultation.required'))
      return
    }
    const result = await dispatch(updateProfile({ id: user.id, fullName: nameForm.trim() }))
    if (updateProfile.fulfilled.match(result)) {
      toast.success(t('profile.saved'))
      setNameModalOpen(false)
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const savePassword = async () => {
    if (passForm.password.length < 6) {
      toast.error(t('auth.passwordMin'))
      return
    }
    if (passForm.password !== passForm.confirm) {
      toast.error(t('auth.passwordMismatch'))
      return
    }
    const result = await dispatch(changePassword(passForm.password))
    if (changePassword.fulfilled.match(result)) {
      toast.success(t('profile.passwordChanged'))
      setPassModalOpen(false)
      setPassForm({ password: '', confirm: '' })
    } else {
      toast.error(t('auth.resetError'))
    }
  }

  return (
    <div className="pb-16">
      {/* Yuqori qism — gradient cover + avatar */}
      <section className="relative overflow-hidden bg-mesh pb-24 pt-12">
        <div className="bg-paw-pattern absolute inset-0" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="container-app relative">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-teal-600 text-4xl font-bold text-white shadow-glow">
                {(profile?.full_name || user.email || '?')
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white dark:border-gray-900">
                <PawPrint className="h-4 w-4" />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                {profile?.full_name || t('profile.title')}
              </h1>
              <p className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600 sm:justify-start dark:text-gray-300">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  {t('profile.memberSince')}: {memberSince}
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistikalar va kontent */}
      <div className="container-app -mt-12">
        {/* Statistika */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-lift flex items-center gap-4 p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {pets.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.myPets')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-lift flex items-center gap-4 p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-orange-500 text-white shadow-soft">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {consultations.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.myConsultations')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Hisob sozlamalari */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <button
            onClick={openNameModal}
            className="card-lift flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft">
              <User className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display font-bold text-gray-900 dark:text-white">
                {t('profile.editName')}
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {profile?.full_name || '—'}
              </span>
            </span>
          </button>

          <button
            onClick={() => setPassModalOpen(true)}
            className="card-lift flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-orange-500 text-white shadow-soft">
              <KeyRound className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display font-bold text-gray-900 dark:text-white">
                {t('profile.changePassword')}
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {t('profile.passwordHint')}
              </span>
            </span>
          </button>

          <Link
            to="/reminders"
            className="card-lift flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-soft">
              <Bell className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display font-bold text-gray-900 dark:text-white">
                {t('nav.reminders')}
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {t('profile.remindersHint')}
              </span>
            </span>
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Hayvonlar */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
                <PawPrint className="h-5 w-5 text-primary-600" />
                {t('profile.myPets')}
              </h2>
              <Button
                variant="primary"
                className="!px-4 !py-2 text-sm"
                onClick={openAddModal}
              >
                <Plus className="h-4 w-4" /> {t('profile.addPet')}
              </Button>
            </div>

            {pets.length === 0 ? (
              <div className="card-lift flex flex-col items-center justify-center border-dashed p-10 text-center">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-400 dark:bg-gray-700">
                  <PawPrint className="h-8 w-8" />
                </span>
                <p className="font-display font-semibold text-gray-700 dark:text-gray-200">
                  {t('profile.noPets')}
                </p>
                <Button variant="secondary" className="mt-5 !px-4 !py-2 text-sm" onClick={openAddModal}>
                  <Plus className="h-4 w-4" /> {t('profile.addPet')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pets.map((pet, i) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-lift group relative overflow-hidden p-5"
                  >
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary-500 to-teal-500" />
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-md">
                        <img
                          src={petImage(pet.species)}
                          alt={pet.species}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg font-bold capitalize text-gray-900 dark:text-white">
                          {pet.name}
                        </p>
                        <p className="mt-0.5 flex flex-wrap gap-x-2 text-sm capitalize text-gray-500 dark:text-gray-400">
                          <span className="text-primary-600 dark:text-primary-400">
                            {pet.species}
                          </span>
                          {pet.breed && <span>· {pet.breed}</span>}
                          {pet.age && <span>· {pet.age}</span>}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openEditModal(pet)}
                          aria-label={t('profile.edit')}
                          title={t('profile.edit')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet)}
                          aria-label={t('profile.delete')}
                          title={t('profile.delete')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* So'rovlar */}
          <div>
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
              <ClipboardList className="h-5 w-5 text-primary-600" />
              {t('profile.myConsultations')}
            </h2>

            {consultations.length === 0 ? (
              <div className="card-lift flex flex-col items-center justify-center border-dashed p-10 text-center">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-400 dark:bg-gray-700">
                  <MessageSquare className="h-8 w-8" />
                </span>
                <p className="font-display font-semibold text-gray-700 dark:text-gray-200">
                  {t('profile.noConsultations')}
                </p>
                <Link
                  to="/vet-consultation"
                  className="btn-secondary mt-5 !px-4 !py-2 text-sm"
                >
                  {t('nav.consultation')} →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-lift p-5"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-display font-bold capitalize text-gray-900 dark:text-white">
                        <HeartHandshake className="h-4 w-4 text-primary-500" />
                        {item.pet_name}
                      </p>
                      <span className={statusBadge[item.status] || 'badge-gray'}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[item.status] || 'bg-gray-400'}`} />
                        {item.status}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                    <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                      {t('profile.createdAt')}:{' '}
                      {new Date(item.created_at).toLocaleDateString()} ·{' '}
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hayvon qo'shish / tahrirlash modali */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingPet ? t('profile.editPet') : t('profile.addPet')}
        subtitle={t('profile.petInfo')}
      >
        <div className="space-y-4">
          <Input
            label={t('profile.petName')}
            placeholder="Rex"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('profile.species')}
              placeholder={t('consultation.speciesPlaceholder')}
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            />
            <Input
              label={t('profile.breed')}
              placeholder="Labrador"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
          </div>
          <Input
            label={t('profile.age')}
            placeholder="2 yosh"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <Button onClick={handleAddPet} className="w-full">
            {editingPet ? <Pencil className="h-4 w-4" /> : <PawPrint className="h-4 w-4" />}{' '}
            {editingPet ? t('profile.saveChanges') : t('profile.save')}
          </Button>
        </div>
      </Modal>

      {/* Ismni tahrirlash modali */}
      <Modal
        open={nameModalOpen}
        onClose={() => setNameModalOpen(false)}
        title={t('profile.editName')}
        subtitle={user.email}
      >
        <div className="space-y-4">
          <Input
            label={t('auth.fullName')}
            placeholder="Aziz Rahimov"
            value={nameForm}
            onChange={(e) => setNameForm(e.target.value)}
          />
          <Button onClick={saveName} className="w-full">
            <User className="h-4 w-4" /> {t('profile.saveChanges')}
          </Button>
        </div>
      </Modal>

      {/* Parolni o'zgartirish modali */}
      <Modal
        open={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        title={t('profile.changePassword')}
        subtitle={t('profile.passwordHint')}
      >
        <div className="space-y-4">
          <Input
            type="password"
            label={t('auth.password')}
            placeholder="••••••••"
            value={passForm.password}
            onChange={(e) => setPassForm({ ...passForm, password: e.target.value })}
          />
          <Input
            type="password"
            label={t('auth.confirmPassword')}
            placeholder="••••••••"
            value={passForm.confirm}
            onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
          />
          <Button onClick={savePassword} className="w-full">
            <KeyRound className="h-4 w-4" /> {t('profile.saveChanges')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
