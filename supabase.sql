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

-- 3) symptoms jadvali — muammo (symptom) ma'lumotlari (ko'p tilli).
--    Symptom Checker shu jadvaldan o'qiydi (bo'sh bo'lsa ilova statik zaxiraga qaytadi).
drop table if exists public.symptoms cascade;
create table public.symptoms (
  id uuid default gen_random_uuid() primary key,
  species text not null,
  symptom_name_uz text,
  symptom_name_ru text,
  symptom_name_en text,
  causes_uz jsonb default '[]'::jsonb,
  causes_ru jsonb default '[]'::jsonb,
  causes_en jsonb default '[]'::jsonb,
  recommendations_uz jsonb default '[]'::jsonb,
  recommendations_ru jsonb default '[]'::jsonb,
  recommendations_en jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3b) nutrition jadvali — yosh guruhi bo'yicha ratsion matni (ko'p tilli)
drop table if exists public.nutrition cascade;
create table public.nutrition (
  id uuid default gen_random_uuid() primary key,
  species text unique not null,
  ages_uz jsonb default '{}'::jsonb,
  ages_ru jsonb default '{}'::jsonb,
  ages_en jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- O'qish hamma uchun ochiq (symptom checker va nutrition ro'yxatdan o'tmaganlarga ham kerak)
alter table public.symptoms enable row level security;
drop policy if exists "Anyone can view symptoms" on public.symptoms;
create policy "Anyone can view symptoms"
  on public.symptoms for select using (true);

alter table public.nutrition enable row level security;
drop policy if exists "Anyone can view nutrition" on public.nutrition;
create policy "Anyone can view nutrition"
  on public.nutrition for select using (true);

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

-- Adminlar symptom va nutrition ma'lumotlarini boshqara oladi
drop policy if exists "Admins can manage symptoms" on public.symptoms;
create policy "Admins can manage symptoms"
  on public.symptoms for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage nutrition" on public.nutrition;
create policy "Admins can manage nutrition"
  on public.nutrition for all
  using (public.is_admin())
  with check (public.is_admin());

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


-- ============================================
-- 7) SYMPTOM CHECKER seed ma'lumotlari (o'zbekcha)
--    Jadval bo'sh bo'lsa ilova statik zaxiraga qaytadi, shuning uchun bu seed muhim.
-- ============================================
delete from public.symptoms;
insert into public.symptoms
  (species, symptom_name_uz, causes_uz, recommendations_uz, sort_order)
