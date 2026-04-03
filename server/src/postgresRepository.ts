import type { Pool } from "pg";
import type { PantryItem } from "../../shared/contracts";
import type { AppRepository, SeedSnapshot, SessionRecord, UserRecord } from "./repository";

export function createPostgresRepository(pool: Pool): AppRepository {
  return {
    async createUser(email, passwordHash) {
      try {
        const result = await pool.query<{ id: string; email: string }>(
          `
            insert into users (email, password_hash)
            values ($1, $2)
            returning id::text as id, email::text as email
          `,
          [email.trim().toLowerCase(), passwordHash],
        );

        return result.rows[0];
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new Error("email_taken");
        }

        throw error;
      }
    },

    async findUserByEmail(email) {
      const result = await pool.query<UserRecord>(
        `
          select id::text as id, email::text as email, password_hash as "passwordHash"
          from users
          where email = $1
        `,
        [email.trim().toLowerCase()],
      );

      return result.rows[0] ?? null;
    },

    async findUserById(id) {
      const result = await pool.query<{ id: string; email: string }>(
        `
          select id::text as id, email::text as email
          from users
          where id = $1
        `,
        [id],
      );

      return result.rows[0] ?? null;
    },

    async createSession(session) {
      await pool.query(
        `
          insert into sessions (id, user_id, token_hash, expires_at)
          values ($1, $2, $3, $4)
        `,
        [session.id, session.userId, session.tokenHash, session.expiresAt],
      );
    },

    async findSession(tokenHash) {
      const result = await pool.query<SessionRecord>(
        `
          select
            id::text as id,
            user_id::text as "userId",
            token_hash as "tokenHash",
            expires_at::text as "expiresAt"
          from sessions
          where token_hash = $1
        `,
        [tokenHash],
      );

      return result.rows[0] ?? null;
    },

    async deleteSession(tokenHash) {
      await pool.query("delete from sessions where token_hash = $1", [tokenHash]);
    },

    async getPantry(userId) {
      const result = await pool.query<{ name: string; category: string; quantity: string; unit: string }>(
        `
          select name, category, quantity, unit
          from pantry_items
          where user_id = $1
          order by added_at asc, name asc
        `,
        [userId],
      );

      return result.rows.map((row) => ({
        name: row.name,
        category: row.category,
        quantity: Number(row.quantity),
        unit: row.unit,
      }));
    },

    async addPantryItem(userId, item) {
      await pool.query(
        `
          insert into pantry_items (user_id, name, category, quantity, unit)
          values ($1, $2, $3, $4, $5)
          on conflict (user_id, name) do update set
            category = excluded.category,
            quantity = pantry_items.quantity + excluded.quantity,
            unit = excluded.unit
        `,
        [userId, item.name, item.category, item.quantity, item.unit],
      );

      return this.getPantry(userId);
    },

    async removePantryItem(userId, name) {
      await pool.query(
        `
          delete from pantry_items
          where user_id = $1 and name = $2
        `,
        [userId, name],
      );

      return this.getPantry(userId);
    },

    async updatePantryItem(userId, name, updates) {
      const setClauses: string[] = [];
      const values: unknown[] = [userId, name];
      let paramIndex = 3;

      if (updates.quantity !== undefined) {
        setClauses.push(`quantity = $${paramIndex}`);
        values.push(updates.quantity);
        paramIndex++;
      }
      if (updates.unit !== undefined) {
        setClauses.push(`unit = $${paramIndex}`);
        values.push(updates.unit);
        paramIndex++;
      }

      if (setClauses.length > 0) {
        await pool.query(
          `update pantry_items set ${setClauses.join(", ")} where user_id = $1 and name = $2`,
          values,
        );
      }

      return this.getPantry(userId);
    },

    async getComments(recipeId) {
      const result = await pool.query<{
        id: string;
        recipe_id: string;
        user_id: string;
        author: string;
        content: string;
        created_at: string;
      }>(
        `
          select id::text as id, recipe_id::text as recipe_id, user_id::text as user_id,
                 author, content, created_at::text as created_at
          from recipe_comments
          where recipe_id = $1
          order by created_at asc
        `,
        [recipeId],
      );

      return result.rows.map((row) => ({
        id: row.id,
        recipeId: row.recipe_id,
        userId: row.user_id,
        author: row.author,
        content: row.content,
        createdAt: row.created_at,
      }));
    },

    async addComment(recipeId, userId, author, content) {
      const result = await pool.query<{
        id: string;
        recipe_id: string;
        user_id: string;
        author: string;
        content: string;
        created_at: string;
      }>(
        `
          insert into recipe_comments (recipe_id, user_id, author, content)
          values ($1, $2, $3, $4)
          returning id::text as id, recipe_id::text as recipe_id, user_id::text as user_id,
                     author, content, created_at::text as created_at
        `,
        [recipeId, userId, author, content],
      );

      return result.rows.map((row) => ({
        id: row.id,
        recipeId: row.recipe_id,
        userId: row.user_id,
        author: row.author,
        content: row.content,
        createdAt: row.created_at,
      }));
    },

    async getSeedSnapshot() {
      const [ingredients, foodItems, disruptions, recipes, communityRecipes] = await Promise.all([
        pool.query<{ name: string; category: string; default_unit: string }>(
          `
            select name, category, default_unit
            from ingredients_catalog
            order by sort_order asc, name asc
          `,
        ),
        pool.query<{
          id: string;
          name: SeedSnapshot["foodItems"][number]["name"];
          category: string;
          current_price: string;
          previous_price: string;
          unit: string;
          region: string;
          trend: number[];
          national_avg: string;
          rating: string | null;
        }>(
          `
            select id, name, category, current_price, previous_price, unit, region, trend, national_avg, rating
            from food_items
            order by id asc
          `,
        ),
        pool.query<{
          id: string;
          item: SeedSnapshot["disruptions"][number]["item"];
          region: string;
          severity: "high" | "medium" | "low";
          description: SeedSnapshot["disruptions"][number]["description"];
          date: string;
        }>(
          `
            select id, item, region, severity, description, date::text as date
            from disruptions
            order by date desc, id asc
          `,
        ),
        pool.query<{
          id: string;
          name: SeedSnapshot["recipes"][number]["name"];
          ingredients: string[];
          prep_time: number;
          estimated_cost: string;
          calories: number;
          tags: string[];
          steps: SeedSnapshot["recipes"][number]["steps"];
        }>(
          `
            select id, name, ingredients, prep_time, estimated_cost, calories, tags, steps
            from recipes
            order by id asc
          `,
        ),
        pool.query<{
          id: string;
          title: SeedSnapshot["communityRecipes"][number]["title"];
          author: string;
          rating: string;
          comment_count: string;
          description: SeedSnapshot["communityRecipes"][number]["description"];
          ingredients: string[];
          tips: SeedSnapshot["communityRecipes"][number]["tips"];
        }>(
          `
            select cr.id, cr.title, cr.author, cr.rating, cr.description, cr.ingredients, cr.tips,
                   count(rc.id)::text as comment_count
            from community_recipes cr
            left join recipe_comments rc on rc.recipe_id = cr.id
            group by cr.id, cr.title, cr.author, cr.rating, cr.description, cr.ingredients, cr.tips
            order by cr.id asc
          `,
        ),
      ]);

      return {
        commonIngredients: ingredients.rows.map((row) => ({
          name: row.name,
          category: row.category,
          defaultUnit: row.default_unit,
        })),
        foodItems: foodItems.rows.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          currentPrice: Number(row.current_price),
          previousPrice: Number(row.previous_price),
          unit: row.unit,
          region: row.region,
          trend: row.trend.map(Number),
          nationalAvg: Number(row.national_avg),
          rating: (row.rating as "A" | "B" | "C") ?? null,
        })),
        disruptions: disruptions.rows.map((row) => ({
          id: row.id,
          item: row.item,
          region: row.region,
          severity: row.severity,
          description: row.description,
          date: row.date,
        })),
        recipes: recipes.rows.map((row) => ({
          id: row.id,
          name: row.name,
          ingredients: row.ingredients,
          prepTime: row.prep_time,
          estimatedCost: Number(row.estimated_cost),
          calories: row.calories,
          tags: row.tags,
          steps: row.steps,
        })),
        communityRecipes: communityRecipes.rows.map((row) => ({
          id: row.id,
          title: row.title,
          author: row.author,
          rating: Number(row.rating),
          comments: Number(row.comment_count),
          description: row.description,
          ingredients: row.ingredients,
          tips: row.tips,
        })),
      };
    },
  };
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string" &&
      (error as { code: string }).code === "23505",
  );
}
