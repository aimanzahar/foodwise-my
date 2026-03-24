import {
  commonIngredientsSeed,
  communityRecipesSeed,
  disruptionsSeed,
  foodItemsSeed,
  recipesSeed,
} from "../../shared/seed-data";
import { loadDatabaseConfig } from "../src/config";
import { createPool } from "../src/db";

const { DATABASE_URL } = loadDatabaseConfig();
const pool = createPool(DATABASE_URL);

function ingredientId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

try {
  await pool.query("begin");

  for (const [index, name] of commonIngredientsSeed.entries()) {
    await pool.query(
      `
        insert into ingredients_catalog (id, name, sort_order)
        values ($1, $2, $3)
        on conflict (id) do update
        set name = excluded.name,
            sort_order = excluded.sort_order
      `,
      [ingredientId(name), name, index],
    );
  }

  for (const item of foodItemsSeed) {
    await pool.query(
      `
        insert into food_items (
          id,
          name,
          category,
          current_price,
          previous_price,
          unit,
          region,
          trend,
          national_avg
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        on conflict (id) do update
        set name = excluded.name,
            category = excluded.category,
            current_price = excluded.current_price,
            previous_price = excluded.previous_price,
            unit = excluded.unit,
            region = excluded.region,
            trend = excluded.trend,
            national_avg = excluded.national_avg
      `,
      [
        item.id,
        item.name,
        item.category,
        item.currentPrice,
        item.previousPrice,
        item.unit,
        item.region,
        item.trend,
        item.nationalAvg,
      ],
    );
  }

  for (const disruption of disruptionsSeed) {
    await pool.query(
      `
        insert into disruptions (id, item, region, severity, description, date)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (id) do update
        set item = excluded.item,
            region = excluded.region,
            severity = excluded.severity,
            description = excluded.description,
            date = excluded.date
      `,
      [
        disruption.id,
        disruption.item,
        disruption.region,
        disruption.severity,
        disruption.description,
        disruption.date,
      ],
    );
  }

  for (const recipe of recipesSeed) {
    await pool.query(
      `
        insert into recipes (
          id,
          name,
          ingredients,
          prep_time,
          estimated_cost,
          calories,
          tags,
          steps
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        on conflict (id) do update
        set name = excluded.name,
            ingredients = excluded.ingredients,
            prep_time = excluded.prep_time,
            estimated_cost = excluded.estimated_cost,
            calories = excluded.calories,
            tags = excluded.tags,
            steps = excluded.steps
      `,
      [
        recipe.id,
        recipe.name,
        recipe.ingredients,
        recipe.prepTime,
        recipe.estimatedCost,
        recipe.calories,
        recipe.tags,
        recipe.steps,
      ],
    );
  }

  for (const recipe of communityRecipesSeed) {
    await pool.query(
      `
        insert into community_recipes (id, title, author, rating, comments, description, ingredients, tips)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        on conflict (id) do update
        set title = excluded.title,
            author = excluded.author,
            rating = excluded.rating,
            comments = excluded.comments,
            description = excluded.description,
            ingredients = excluded.ingredients,
            tips = excluded.tips
      `,
      [recipe.id, recipe.title, recipe.author, recipe.rating, recipe.comments, recipe.description, recipe.ingredients, recipe.tips],
    );
  }

  await pool.query("commit");
  console.log("Seed data applied.");
} catch (error) {
  await pool.query("rollback");
  throw error;
} finally {
  await pool.end();
}
