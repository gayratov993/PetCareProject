  -- ============================================
-- PetCare — Supabase jadvallarini yaratish skripti
-- Bu skriptni Supabase -> SQL Editor bo'limiga qo'ying va "Run" tugmasini bosing
-- SKRIPT XAVFSIZ: qayta-qayta run qilish mumkin (xatolik bermaydi)
-- ============================================

-- 1) profiles jadvali — foydalanuvchi profillari
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  created_at timestamptz default now()
);

-- 2) pets jadvali — foydalanuvchilarning hayvonlari
create table if not exists public.pets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  species text,
  breed text,
  age text,
  created_at timestamptz default now()
);

-- 3) symptoms jadvali — muammo ma'lumotlari (kelajakda foydalanish uchun)
create table if not exists public.symptoms (
  id uuid default gen_random_uuid() primary key,
  species text not null,
  symptom_name_uz text,
  symptom_name_ru text,
  symptom_name_en text,
  possible_causes jsonb,
  recommendation text,
  created_at timestamptz default now()
);

-- 4) consultations jadvali — veterinar konsultatsiya so'rovlari
create table if not exists public.consultations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  pet_name text not null,
  species text,
  description text,
  contact text,
  status text default 'yangi',
  created_at timestamptz default now()
);

-- ============================================
-- RLS (Row Level Security) sozlamalari
-- ============================================

-- Foydalanuvchilar faqat o'z profilini ko'ra oladi
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Foydalanuvchilar faqat o'z hayvonlarini ko'ra va boshqara oladi
alter table public.pets enable row level security;
drop policy if exists "Users can view own pets" on public.pets;
create policy "Users can view own pets"
  on public.pets for select
  using (auth.uid() = user_id);
drop policy if exists "Users can insert own pets" on public.pets;
create policy "Users can insert own pets"
  on public.pets for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can update own pets" on public.pets;
create policy "Users can update own pets"
  on public.pets for update
  using (auth.uid() = user_id);
drop policy if exists "Users can delete own pets" on public.pets;
create policy "Users can delete own pets"
  on public.pets for delete
  using (auth.uid() = user_id);

-- Konsultatsiyalarni har kim yuborishi mumkin (ro'yxatdan o'tmagan ham),
-- lekin faqat o'z so'rovlarini ko'ra oladi
alter table public.consultations enable row level security;
drop policy if exists "Anyone can insert consultations" on public.consultations;
create policy "Anyone can insert consultations"
  on public.consultations for insert
  with check (true);
drop policy if exists "Users can view own consultations" on public.consultations;
create policy "Users can view own consultations"
  on public.consultations for select
  using (auth.uid() = user_id or user_id is null);

-- ============================================
-- ADMIN PANEL uchun qo'shimchalar
-- ============================================

-- 1) profiles jadvaliga role ustuni qo'shish (default: user)
alter table public.profiles
  add column if not exists role text not null default 'user';

-- 2) Foydalanuvchi admin ekanligini tekshiruvchi funksiya
--    (security definer — RLS'ni chetlab o'tadi, rekursiya yaratmaydi)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3) Adminlar uchun RLS siyosatlari
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Admins can view all pets" on public.pets;
create policy "Admins can view all pets"
  on public.pets for select
  using (public.is_admin());

drop policy if exists "Admins can view all consultations" on public.consultations;
create policy "Admins can view all consultations"
  on public.consultations for select
  using (public.is_admin());

drop policy if exists "Admins can update all consultations" on public.consultations;
create policy "Admins can update all consultations"
  on public.consultations for update
  using (public.is_admin());

drop policy if exists "Admins can delete all consultations" on public.consultations;
create policy "Admins can delete all consultations"
  on public.consultations for delete
  using (public.is_admin());

-- 4) ADMIN tayinlash (o'z emailingizni yozing va run qiling):
--    update public.profiles set role = 'admin' where email = 'sizning@emailingiz.com';

-- ============================================
-- 5) KONTAKT XABARLARI jadvali
--    (kontakt formasidan kelgan xabarlar shu yerda saqlanadi)
-- ============================================
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  message text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
drop policy if exists "Anyone can insert messages" on public.messages;
create policy "Anyone can insert messages"
  on public.messages for insert
  with check (true);

drop policy if exists "Admins can view messages" on public.messages;
create policy "Admins can view messages"
  on public.messages for select
  using (public.is_admin());

drop policy if exists "Admins can delete messages" on public.messages;
create policy "Admins can delete messages"
  on public.messages for delete
  using (public.is_admin());

-- ============================================
-- 6) ESLATMALAR jadvali
--    (ovqatlantirish, dori berish va h.k. eslatmalari)
-- ============================================
create table if not exists public.reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete set null,
  title text not null,
  time text not null,
  days jsonb default '[]'::jsonb,
  notes text,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.reminders enable row level security;
drop policy if exists "Users can view own reminders" on public.reminders;
create policy "Users can view own reminders"
  on public.reminders for select
  using (auth.uid() = user_id);
drop policy if exists "Users can insert own reminders" on public.reminders;
create policy "Users can insert own reminders"
  on public.reminders for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can update own reminders" on public.reminders;
create policy "Users can update own reminders"
  on public.reminders for update
  using (auth.uid() = user_id);
drop policy if exists "Users can delete own reminders" on public.reminders;
create policy "Users can delete own reminders"
  on public.reminders for delete
  using (auth.uid() = user_id);
