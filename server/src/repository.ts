import type { AppUser, CommunityRecipe, Disruption, FoodItem, Recipe, RecipeComment } from "../../shared/contracts";

export interface UserRecord extends AppUser {
  passwordHash: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}

export interface SeedSnapshot {
  commonIngredients: string[];
  foodItems: FoodItem[];
  disruptions: Disruption[];
  recipes: Recipe[];
  communityRecipes: CommunityRecipe[];
}

export interface AppRepository {
  createUser(email: string, passwordHash: string): Promise<AppUser>;
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserById(id: string): Promise<AppUser | null>;
  createSession(session: SessionRecord): Promise<void>;
  findSession(tokenHash: string): Promise<SessionRecord | null>;
  deleteSession(tokenHash: string): Promise<void>;
  getPantry(userId: string): Promise<string[]>;
  addPantryItem(userId: string, name: string): Promise<string[]>;
  removePantryItem(userId: string, name: string): Promise<string[]>;
  getSeedSnapshot(): Promise<SeedSnapshot>;
  getComments(recipeId: string): Promise<RecipeComment[]>;
  addComment(recipeId: string, userId: string, author: string, content: string): Promise<RecipeComment[]>;
}
