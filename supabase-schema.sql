-- ═══════════════════════════════════════════════════════
-- Masar Platform — Supabase Schema
-- Run this once in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Profiles (user metadata linked to Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null default 'student'
    check (role in ('student','instructor','marketer','center','admin')),
  specialization text,
  center_name text,
  created_at timestamptz default now()
);

-- 2. Instructor Courses
create table if not exists instructor_courses (
  id uuid default gen_random_uuid() primary key,
  instructor_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  image text default '📚',
  category text not null default 'Programming',
  level text not null default 'Beginner'
    check (level in ('Beginner','Intermediate','Advanced')),
  mode text not null default 'online'
    check (mode in ('online','offline','hybrid')),
  price numeric not null default 0,
  status text not null default 'draft'
    check (status in ('active','draft','published')),
  students integer default 0,
  rating numeric(3,1) default 0,
  revenue numeric default 0,
  start_date text,
  duration text,
  description text,
  tags text,
  enrollment_fields jsonb default '[]',
  meet_link text,
  group_link text,
  location text,
  schedule_days jsonb default '[]',
  weeks jsonb default '[]',
  created_at timestamptz default now()
);

-- 3. Enrollment Requests
create table if not exists enrollment_requests (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references instructor_courses(id) on delete cascade not null,
  instructor_id uuid references profiles(id) not null,
  marketer_id uuid references profiles(id),
  name text not null,
  avatar text,
  course text not null,
  phone text,
  email text,
  payment text,
  amount numeric,
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected','reserved')),
  fields jsonb default '{}',
  created_at timestamptz default now()
);

-- 4. Q&A Items
create table if not exists qa_items (
  id uuid default gen_random_uuid() primary key,
  instructor_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references instructor_courses(id) on delete set null,
  sender text not null,
  anon boolean default false,
  course text not null,
  question text not null,
  answer text,
  created_at timestamptz default now()
);

-- 5. Marketer Assignments
create table if not exists marketer_assignments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references instructor_courses(id) on delete cascade not null,
  instructor_id uuid references profiles(id) not null,
  marketer_id uuid references profiles(id) not null,
  marketer_name text not null,
  marketer_email text not null,
  course_name text not null,
  commission_rate numeric not null default 10,
  created_at timestamptz default now()
);

-- 6. Course Views (analytics)
create table if not exists course_views (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references instructor_courses(id) on delete cascade not null,
  viewed_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════
alter table profiles enable row level security;
alter table instructor_courses enable row level security;
alter table enrollment_requests enable row level security;
alter table qa_items enable row level security;
alter table marketer_assignments enable row level security;
alter table course_views enable row level security;

-- Authenticated users can access all data (expand later with granular policies)
drop policy if exists "authenticated_all" on profiles;
create policy "authenticated_all" on profiles
  for all using (auth.role() = 'authenticated');

drop policy if exists "authenticated_all" on instructor_courses;
create policy "authenticated_all" on instructor_courses
  for all using (auth.role() = 'authenticated');

drop policy if exists "authenticated_all" on enrollment_requests;
create policy "authenticated_all" on enrollment_requests
  for all using (auth.role() = 'authenticated');

drop policy if exists "authenticated_all" on qa_items;
create policy "authenticated_all" on qa_items
  for all using (auth.role() = 'authenticated');

drop policy if exists "authenticated_all" on marketer_assignments;
create policy "authenticated_all" on marketer_assignments
  for all using (auth.role() = 'authenticated');

drop policy if exists "authenticated_all" on course_views;
create policy "authenticated_all" on course_views
  for all using (auth.role() = 'authenticated');

-- Anonymous users can log course views (from public course pages)
drop policy if exists "anon_insert_views" on course_views;
create policy "anon_insert_views" on course_views
  for insert with check (true);

-- ═══════════════════════════════════════════════════════
-- Trigger: auto-create profile when a user signs up
-- ═══════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, specialization, center_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'specialization',
    new.raw_user_meta_data->>'centerName'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
