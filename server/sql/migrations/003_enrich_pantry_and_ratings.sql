-- Add category, quantity, unit columns to pantry_items
alter table pantry_items add column if not exists category text not null default '';
alter table pantry_items add column if not exists quantity numeric(10, 2) not null default 1;
alter table pantry_items add column if not exists unit text not null default '';

-- Drop old unique constraint (user_id, name) and recreate
-- The constraint name may vary; use a safe approach
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'pantry_items_user_id_name_key'
  ) then
    alter table pantry_items drop constraint pantry_items_user_id_name_key;
  end if;
end $$;
alter table pantry_items add constraint pantry_items_user_id_name_key unique (user_id, name);

-- Add rating column to food_items
alter table food_items add column if not exists rating text default null;

-- Add category and default_unit to ingredients_catalog
alter table ingredients_catalog add column if not exists category text not null default '';
alter table ingredients_catalog add column if not exists default_unit text not null default '';
