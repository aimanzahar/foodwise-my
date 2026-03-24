create table if not exists recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null references community_recipes(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_comments_recipe_id on recipe_comments(recipe_id);
