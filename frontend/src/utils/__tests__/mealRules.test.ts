import { describe, expect, it } from "vitest";
import { applyMealSelection, isMealFieldEnabled, sanitizeDayForBoardType } from "../mealRules";
import type { DailySelection } from "../../types/booking.types";

const baseDay: DailySelection = { date: "2026-08-01", hotelId: 101, lunchId: null, dinnerId: null };

describe("isMealFieldEnabled", () => {
  it("disables both meals for No Board", () => {
    expect(isMealFieldEnabled("NB", "lunchId", baseDay)).toBe(false);
    expect(isMealFieldEnabled("NB", "dinnerId", baseDay)).toBe(false);
  });

  it("enables both meals for Full Board regardless of the other selection", () => {
    const dayWithLunch = { ...baseDay, lunchId: 4 };
    expect(isMealFieldEnabled("FB", "lunchId", dayWithLunch)).toBe(true);
    expect(isMealFieldEnabled("FB", "dinnerId", dayWithLunch)).toBe(true);
  });

  it("makes lunch and dinner mutually exclusive for Half Board", () => {
    const dayWithLunch = { ...baseDay, lunchId: 4 };
    expect(isMealFieldEnabled("HB", "lunchId", dayWithLunch)).toBe(true);
    expect(isMealFieldEnabled("HB", "dinnerId", dayWithLunch)).toBe(false);

    const dayWithDinner = { ...baseDay, dinnerId: 1 };
    expect(isMealFieldEnabled("HB", "dinnerId", dayWithDinner)).toBe(true);
    expect(isMealFieldEnabled("HB", "lunchId", dayWithDinner)).toBe(false);
  });
});

describe("applyMealSelection", () => {
  it("clears the opposite meal when selecting one under Half Board", () => {
    const dayWithDinner = { ...baseDay, dinnerId: 1 };
    const result = applyMealSelection(dayWithDinner, "HB", "lunchId", 4);
    expect(result.lunchId).toBe(4);
    expect(result.dinnerId).toBeNull();
  });

  it("allows both meals under Full Board", () => {
    const withLunch = applyMealSelection(baseDay, "FB", "lunchId", 4);
    const withBoth = applyMealSelection(withLunch, "FB", "dinnerId", 1);
    expect(withBoth.lunchId).toBe(4);
    expect(withBoth.dinnerId).toBe(1);
  });

  it("forces both meals to null under No Board", () => {
    const result = applyMealSelection({ ...baseDay, lunchId: 4 }, "NB", "dinnerId", 1);
    expect(result.lunchId).toBeNull();
    expect(result.dinnerId).toBeNull();
  });

  it("never mutates the original day object", () => {
    const original = { ...baseDay, lunchId: 4 };
    const snapshot = { ...original };
    applyMealSelection(original, "HB", "dinnerId", 1);
    expect(original).toEqual(snapshot);
  });
});

describe("sanitizeDayForBoardType", () => {
  it("clears both meals when the board type is No Board", () => {
    const day = { ...baseDay, lunchId: 4, dinnerId: 1 };
    expect(sanitizeDayForBoardType(day, "NB")).toEqual({ ...day, lunchId: null, dinnerId: null });
  });

  it("drops dinner if both meals are somehow set under Half Board", () => {
    const day = { ...baseDay, lunchId: 4, dinnerId: 1 };
    const result = sanitizeDayForBoardType(day, "HB");
    expect(result.lunchId).toBe(4);
    expect(result.dinnerId).toBeNull();
  });

  it("leaves a valid Full Board day untouched", () => {
    const day = { ...baseDay, lunchId: 4, dinnerId: 1 };
    expect(sanitizeDayForBoardType(day, "FB")).toEqual(day);
  });
});
