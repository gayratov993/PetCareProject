import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Bell,
  BellOff,
  Plus,
  Clock,
  Pencil,
  Trash2,
  CalendarDays,
  PawPrint,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Textarea from '../components/common/Textarea.jsx'
import Select from '../components/common/Select.jsx'
import Modal from '../components/common/Modal.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import {
  fetchUserPets,
  fetchReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} from '../features/auth/authSlice.js'

const DAY_KEYS = ['du', 'se', 'ch', 'pa', 'ju', 'sh', 'ya']

const emptyForm = { title: '', petId: '', time: '09:00', days: [], notes: '' }

/**
 * Eslatmalar sahifasi.
 * Ovqatlantirish, dori berish va boshqa eslatmalarni yaratish, tahrirlash va o'chirish.
 */
export default function RemindersPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user, pets, reminders } = useSelector((state) => state.auth)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalForm, setModalForm] = useState(emptyForm)

  useEffect(() => {
    if (!user) return
    if (isSupabaseConfigured) {
      dispatch(fetchUserPets(user.id))
      dispatch(fetchReminders(user.id))
    }
  }, [user, dispatch])

  const petOptions = [
    { value: '', label: t('reminders.noPet') },
    ...pets.map((p) => ({ value: p.id, label: p.name })),
  ]

  const toggleDay = (days, key) =>
    days.includes(key) ? days.filter((d) => d !== key) : [...days, key]

  const submitAdd = async () => {
    if (!form.title || !form.time) {
      toast.error(t('consultation.required'))
      return
    }
    const result = await dispatch(
      addReminder({
        userId: user.id,
        petId: form.petId,
        title: form.title,
        time: form.time,
        days: form.days,
        notes: form.notes,
      }),
    )
    if (addReminder.fulfilled.match(result)) {
      toast.success(t('reminders.added'))
      setForm(emptyForm)
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const openEdit = (reminder) => {
    setEditing(reminder)
    setModalForm({
      title: reminder.title,
      petId: reminder.pet_id || '',
      time: reminder.time,
      days: reminder.days || [],
      notes: reminder.notes || '',
    })
    setModalOpen(true)
  }

  const submitEdit = async () => {
    if (!modalForm.title || !modalForm.time) {
      toast.error(t('consultation.required'))
      return
    }
    const result = await dispatch(
      updateReminder({
        id: editing.id,
        title: modalForm.title,
        pet_id: modalForm.petId || null,
        time: modalForm.time,
        days: modalForm.days,
        notes: modalForm.notes,
      }),
    )
    if (updateReminder.fulfilled.match(result)) {
      toast.success(t('reminders.saved'))
      setModalOpen(false)
      setEditing(null)
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const toggleActive = async (reminder) => {
    const result = await dispatch(
      updateReminder({ id: reminder.id, active: !reminder.active }),
    )
    if (updateReminder.fulfilled.match(result)) {
      toast.success(reminder.active ? t('reminders.disabled') : t('reminders.enabled'))
    }
  }

  const removeReminder = async (reminder) => {
    if (!window.confirm(`${t('reminders.deleteConfirm')} "${reminder.title}"?`)) return
    const result = await dispatch(deleteReminder(reminder.id))
    if (deleteReminder.fulfilled.match(result)) {
      toast.success(t('reminders.deleted'))
    } else {
      toast.error(t('consultation.error'))
    }
  }

  const dayChips = (days) =>
    DAY_KEYS.filter((k) => days?.includes(k)).map((k) => t(`reminders.days.${k}`))

  return (
    <div className="container-app py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-glow">
          <Bell className="h-8 w-8" />
        </span>
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {t('reminders.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('reminders.subtitle')}
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Qo'shish formasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="card-lift p-6">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-gray-900 dark:text-white">
              <Plus className="h-5 w-5 text-primary-600" /> {t('reminders.add')}
            </h2>
            <div className="space-y-4">
              <Input
                label={t('reminders.titleLabel')}
                placeholder={t('reminders.titlePlaceholder')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Select
                  label={t('reminders.pet')}
                  options={petOptions}
                  value={form.petId}
                  onChange={(e) => setForm({ ...form, petId: e.target.value })}
                />
                <Input
                  type="time"
                  label={t('reminders.time')}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('reminders.daysLabel')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DAY_KEYS.map((k) => {
                    const active = form.days.includes(k)
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setForm({ ...form, days: toggleDay(form.days, k) })}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft'
                            : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t(`reminders.days.${k}`)}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Textarea
                label={t('reminders.notes')}
                placeholder={t('reminders.notesPlaceholder')}
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <Button onClick={submitAdd} className="w-full">
                <Plus className="h-4 w-4" /> {t('reminders.addBtn')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Eslatmalar ro'yxati */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-primary-600" />
            {t('reminders.myReminders')}
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:bg-gray-800 dark:text-primary-300">
              {reminders.length}
            </span>
          </h2>

          {reminders.length === 0 ? (
            <div className="card-lift flex flex-col items-center justify-center border-dashed p-12 text-center">
              <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-400 dark:bg-gray-700">
                <BellOff className="h-8 w-8" />
              </span>
              <p className="font-display font-semibold text-gray-700 dark:text-gray-200">
                {t('reminders.empty')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder, i) => {
                const pet = pets.find((p) => p.id === reminder.pet_id)
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`card-lift p-5 ${!reminder.active ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg font-bold text-gray-900 dark:text-white">
                          {reminder.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="badge-green">
                            <Clock className="h-3 w-3" /> {reminder.time}
                          </span>
                          {pet && (
                            <span className="badge-blue">
                              <PawPrint className="h-3 w-3" /> {pet.name}
                            </span>
                          )}
                          <span className="badge-gray">
                            <CalendarDays className="h-3 w-3" />
                            {dayChips(reminder.days).join(', ') || t('reminders.everyDay')}
                          </span>
                        </div>
                        {reminder.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => toggleActive(reminder)}
                          aria-label={reminder.active ? t('reminders.disable') : t('reminders.enable')}
                          title={reminder.active ? t('reminders.disable') : t('reminders.enable')}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                            reminder.active
                              ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          {reminder.active ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(reminder)}
                          aria-label={t('profile.edit')}
                          title={t('profile.edit')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeReminder(reminder)}
                          aria-label={t('profile.delete')}
                          title={t('profile.delete')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Tahrirlash modali */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        title={t('reminders.edit')}
        subtitle={modalForm.title}
      >
        <div className="space-y-4">
          <Input
            label={t('reminders.titleLabel')}
            value={modalForm.title}
            onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label={t('reminders.pet')}
              options={petOptions}
              value={modalForm.petId}
              onChange={(e) => setModalForm({ ...modalForm, petId: e.target.value })}
            />
            <Input
              type="time"
              label={t('reminders.time')}
              value={modalForm.time}
              onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('reminders.daysLabel')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DAY_KEYS.map((k) => {
                const active = modalForm.days.includes(k)
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() =>
                      setModalForm({ ...modalForm, days: toggleDay(modalForm.days, k) })
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft'
                        : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t(`reminders.days.${k}`)}
                  </button>
                )
              })}
            </div>
          </div>
          <Textarea
            label={t('reminders.notes')}
            rows={2}
            value={modalForm.notes}
            onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
          />
          <Button onClick={submitEdit} className="w-full">
            <Pencil className="h-4 w-4" /> {t('profile.saveChanges')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
