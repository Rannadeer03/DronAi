-- DronAI Phase 1: profiles, devices, drones, drone_logs

create type user_role as enum ('admin', 'pilot', 'user');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'user',
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

create function is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create policy "profiles_select_self_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
-- deliberately no insert/update policy for authenticated: role is only ever
-- set by handle_new_user() below or by a service_role client.

create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create table devices (
  id uuid primary key default gen_random_uuid(),
  device_uid text not null unique,
  public_key text not null,
  status text not null default 'unclaimed' check (status in ('unclaimed', 'claimed')),
  claimed_by uuid references profiles(id),
  last_seen timestamptz,
  created_at timestamptz not null default now()
);
alter table devices enable row level security;
-- zero policies on purpose: default-deny for anon/authenticated.
-- only the backend's service_role client (bypasses RLS) touches this table.

create table drones (
  id uuid primary key default gen_random_uuid(),
  drone_uid text not null unique,
  device_id uuid not null unique references devices(id),
  name text not null default 'My Drone',
  owner_id uuid not null references profiles(id),
  status text not null default 'offline' check (status in ('online', 'offline')),
  armed boolean not null default false,
  last_telemetry jsonb not null default '{}'::jsonb,
  last_seen timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index drones_owner_id_idx on drones(owner_id);
alter table drones enable row level security;

create policy "drones_select_owner_or_admin" on drones
  for select using (owner_id = auth.uid() or is_admin());

create table drone_logs (
  id uuid primary key default gen_random_uuid(),
  drone_id uuid not null references drones(id) on delete cascade,
  ts timestamptz not null default now(),
  level text not null default 'info' check (level in ('debug', 'info', 'warning', 'error', 'critical')),
  event_type text not null,
  message text,
  metadata jsonb not null default '{}'::jsonb
);
create index drone_logs_drone_id_ts_idx on drone_logs(drone_id, ts desc);
alter table drone_logs enable row level security;

create policy "drone_logs_select_owner_or_admin" on drone_logs
  for select using (
    is_admin() or exists (
      select 1 from drones d where d.id = drone_id and d.owner_id = auth.uid()
    )
  );
