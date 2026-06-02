export interface Ingredient {
  name: string;
  qty: string;
  unit: string;
}

export interface Step {
  order: number;
  text: string;
}

export interface RecipeAuthor {
  _id: string;
  username: string;
  name: string;
  avatarUrl?: string;
}

export interface Recipe {
  _id: string;
  slug: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  coverImageUrl: string;
  authorId: string;
  author?: RecipeAuthor;
  viewCount: number;
  savedCount: number;
  avgRating: number;
  ratingsCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
