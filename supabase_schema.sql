-- 1. Profiles Table (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  phone text,
  image text
);

-- 2. Menu Items Table
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image text,
  rating numeric default 5,
  calories numeric default 0,
  spiciness numeric default 0,
  sweetness numeric default 0,
  protein numeric default 0,
  carbs numeric default 0
);

-- 3. Orders Table
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users,
  customer text,
  items jsonb, -- Stores the array of CartItems
  total numeric,
  status text default 'pending',
  date text,
  payment text,
  type text,
  confirmation_code text,
  delivery_info jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Reviews Table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  username text,
  rating numeric,
  comment text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

-- 6. Create Policies for Tables

-- Profiles: Public read, User update own
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Menu Items: Public read, All insert/update/delete (Protected by App Admin Login logic)
drop policy if exists "Menu items are viewable by everyone." on public.menu_items;
create policy "Menu items are viewable by everyone." on public.menu_items for select using (true);

drop policy if exists "Enable insert for authenticated users and anon (Hybrid)." on public.menu_items;
create policy "Enable insert for authenticated users and anon (Hybrid)." on public.menu_items for insert with check (true);

drop policy if exists "Enable update for authenticated users and anon." on public.menu_items;
create policy "Enable update for authenticated users and anon." on public.menu_items for update using (true);

drop policy if exists "Enable delete for authenticated users and anon." on public.menu_items;
create policy "Enable delete for authenticated users and anon." on public.menu_items for delete using (true);

-- Orders: Public read (for tracking), All insert/update
drop policy if exists "Orders are viewable by everyone." on public.orders;
create policy "Orders are viewable by everyone." on public.orders for select using (true);

drop policy if exists "Enable insert for everyone." on public.orders;
create policy "Enable insert for everyone." on public.orders for insert with check (true);

drop policy if exists "Enable update for everyone." on public.orders;
create policy "Enable update for everyone." on public.orders for update using (true);

-- Reviews: Public read, Insert authenticated, Update/Delete by Admin (managed by logic or role) or simplistic policy for now
drop policy if exists "Reviews are viewable by everyone." on public.reviews;
create policy "Reviews are viewable by everyone." on public.reviews for select using (true);

drop policy if exists "Enable insert reviews for everyone." on public.reviews;
create policy "Enable insert reviews for everyone." on public.reviews for insert with check (true);

drop policy if exists "Enable update reviews for everyone." on public.reviews;
create policy "Enable update reviews for everyone." on public.reviews for update using (true);

-- 7. Storage Bucket & Policies (Fix for Upload Error)
-- Ensure the 'images' bucket exists and is public
insert into storage.buckets (id, name, public) 
values ('images', 'images', true) 
on conflict (id) do update set public = true;

-- Drop existing policies to prevent conflicts
drop policy if exists "Give public access to images" on storage.objects;
drop policy if exists "Allow public uploads to images" on storage.objects;
drop policy if exists "Allow public updates to images" on storage.objects;

-- Policy to allow public viewing of images
create policy "Give public access to images" 
on storage.objects for select 
using ( bucket_id = 'images' );

-- Policy to allow anyone (anon + authenticated) to upload images
create policy "Allow public uploads to images" 
on storage.objects for insert 
with check ( bucket_id = 'images' );

-- Policy to allow updates (e.g. overwriting)
create policy "Allow public updates to images" 
on storage.objects for update 
using ( bucket_id = 'images' );