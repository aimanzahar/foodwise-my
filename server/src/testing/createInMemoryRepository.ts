import { randomUUID } from "node:crypto";
import type { PantryItem } from "../../../shared/contracts";
import {
  commonIngredientsSeed,
  communityRecipesSeed,
  disruptionsSeed,
  foodItemsSeed,
  recipesSeed,
} from "../../../shared/seed-data";
import type { AppRepository, SeedSnapshot, SessionRecord, UserRecord } from "../repository";

export function createInMemoryRepository(): AppRepository {
  const usersById = new Map<string, UserRecord>();
  const userIdsByEmail = new Map<string, string>();
  const sessionsByTokenHash = new Map<string, SessionRecord>();
  const pantryByUserId = new Map<string, Map<string, PantryItem>>();

  const seedSnapshot: SeedSnapshot = {
    commonIngredients: commonIngredientsSeed.map((item) => ({ ...item })),
    foodItems: foodItemsSeed.map((item) => ({ ...item, name: { ...item.name }, trend: [...item.trend] })),
    disruptions: disruptionsSeed.map((item) => ({
      ...item,
      item: { ...item.item },
      description: { ...item.description },
    })),
    recipes: recipesSeed.map((recipe) => ({
      ...recipe,
      name: { ...recipe.name },
      ingredients: [...recipe.ingredients],
      tags: [...recipe.tags],
      steps: { bm: [...recipe.steps.bm], en: [...recipe.steps.en] },
    })),
    communityRecipes: communityRecipesSeed.map((recipe) => ({ ...recipe, title: { ...recipe.title }, description: { ...recipe.description }, ingredients: [...recipe.ingredients], tips: { ...recipe.tips } })),
  };

  return {
    async createUser(email, passwordHash) {
      const normalizedEmail = email.trim().toLowerCase();

      if (userIdsByEmail.has(normalizedEmail)) {
        throw new Error("email_taken");
      }

      const user = {
        id: randomUUID(),
        email: normalizedEmail,
        passwordHash,
      };

      usersById.set(user.id, user);
      userIdsByEmail.set(normalizedEmail, user.id);
      pantryByUserId.set(user.id, new Map());

      return { id: user.id, email: user.email };
    },

    async findUserByEmail(email) {
      const userId = userIdsByEmail.get(email.trim().toLowerCase());
      return userId ? usersById.get(userId) ?? null : null;
    },

    async findUserById(id) {
      const user = usersById.get(id);
      return user ? { id: user.id, email: user.email } : null;
    },

    async createSession(session) {
      sessionsByTokenHash.set(session.tokenHash, session);
    },

    async findSession(tokenHash) {
      return sessionsByTokenHash.get(tokenHash) ?? null;
    },

    async deleteSession(tokenHash) {
      sessionsByTokenHash.delete(tokenHash);
    },

    async getPantry(userId) {
      const pantryMap = pantryByUserId.get(userId) ?? new Map<string, PantryItem>();
      return [...pantryMap.values()].sort((a, b) => a.name.localeCompare(b.name));
    },

    async addPantryItem(userId, item) {
      const pantryMap = pantryByUserId.get(userId) ?? new Map<string, PantryItem>();
      const existing = pantryMap.get(item.name);
      if (existing) {
        pantryMap.set(item.name, { ...existing, quantity: existing.quantity + item.quantity });
      } else {
        pantryMap.set(item.name, { ...item });
      }
      pantryByUserId.set(userId, pantryMap);
      return this.getPantry(userId);
    },

    async removePantryItem(userId, name) {
      const pantryMap = pantryByUserId.get(userId) ?? new Map<string, PantryItem>();
      pantryMap.delete(name);
      pantryByUserId.set(userId, pantryMap);
      return this.getPantry(userId);
    },

    async updatePantryItem(userId, name, updates) {
      const pantryMap = pantryByUserId.get(userId) ?? new Map<string, PantryItem>();
      const existing = pantryMap.get(name);
      if (existing) {
        pantryMap.set(name, {
          ...existing,
          ...(updates.quantity !== undefined ? { quantity: updates.quantity } : {}),
          ...(updates.unit !== undefined ? { unit: updates.unit } : {}),
        });
      }
      pantryByUserId.set(userId, pantryMap);
      return this.getPantry(userId);
    },

    async getSeedSnapshot() {
      return seedSnapshot;
    },

    async getComments(recipeId) {
      return [];
    },

    async addComment(recipeId, userId, author, content) {
      return [{
        id: randomUUID(),
        recipeId,
        userId,
        author,
        content,
        createdAt: new Date().toISOString(),
      }];
    },
  };
}
