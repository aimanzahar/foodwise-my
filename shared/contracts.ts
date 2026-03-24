export type LocalizedText = {
  bm: string;
  en: string;
};

export interface AppUser {
  id: string;
  email: string;
}

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
}

export interface Disruption {
  id: string;
  item: LocalizedText;
  region: string;
  severity: "high" | "medium" | "low";
  description: LocalizedText;
  date: string;
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
  pantry: string[];
  commonIngredients: string[];
  foodItems: FoodItem[];
  disruptions: Disruption[];
  recipes: Recipe[];
  communityRecipes: CommunityRecipe[];
}
