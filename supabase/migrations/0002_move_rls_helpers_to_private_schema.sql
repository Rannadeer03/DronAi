-- Move SECURITY DEFINER helpers out of `public` so PostgREST never exposes
-- them as callable RPC endpoints (advisor: anon/authenticated_security_definer_function_executable).
-- Policies still work: RLS evaluates these internally regardless of schema,
-- as long as the querying role has EXECUTE, which we grant explicitly below.

create schema if not exists private;

drop policy "drones_select_owner_or_admin" on drones;
drop policy "drone_logs_select_owner_or_admin" on drone_logs;
drop policy "profiles_select_self_or_admin" on profiles;
drop trigger on_auth_user_created on auth.users;
drop function public.is_admin();
drop function public.handle_new_user();

create function private.is_admin() returns boolean
language sql security definer set search_path = private, public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = private, public as $$
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
revoke execute on function private.handle_new_user() from public, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create policy "profiles_select_self_or_admin" on profiles
  for select using (id = auth.uid() or private.is_admin());

create policy "drones_select_owner_or_admin" on drones
  for select using (owner_id = auth.uid() or private.is_admin());

create policy "drone_logs_select_owner_or_admin" on drone_logs
  for select using (
    private.is_admin() or exists (
      select 1 from drones d where d.id = drone_id and d.owner_id = auth.uid()
    )
  );
