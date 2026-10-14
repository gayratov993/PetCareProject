<div align="center">

<img src="public/favicon.svg" alt="PetCare logo" width="96" height="96" />

# PetCare

**A pet health & care assistant — check symptoms, plan nutrition, set reminders and reach a vet.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database](#database)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Internationalization](#internationalization)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**PetCare** is a full-stack, responsive web application for pet owners. It helps you understand a pet's symptoms, plan the right diet by species and age, keep track of feeding / medication reminders, and send a consultation request to a vet.

The app is a modern React SPA talking directly to a **Supabase** (PostgreSQL) backend that provides authentication, the database and **Row Level Security**. It is fully responsive, supports **dark mode** and ships in **three languages** (Uzbek, Russian, English).

The project was built as a portfolio piece demonstrating:

- Clean, feature-based frontend architecture
- Server-state management with **Redux Toolkit** (`createAsyncThunk` + slices)
- Secure, role-based access control enforced **in the database** with **RLS policies**
- Route protection with dedicated `ProtectedRoute` / `AdminRoute` guards
- A database-backed content layer (symptom checker & nutrition) with a static fallback
- A production-style Supabase schema with an idempotent setup script and seed data

---

## Live Demo

> ```
> https://pet-care-project-omega.vercel.app
> ```

**Demo accounts** (seed your own in Supabase, then promote one to admin):

| Role  | Email                | Password    |
| ----- | -------------------- | ----------- |
| User  | `user@example.com`   | `Test1234!` |
| Admin | `admin@example.com`  | `Test1234!` |

---

## Screenshots

> Add screenshots to `docs/screenshots/` and they will render below.

| Home                                   | Symptom Checker                          | Nutrition                           |
| -------------------------------------- | ---------------------------------------- | ----------------------------------- |
| `docs/screenshots/home.png`            | `docs/screenshots/symptom-checker.png`   | `docs/screenshots/nutrition.png`    |
| **Reminders**                          | **Profile**                              | **Admin**                           |
| `docs/screenshots/reminders.png`       | `docs/screenshots/profile.png`           | `docs/screenshots/admin.png`        |

---

## Key Features

### Symptom Checker

- Pick a pet **species** (dog, cat, rabbit, bird, hamster, fish, turtle)
- Search a symptom and get **possible causes** and **recommendations**
- Copy the full result to the clipboard in one click
- Warning banner and a direct link to request a vet consultation
- Content is loaded from **Supabase** (`symptoms` table) and falls back to bundled data when the database is not configured

### Nutrition Guide

- Choose a **species** and **age group** (young / adult / senior)
- Recommended vs. forbidden foods per species
- Age-specific diet guidance loaded from Supabase (`nutrition` table) with a static fallback

### Vet Consultation

- Public consultation request form (name, pet, species, description, contact)
- Works even without an account; signed-in users see all their requests in their profile
- Status tracking: `yangi` → `jarayonda` → `bajarildi` / `rad_etildi`

### Reminders

- Create / edit / delete feeding & medication reminders
- Assign a reminder to a pet and choose weekdays
- Toggle active / inactive
- **Browser notifications** fire at the scheduled time (Notification API)

### Accounts & Profile

- Email/password authentication with **Supabase Auth**
- Forgot-password / reset flow (email link)
- Profile with **pets CRUD** (name, species, breed, age) and consultation history
- Edit display name and change password

### Admin Panel

- Only for users with the `admin` role
- Dashboard statistics (users, pets, total & pending consultations)
- Manage all consultation requests (change status, delete)
- Browse all registered users

### UX / Interface

- Responsive layout with a desktop header and a mobile menu
- **Dark mode** with system preference detection and persistence
- Animations via **Framer Motion**
- Toast notifications and an app-level **ErrorBoundary**
- Skeleton loaders and empty states

---

## How It Works

**Visitor**

1. Land on the home page and open the **Symptom Checker** or **Nutrition** guide.
2. Pick a species (and symptom / age) — content is fetched from Supabase.
3. Send a consultation request without signing up.

**Signed-in user**

1. Register or log in; a `profiles` row is created.
2. Add pets and keep their details up to date.
3. Track consultation requests and set feeding / medication **reminders**.
4. Get a browser notification when a reminder is due.

**Admin**

1. A user is promoted to admin by setting `role = 'admin'` in `profiles`.
2. The **Admin** link appears in the header.
3. Review statistics, update consultation statuses and manage users.

**Behind the scenes**

- Redux Toolkit slices hold auth, pets, reminders, consultations and the symptom state.
- Symptom and nutrition content is loaded per species through small API modules and cached in component/slice state, falling back to bundled JSON when Supabase is not configured.
- Access control is enforced by RLS policies — the client only ever holds the anon key.

---

## Tech Stack

**Frontend**

- **React 19** + **Vite 8**
- **Redux Toolkit** — state & async thunks
- **React Router 7** — routing, `ProtectedRoute` / `AdminRoute`
- **React Hook Form** + **Zod** — forms & validation
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **i18next / react-i18next** — internationalization
- **react-hot-toast** — notifications
- **Lucide React** — icons
- **Oxlint** — linting

**Backend (Supabase)**

- **PostgreSQL** database with **Row Level Security**
- **Supabase Auth** (email/password)
- **PL/pgSQL** helper function (`is_admin()`) for admin policies

---

## Architecture

The app is a client-side SPA that talks **directly** to Supabase (no custom backend). Security is enforced at the database layer through **RLS policies**, so the same anon key is safe to ship to the browser.

```
┌────────────────────────────┐        ┌──────────────────────────────────┐
│         Browser            │        │            Supabase              │
│                            │        │                                  │
│  React + Vite (SPA)        │  HTTPS │  PostgREST (auto REST API)       │
│   ├─ Redux Toolkit store   │ ─────► │   ├─ PostgreSQL + RLS policies   │
│   ├─ Feature API modules   │        │   ├─ GoTrue  (Auth)              │
│   ├─ React Router (guards) │        │   └─ is_admin() helper function  │
│   └─ i18next (uz/ru/en)    │        │                                  │
└────────────────────────────┘        └──────────────────────────────────┘
```

**Data flow**

1. UI components dispatch async thunks (e.g. `fetchSession`, `loadSymptoms`).
2. API modules call Supabase via `@supabase/supabase-js`.
3. Supabase RLS validates the JWT and returns only permitted rows.
4. Slices store the result; components render declaratively.
5. Symptom / nutrition content falls back to bundled data if the query fails or the DB is not configured.

---

## Project Structure

```
PetCareProject/
├─ public/
│  ├─ favicon.svg            # App favicon
│  ├─ images/pets/           # Pet photos (jpg)
│  └─ locales/               # uz / ru / en translation.json
├─ src/
│  ├─ app/
│  │  └─ store.js            # Redux store (theme, auth, symptom)
│  ├─ components/
│  │  ├─ common/             # Button, Input, Select, Modal, Loader, ErrorBoundary…
│  │  ├─ home/               # HeroCarousel
│  │  ├─ layout/             # Layout, Header, Footer, ScrollToTop
│  │  ├─ routing/            # ProtectedRoute, AdminRoute
│  │  └─ ui/                 # ThemeToggle, LanguageSwitcher, BackToTop, ReminderNotifier
│  ├─ features/
│  │  ├─ auth/               # authSlice (thunks) + LoginForm, RegisterForm
│  │  ├─ petSymptomChecker/  # symptomSlice, symptomsApi, data/, components/
│  │  ├─ nutrition/          # nutritionApi, data/, components/
│  │  ├─ vetConsultation/    # ConsultationForm
│  │  └─ theme/              # themeSlice
│  ├─ hooks/                 # useAuth
│  ├─ i18n/                  # i18next configuration
│  ├─ lib/                   # supabaseClient, petImages
│  ├─ pages/                 # Route pages
│  ├─ router/                # AppRouter
│  └─ styles/                # Global CSS / Tailwind layers
├─ supabase.sql              # Schema + RLS + seed (idempotent)
├─ .env.example
├─ index.html
├─ tailwind.config.js
├─ vite.config.js
└─ package.json
```

**Design principles**

- **Feature-based** folders: each feature owns its slice, API module and components.
- **UI primitives** (`components/common`) separated from **domain components**.
- **Single data layer** — Supabase access is centralised in small API modules and slices.
- **Graceful degradation** — public tools keep working with bundled data when the DB is empty or absent.

---

## Database

The dataset lives in **PostgreSQL** on Supabase. Key tables:

| Table           | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `profiles`      | User profile linked to `auth.users` (name, email, role)        |
| `pets`          | The user's pets (name, species, breed, age)                    |
| `symptoms`      | Symptom content per species (multilingual causes & advice)     |
| `nutrition`     | Age-group ration text per species (multilingual)               |
| `consultations` | Vet consultation requests + status                             |
| `messages`      | Contact-form messages                                          |
| `reminders`     | Feeding / medication reminders (pet, time, weekdays, active)   |

**Security & automation**

- **RLS** is enabled on every table — e.g. pets and reminders are owner-only, profiles are owner-read with an admin override, and public content (`symptoms`, `nutrition`) is world-readable but admin-writable.
- A `SECURITY DEFINER` helper function `is_admin()` powers the admin policies without recursive RLS checks.
- Seed data for `symptoms` and `nutrition` is included so the tools work out of the box.

See [`supabase.sql`](supabase.sql) for the full definition.

---

## Getting Started

### Prerequisites

- Node.js **18+**
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Clone & install

```bash
git clone https://github.com/gayratov993/PetCareProject.git
cd PetCareProject
npm install
```

### 2. Create the database

In your Supabase project → **SQL Editor**, run the contents of:

1. `supabase.sql` — tables, RLS, the `is_admin()` helper and seed data. It is safe to run multiple times.

To promote your own account to admin, run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

### 4. Run

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Environment Variables

| Variable                 | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL                                |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon/public** key (safe for browser with RLS) |

> Never put the **service-role key** in a frontend app. Only the anon key is required.

---

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run Oxlint                           |

---

## Internationalization

The interface is translated via **i18next** with JSON resources in `public/locales/`:

- 🇺🇿 Uzbek (`uz`) — default
- 🇷🇺 Russian (`ru`)
- 🇬🇧 English (`en`)

Language is switchable at runtime and persisted in `localStorage`. To add a language, create `public/locales/<code>/translation.json` and register it in `src/i18n/i18n.js`.

---

## Security

- Access control is enforced **in the database** with PostgreSQL **Row Level Security** on every table — the client can never bypass it.
- Only the **anon (public) key** is shipped to the browser. The **service-role key is never used** in the frontend.
- Pets and reminders are owner-only; public content (`symptoms`, `nutrition`) is read-only for users and writable only by admins.
- Admin checks run inside a `SECURITY DEFINER` function to avoid recursive RLS evaluation.
- Protected routes are guarded on the client (`ProtectedRoute` / `AdminRoute`) **and** backed by RLS on the server.

---

## Deployment

The app is a static SPA and deploys to any static host (Vercel, Netlify, Cloudflare Pages).

**Vercel**

1. Import the repository on [vercel.com](https://vercel.com).
2. Framework preset: **Vite** (build command `npm run build`, output directory `dist`).
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Add your Vercel domain under Supabase → **Authentication → URL Configuration → Redirect URLs**.
5. Deploy.

Because it uses client-side routing, add an SPA rewrite so every route falls back to `index.html`.

---

## Roadmap

- [ ] User-uploaded pet photos (Supabase Storage)
- [ ] Push notifications (web push) for reminders
- [ ] Symptom checker powered by an AI model
- [ ] Full Russian & English symptom / nutrition content
- [ ] Automated tests (Vitest + Testing Library, Playwright E2E)

---

## License

Released under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with ❤️ using React, Redux Toolkit and Supabase.

</div>
