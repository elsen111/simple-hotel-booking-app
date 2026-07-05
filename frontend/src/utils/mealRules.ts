import type { BoardCode } from "../types/data.types";
import type { DailySelection } from "../types/booking.types";

export type MealField = "lunchId" | "dinnerId";

export function isMealFieldEnabled(boardType: BoardCode | "", field: MealField, day: DailySelection): boolean {
  if (boardType === "NB" || boardType === "") return false;
  if (boardType === "FB") return true;

  const otherField: MealField = field === "lunchId" ? "dinnerId" : "lunchId";
  return day[otherField] === null;
}

export function applyMealSelection(
  day: DailySelection,
  boardType: BoardCode | "",
  field: MealField,
  value: number | null
): DailySelection {
  if (boardType === "NB" || boardType === "") {
    return { ...day, lunchId: null, dinnerId: null };
  }

  const next: DailySelection = { ...day, [field]: value };

  if (boardType === "HB" && value !== null) {
    const otherField: MealField = field === "lunchId" ? "dinnerId" : "lunchId";
    next[otherField] = null;
  }

  return next;
}

export function sanitizeDayForBoardType(day: DailySelection, boardType: BoardCode | ""): DailySelection {
  if (boardType === "NB" || boardType === "") {
    return { ...day, lunchId: null, dinnerId: null };
  }
  if (boardType === "HB" && day.lunchId !== null && day.dinnerId !== null) {
    return { ...day, dinnerId: null };
  }
  return day;
}
