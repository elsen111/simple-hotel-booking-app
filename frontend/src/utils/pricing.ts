import type { DailySelection } from "../types/booking.types";
import type { HotelData, MealsData } from "../types/data.types";

export interface DayPriceBreakdown {
  date: string;
  hotelName: string | null;
  hotelPrice: number;
  lunchName: string | null;
  lunchPrice: number;
  dinnerName: string | null;
  dinnerPrice: number;
  dayTotal: number;
}

function findHotel(hotels: HotelData, destination: string, hotelId: number | null) {
  if (hotelId === null) return undefined;
  return hotels[destination]?.find((hotel) => hotel.id === hotelId);
}

function findMeal(meals: MealsData, destination: string, category: "lunch" | "dinner", mealId: number | null) {
  if (mealId === null) return undefined;
  return meals[destination]?.[category]?.find((meal) => meal.id === mealId);
}

export function computeDayPrice(
  day: DailySelection,
  destination: string,
  hotels: HotelData,
  meals: MealsData
): DayPriceBreakdown {
  const hotel = findHotel(hotels, destination, day.hotelId);
  const lunch = findMeal(meals, destination, "lunch", day.lunchId);
  const dinner = findMeal(meals, destination, "dinner", day.dinnerId);

  const hotelPrice = hotel?.price ?? 0;
  const lunchPrice = lunch?.price ?? 0;
  const dinnerPrice = dinner?.price ?? 0;

  return {
    date: day.date,
    hotelName: hotel?.name ?? null,
    hotelPrice,
    lunchName: lunch?.name ?? null,
    lunchPrice,
    dinnerName: dinner?.name ?? null,
    dinnerPrice,
    dayTotal: hotelPrice + lunchPrice + dinnerPrice,
  };
}

export function computeAllDayPrices(
  days: DailySelection[],
  destination: string,
  hotels: HotelData,
  meals: MealsData
): DayPriceBreakdown[] {
  return days.map((day) => computeDayPrice(day, destination, hotels, meals));
}

export function computeGrandTotal(breakdown: DayPriceBreakdown[]): number {
  return breakdown.reduce((sum, day) => sum + day.dayTotal, 0);
}
