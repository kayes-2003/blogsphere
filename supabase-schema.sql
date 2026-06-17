create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  bio         text,
  avatar_url  text,
  website     text,
  twitter     text,
  role        text not null default 'reader' check (role in ('reader','author','admin')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
create policy "Categories are public" on public.categories for select using (true);
create policy "Admins manage categories"
  on public.categories for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Seed categories
insert into public.categories (name, slug) values
  ('Technology',     'technology'),
  ('Design',         'design'),
  ('Business',       'business'),
  ('Science',        'science'),
  ('Culture',        'culture'),
  ('Health',         'health'),
  ('Travel',         'travel'),
  ('Personal',       'personal')
on conflict do nothing;

-- ── Posts
create table if not exists public.posts (
  id           uuid primary key default uuid_generate_v4(),
  author_id    uuid not null references public.profiles(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete set null,
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  cover_image  text,
  status       text not null default 'draft' check (status in ('draft','published','archived')),
  read_time    int,
  views        int default 0,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Published posts are public"
  on public.posts for select
  using (status = 'published');

create policy "Authors can view own posts"
  on public.posts for select
  using (auth.uid() = author_id);

create policy "Authors can insert posts"
  on public.posts for insert
  with check (
    auth.uid() = author_id and
    (select role from public.profiles where id = auth.uid()) in ('author','admin')
  );

create policy "Authors can update own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

create policy "Admins have full access to posts"
  on public.posts for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Index for slug lookups
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_author_idx on public.posts (author_id);
create index if not exists posts_status_idx on public.posts (status);

-- ── Comments 
create table if not exists public.comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  approved   boolean default false,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Approved comments are public"
  on public.comments for select
  using (approved = true);

create policy "Authors see own comments"
  on public.comments for select
  using (auth.uid() = author_id);

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Admins manage all comments"
  on public.comments for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- ── Storage buckets 
-- Run these in the Supabase Storage section OR via SQL:
insert into storage.buckets (id, name, public)
  values ('blog-images', 'blog-images', true)
  on conflict do nothing;

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict do nothing;

-- Storage policies
create policy "Blog images are public"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Authors can upload blog images"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-images' and
    (select role from public.profiles where id = auth.uid()) in ('author','admin')
  );

create policy "Avatars are public"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid() is not null);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid() is not null);

-- ── Team Members 
create table if not exists public.team_members (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  role       text not null,
  bio        text,
  avatar_url text,
  twitter    text,
  linkedin   text,
  sort_order int default 0,
  visible    boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.team_members enable row level security;

create policy "Team members are public"
  on public.team_members for select using (visible = true);

create policy "Admins manage team members"
  on public.team_members for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Seed initial team
insert into public.team_members (name, role, bio, avatar_url, sort_order) values
  ('Sarah Chen',  'Founder & CEO',    'Passionate about making writing accessible to everyone.', 'https://i.pravatar.cc/150?img=47', 1),
  ('Marcus Webb', 'Lead Engineer',    'Building fast, reliable systems for writers worldwide.',  'https://i.pravatar.cc/150?img=12', 2),
  ('Aisha Patel', 'Head of Design',   'Crafting beautiful experiences one pixel at a time.',     'https://i.pravatar.cc/150?img=48', 3),
  ('David Kim',   'Community Manager','Connecting writers and helping communities thrive.',       'https://i.pravatar.cc/150?img=15', 4)
on conflict do nothing;
