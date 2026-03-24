create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  added_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists ingredients_catalog (
  id text primary key,
  name text not null unique,
  sort_order integer not null
);

create table if not exists food_items (
  id text primary key,
  name jsonb not null,
  category text not null,
  current_price numeric(10, 2) not null,
  previous_price numeric(10, 2) not null,
  unit text not null,
  region text not null,
  trend numeric[] not null,
  national_avg numeric(10, 2) not null
);

create table if not exists disruptions (
  id text primary key,
  item jsonb not null,
  region text not null,
  severity text not null check (severity in ('high', 'medium', 'low')),
  description jsonb not null,
  date date not null
);

create table if not exists recipes (
  id text primary key,
  name jsonb not null,
  ingredients text[] not null,
  prep_time integer not null,
  estimated_cost numeric(10, 2) not null,
  calories integer not null,
  tags text[] not null,
  steps jsonb not null
);

create table if not exists community_recipes (
  id text primary key,
  title jsonb not null,
  author text not null,
  rating numeric(3, 2) not null,
  comments integer not null,
  description jsonb not null default '{"bm":"","en":""}',
  ingredients text[] not null default '{}',
  tips jsonb not null default '{"bm":"","en":""}'
);

create index if not exists idx_sessions_user_id on sessions(user_id);
create index if not exists idx_sessions_token_hash on sessions(token_hash);
create index if not exists idx_pantry_items_user_id on pantry_items(user_id);
