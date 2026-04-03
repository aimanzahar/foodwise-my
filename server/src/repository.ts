import type { AppUser, CommonIngredient, CommunityRecipe, Disruption, FoodItem, PantryItem, Recipe, RecipeComment } from "../../shared/contracts";

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
  commonIngredients: CommonIngredient[];
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
  getPantry(userId: string): Promise<PantryItem[]>;
  addPantryItem(userId: string, item: PantryItem): Promise<PantryItem[]>;
  removePantryItem(userId: string, name: string): Promise<PantryItem[]>;
  updatePantryItem(userId: string, name: string, updates: Partial<Pick<PantryItem, "quantity" | "unit">>): Promise<PantryItem[]>;
  getSeedSnapshot(): Promise<SeedSnapshot>;
  getComments(recipeId: string): Promise<RecipeComment[]>;
  addComment(recipeId: string, userId: string, author: string, content: string): Promise<RecipeComment[]>;
}
