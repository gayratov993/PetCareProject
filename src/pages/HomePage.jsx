import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  UtensilsCrossed,
  HeartPulse,
  ShieldCheck,
  Languages,
  Clock,
  Quote,
  Sparkles,
  PawPrint,
} from 'lucide-react'
import Card from '../components/common/Card.jsx'
import HeroCarousel from '../components/home/HeroCarousel.jsx'

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
}

const featureGradients = [
  'from-primary-500 to-teal-500',
  'from-accent-400 to-orange-500',
  'from-teal-500 to-cyan-500',
  'from-emerald-500 to-primary-600',
]

/**
 * Bosh sahifa.
 * Hero bo'lim, imkoniyatlar, "Nega PetCare?" va foydalanuvchi fikrlari.
 */
export default function HomePage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Stethoscope,
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
      to: '/symptom-checker',
    },
    {
      icon: UtensilsCrossed,
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
      to: '/nutrition',
    },
    {
      icon: HeartPulse,
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
      to: '/about',
    },
    {
      icon: Sparkles,
      title: t('home.feature4Title'),
      desc: t('home.feature4Desc'),
      to: '/vet-consultation',
    },
  ]

  const whyUs = [
    { icon: ShieldCheck, title: t('home.why1Title'), desc: t('home.why1Desc') },
    { icon: Languages, title: t('home.why2Title'), desc: t('home.why2Desc') },
    { icon: Clock, title: t('home.why3Title'), desc: t('home.why3Desc') },
  ]

  const testimonials = [
    { text: t('home.testimonial1Text'), name: t('home.testimonial1Name'), role: t('home.testimonial1Role') },
    { text: t('home.testimonial2Text'), name: t('home.testimonial2Name'), role: t('home.testimonial2Role') },
    { text: t('home.testimonial3Text'), name: t('home.testimonial3Name'), role: t('home.testimonial3Role') },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-mesh py-16 lg:py-24">
        <div className="bg-paw-pattern absolute inset-0" />
        <div className="container-app relative grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <motion.span
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur dark:border-primary-800/60 dark:bg-gray-900/60 dark:text-primary-300"
            >
              <PawPrint className="h-4 w-4" /> {t('home.heroBadge')}
            </motion.span>

            <motion.h1
              variants={fadeIn}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-4xl font-extrabold leading-[1.15] text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
            >
              {t('home.heroTitle').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{t('home.heroTitle').split(' ').slice(-1)}</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              custom={2}
              initial="hidden"
              animate="visible"
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 lg:mx-0 dark:text-gray-300"
            >
              {t('home.heroSubtitle')}
            </motion.p>

            <motion.div
              variants={fadeIn}
              custom={3}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link to="/symptom-checker" className="btn-primary w-full sm:w-auto">
                {t('home.heroCtaPrimary')}
              </Link>
              <Link to="/vet-consultation" className="btn-secondary w-full sm:w-auto">
                {t('home.heroCtaSecondary')}
              </Link>
            </motion.div>
          </div>

          {/* Real hayvonlar karuseli */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <HeroCarousel />
          </motion.div>
        </div>
      </section>

      {/* IMOONIYATLAR */}
      <section className="container-app py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            PetCare
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {t('home.featuresTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
            {t('home.featuresSubtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
              <Link to={feature.to} className="block h-full">
                <Card className="group flex h-full flex-col">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${featureGradients[i]}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEGA PETCARE? */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24 dark:from-gray-900 dark:to-gray-950">
        <div className="bg-paw-pattern absolute inset-0 opacity-60" />
        <div className="container-app relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white"
          >
            {t('home.whyTitle')}
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card-lift p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FIKRLAR */}
      <section className="container-app py-16 lg:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white"
        >
          {t('home.testimonialsTitle')}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="h-full"
            >
              <Card className="h-full">
                <Quote className="mb-4 h-8 w-8 text-primary-300 dark:text-primary-700" />
                <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {item.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-600 text-sm font-bold text-white">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
