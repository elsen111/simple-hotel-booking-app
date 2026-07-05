export interface Country {
  id: number;
  name: string;
}

export interface Hotel {
  id: number;
  name: string;
  price: number;
}

export type BoardCode = "FB" | "HB" | "NB";

export interface Board {
  code: BoardCode;
  name: string;
  description: string;
}

export interface MealItem {
  id: number;
  name: string;
  price: number;
}

export interface MealCategories {
  dinner: MealItem[];
  lunch: MealItem[];
}

export type HotelData = Record<string, Hotel[]>;

export type MealsData = Record<string, MealCategories>;
