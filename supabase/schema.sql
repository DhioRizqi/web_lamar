-- =====================================
-- APPLYO — Database Schema
-- Jalankan di Supabase SQL Editor
-- =====================================

-- TABLE: applications
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  company     text not null,
  position    text not null,
  apply_date  date not null,
  job_url     text,
  notes       text,
  status      text not null default 'applied'
                check (status in ('applied','review','interview','offer','rejected','ghosted','withdrawn','saved')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- TABLE: notifications
create table if not exists public.notifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  application_id  uuid references public.applications(id) on delete cascade,
  message         text not null,
  is_read         boolean not null default false,
  scheduled_at    timestamptz not null,
  created_at      timestamptz not null default now()
);

-- AUTO UPDATE updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.handle_updated_at();

-- RLS: applications
alter table public.applications enable row level security;

create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- RLS: notifications
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);
