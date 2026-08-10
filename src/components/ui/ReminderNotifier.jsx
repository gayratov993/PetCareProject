import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReminders } from '../../features/auth/authSlice.js'
import { isSupabaseConfigured } from '../../lib/supabaseClient.js'

/**
 * Eslatma bildirishnomalari.
 * Brauzer Notification API orqali eslatma vaqtiga yetganda xabar beradi.
 */
export default function ReminderNotifier() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const reminders = useSelector((state) => state.auth.reminders)
  const fetched = useRef(false)

  // Eslatmalarni yuklash va ruxsat so'rash
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    if (!fetched.current) {
      fetched.current = true
      dispatch(fetchReminders(user.id))
    }
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [user, dispatch])

  // Vaqtga mos eslatmalarni tekshirish (har 30 soniyada)
  useEffect(() => {
    if (!user) return

    const check = () => {
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const current = `${hh}:${mm}`
      const todayKey = now.toISOString().slice(0, 10)
      const dayIdx = String(now.getDay()) // 0=Sunday..6=Saturday
      const dayMap = ['ya', 'du', 'se', 'ch', 'pa', 'ju', 'sh']
      const todayDay = dayMap[dayIdx]

      reminders.forEach((r) => {
        if (!r.active || r.time !== current) return
        const days = r.days || []
        if (days.length > 0 && !days.includes(todayDay)) return
        const fireKey = `reminder-fired-${r.id}-${todayKey}`
        if (localStorage.getItem(fireKey)) return
        localStorage.setItem(fireKey, '1')
        new Notification(r.title, {
          body: r.notes || current,
          icon: '/images/pets/dog.jpg',
          tag: `reminder-${r.id}`,
        })
      })
    }

    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [user, reminders])

  return null
}
