alter table profiles enable row level security;
drop policy if exists "read own profile" on profiles;
drop policy if exists "insert own profile" on profiles;
drop policy if exists "update own profile" on profiles;
create policy "read own profile" on profiles for select using (id = auth.uid());
create policy "insert own profile" on profiles for insert with check (id = auth.uid());
create policy "update own profile" on profiles for update using (id = auth.uid()) with check (id = auth.uid());