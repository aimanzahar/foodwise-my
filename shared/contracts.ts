export type LocalizedText = {
  bm: string;
  en: string;
};

export interface AppUser {
  id: string;
  email: string;
}

export type PriceRating = "A" | "B" | "C" | null;

export interface FoodItem {
  id: string;
  name: LocalizedText;
  category: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  region: string;
  trend: number[];
  nationalAvg: number;
  rating: PriceRating;
}

export interface Disruption {
  id: string;
  item: LocalizedText;
  region: string;
  severity: "high" | "medium" | "low";
  description: LocalizedText;
  date: string;
}

export interface PantryItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface CommonIngredient {
  name: string;
  category: string;
  defaultUnit: string;
}

export interface Recipe {
  id: string;
  name: LocalizedText;
  ingredients: string[];
  prepTime: number;
  estimatedCost: number;
  calories: number;
  tags: string[];
  steps: {
    bm: string[];
    en: string[];
  };
}

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityRecipe {
  id: string;
  title: LocalizedText;
  author: string;
  rating: number;
  comments: number;
  description: LocalizedText;
  ingredients: string[];
  tips: LocalizedText;
}

export interface AppBootstrap {
  user: AppUser;
  pantry: PantryItem[];
  commonIngredients: CommonIngredient[];
  foodItems: FoodItem[];
  disruptions: Disruption[];
  recipes: Recipe[];
  communityRecipes: CommunityRecipe[];
}
