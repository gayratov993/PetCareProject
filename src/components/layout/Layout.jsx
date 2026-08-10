import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import BackToTop from '../ui/BackToTop.jsx'
import ReminderNotifier from '../ui/ReminderNotifier.jsx'

/**
 * Umumiy sahifa layouti.
 * Header va Footer bilan o'ralgan, sahifalar Outlet orqali chiqadi.
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <ReminderNotifier />
    </div>
  )
}