values
  ($seed$dog$seed$, $seed$ishtahasi yo'q$seed$, $seed$["Ovqat o'zgarishi yoki yangi ozuqa","Stomatologik muammolar (tish og'rig'i)","Stress yoki muhit o'zgarishi","Oshqozon-ichak muammolari"]$seed$::jsonb, $seed$["Ovqatni iliq va oz miqdorda taklif qiling","O'zgarish bo'lsa, yangi ozuqaga asta-sekin o'ting","Og'iz bo'shlig'ini tekshiring, yallig'lanish bo'lsa shifokorga murojaat qiling","1-2 kundan ortiq davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 0),
  ($seed$dog$seed$, $seed$qusyapti$seed$, $seed$["Tez ovqatlanish yoki ortiqcha ovqatlanish","Zaharlanish (zaharli moddalar yoki o'simliklar)","Oshqozon begona jism","Yuqumli kasallik"]$seed$::jsonb, $seed$["Qisqa muddat och qoldiring (12 soat) va ko'p suv bering","Zaharli narsa yeganidan shubhalansangiz darhol shifokorga murojaat qiling","Qusish 24 soatdan ortiq davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 1),
  ($seed$dog$seed$, $seed$terisida qichishish bor$seed$, $seed$["Burgalar yoki parazitlar","Allergiya (ovqat yoki atrof-muhit)","Terining quruqligi","Teri kasalligi (dermatit)"]$seed$::jsonb, $seed$["Burgalarga qarshi vositalardan foydalaning","Haftada bir marta maxsus shampun bilan yuving","Oziqaga allergiya bo'lsa, ratsionni o'zgartiring","Qizarish va yara paydo bo'lsa, veterinarga murojaat qiling"]$seed$::jsonb, 2),
  ($seed$dog$seed$, $seed$letargik (harakatsiz)$seed$, $seed$["Jismoniy faollikning kamayishi","Oziqlanish yetishmovchiligi","Og'riq yoki noqulaylik","Kasallikning boshlang'ich belgisi"]$seed$::jsonb, $seed$["Haroratni o'lchang (it uchun normal: 37.5-39.2°C)","Suv va ovqat mavjudligini tekshiring","Kuniga 30 daqiqa sayr qilishni ta'minlang","Holat yomonlashsa, veterinarga murojaat qiling"]$seed$::jsonb, 3),
  ($seed$dog$seed$, $seed$diareya (ich ketishi)$seed$, $seed$["Ovqat o'zgarishi","Yomon ovqat yoki iflos suv","Parazitlar","Oshqozon-ichak infektsiyasi"]$seed$::jsonb, $seed$["Ovqatni to'xtatib, faqat suv bering (12-24 soat)","Keyin oson hazm bo'ladigan ovqat (guruch, qaynatilgan tovuq) bering","Qonli ich ketish yoki 24 soatdan ortiq davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 4),
  ($seed$cat$seed$, $seed$ishtahasi yo'q$seed$, $seed$["Ovqatning yoqmasligi","Stomatologik muammolar","Stress yoki o'zgarishlar","Oshqozon-ichak muammolari"]$seed$::jsonb, $seed$["Issiq, yangi ovqat taklif qiling","Toza suv har doim bo'lishini ta'minlang","Agar mushuk 2 kundan ortiq ovqat yemasa — jiddiy muammo, darhol veterinarga murojaat qiling"]$seed$::jsonb, 0),
  ($seed$cat$seed$, $seed$qusyapti$seed$, $seed$["Jun to'pi (hairball)","Tez ovqatlanish","O't oshqozon bezovtaligi","Zaharlanish"]$seed$::jsonb, $seed$["Jun to'plari uchun maxsus pasta bering","Yashil o'simlik (mushuk o'ti) taklif qiling","Qusish tez-tez va kuchli bo'lsa, veterinarga murojaat qiling"]$seed$::jsonb, 1),
  ($seed$cat$seed$, $seed$terisida qichishish bor$seed$, $seed$["Burgalar (mushuklarda juda keng tarqalgan)","Ovqat allergiyasi","Quruq teri","Qo'ziqorin kasalliklari"]$seed$::jsonb, $seed$["Burgalarga qarshi tomchi yoki yoqa qo'llang","Ovqatni bitta turdagi (monoprotein) bilan sinab ko'ring","Terida yallig'lanish bo'lsa, veterinarga murojaat qiling"]$seed$::jsonb, 2),
  ($seed$cat$seed$, $seed$ich ketishi$seed$, $seed$["Ovqat o'zgarishi","Parazitlar","Laktoza (sut) intoleransi","Stress"]$seed$::jsonb, $seed$["Sut va sut mahsulotlarini bermang","Ovqatni asta-sekin o'zgartiring","Ich ketishi 48 soatdan ortiq davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 3),
  ($seed$rabbit$seed$, $seed$ovqat yemaydi$seed$, $seed$["Stomatologik muammolar (tish o'sishi)","Oshqozon-ichak stazisi (GI stasis)","Stress yoki issiq ob-havo"]$seed$::jsonb, $seed$["Pichan har doim mavjud bo'lishini tekshiring","Issiqdan saqlang, salqin joyda tuting","12 soatdan ortiq ovqat yemasa, darhol veterinarga murojaat qiling"]$seed$::jsonb, 0),
  ($seed$rabbit$seed$, $seed$letargik$seed$, $seed$["Issiqlik urishi","Oziqlanish yetishmovchiligi","Infeksiya"]$seed$::jsonb, $seed$["Salqin joyga olib boring, suv bering","Haroratini kuzating","Holati o'zgarmasa, veterinarga murojaat qiling"]$seed$::jsonb, 1),
  ($seed$bird$seed$, $seed$patlari to'kilyapti$seed$, $seed$["Erish davri (molting)","Stress","Vitamin yetishmovchiligi","Teri parazitlari"]$seed$::jsonb, $seed$["Toza va vitaminli ovqat bering","Qafas muhitini tinchlantiring","Haddan tashqari to'kilish davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 0),
  ($seed$bird$seed$, $seed$ishtahasi yo'q$seed$, $seed$["Ovqat turining o'zgarishi","Kasallik","Stress"]$seed$::jsonb, $seed$["Doimiy ovqat jadvaliga qayting","Toza suv va qafas tozaligini ta'minlang","48 soat ichida ovqat yemaslik xavfli — veterinarga murojaat qiling"]$seed$::jsonb, 1),
  ($seed$hamster$seed$, $seed$qishdan keyin harakatsiz$seed$, $seed$["Qish uyqusi (torpor) holati","Sovuq muhit","Stress"]$seed$::jsonb, $seed$["Qafasni issiq va quruq joyga o'tkazing","Ozgina va tez-tez ovqat bering","Holati qaytmasa, veterinarga murojaat qiling"]$seed$::jsonb, 0),
  ($seed$fish$seed$, $seed$yuqoriga suzib qolgan$seed$, $seed$["Suv parametrlari buzilgan (ammiak)","Suv harorati o'zgarishi","Ovgatlanishdagi xato"]$seed$::jsonb, $seed$["Suvni test qiling va o'zgartiring (30%)","Haroratni bir xil ushlang","Ovqat miqdorini kamaytiring"]$seed$::jsonb, 0),
  ($seed$turtle$seed$, $seed$letargik$seed$, $seed$["Harorat yetishmasligi","Noto'g'ri ovqatlanish","Vitamin D yetishmovchiligi"]$seed$::jsonb, $seed$["UVB chiroq bilan yoritishni ta'minlang","Suv va muhit haroratini tekshiring","Davom etsa, veterinarga murojaat qiling"]$seed$::jsonb, 0);

-- ============================================
-- 8) NUTRITION seed ma'lumotlari (o'zbekcha)
-- ============================================
delete from public.nutrition;
insert into public.nutrition (species, ages_uz) values
  ($seed$dog$seed$, $seed${"puppy":"Kuchukchalar kuniga 3-4 marta, kichik porsiyalarda ovqatlantiriladi. Ratsion oqsillarga boy bo'lishi kerak.","adult":"Kattalar itlari kuniga 1-2 marta ovqatlanadi. Muvozanatli quruq ozuqa + go'sht + sabzavotlar.","senior":"Keksa itlar oson hazm bo'ladigan, kam kaloriyali, bo'g'imlarni qo'llab-quvvatlovchi ratsionga muhtoj."}$seed$::jsonb),
  ($seed$cat$seed$, $seed${"puppy":"Mushuk bolalari (kittens) kuniga 4 marta, maxsus kitten ozuqasi bilan ovqatlantiriladi.","adult":"Kattalar mushuklari kuniga 2 marta ovqatlanadi. Oqsil boy, uglevodlar kam bo'lgan ozuqa.","senior":"Keksa mushuklarga buyraklarni qo'llab-quvvatlovchi maxsus ozuqa tavsiya etiladi."}$seed$::jsonb),
  ($seed$rabbit$seed$, $seed${"puppy":"Yosh quyonlarga alfalfa pichani va maxsus yosh quyon granulalari beriladi.","adult":"Kattalar quyonlari asosan pichan, sabzavot va cheklangan granulalar bilan oziqlanadi.","senior":"Keksa quyonlar yumshoq sabzavotlar va yuqori sifatli pichan bilan oziqlanadi."}$seed$::jsonb),
  ($seed$bird$seed$, $seed${"puppy":"Yosh qushlarga mayda donlar va yumshoq mevalar oz miqdorda beriladi.","adult":"Kattalar qushlari don aralashmasi, sabzavot va mevalar bilan oziqlanadi.","senior":"Keksa qushlarga oson hazm bo'ladigan, mayda to'g'ralgan ovqatlar beriladi."}$seed$::jsonb),
  ($seed$hamster$seed$, $seed${"puppy":"Yosh hamsterlarga mayda granulalar va yumshoq sabzavotlar beriladi.","adult":"Kattalar hamsterlari granulalar, sabzavot va kam miqdorda meva yeydi.","senior":"Keksa hamsterlar oson chaynaladigan, yumshoq ovqatlarga muhtoj."}$seed$::jsonb);
