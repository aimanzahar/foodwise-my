import { randomUUID } from "node:crypto";
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
  const pantryByUserId = new Map<string, Set<string>>();

  const seedSnapshot: SeedSnapshot = {
    commonIngredients: [...commonIngredientsSeed],
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
      pantryByUserId.set(user.id, new Set());

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
      return [...(pantryByUserId.get(userId) ?? new Set())].sort((left, right) => left.localeCompare(right));
    },

    async addPantryItem(userId, name) {
      const pantry = pantryByUserId.get(userId) ?? new Set<string>();
      pantry.add(name);
      pantryByUserId.set(userId, pantry);
      return [...pantry].sort((left, right) => left.localeCompare(right));
    },

    async removePantryItem(userId, name) {
      const pantry = pantryByUserId.get(userId) ?? new Set<string>();
      pantry.delete(name);
      pantryByUserId.set(userId, pantry);
      return [...pantry].sort((left, right) => left.localeCompare(right));
    },

    async getSeedSnapshot() {
      return seedSnapshot;
    },
  };
}
