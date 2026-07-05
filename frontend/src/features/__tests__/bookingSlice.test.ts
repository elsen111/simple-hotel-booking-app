import { describe, expect, it } from "vitest";
import {
  bookingReducer,
  generateDailySelections,
  initialState,
  setBookingInfo,
  updateDailySelection,
} from "../bookingSlice";

describe("bookingSlice", () => {
  it("merges partial config updates", () => {
    const state = bookingReducer(initialState, setBookingInfo({ destination: "Italy" }));
    expect(state.destination).toBe("Italy");
  });

  it("clears daily hotel/meal selections when the destination changes", () => {
    const withDates = bookingReducer(
      { ...initialState, startDate: "2026-08-01", days: 2, destination: "Turkey" },
      generateDailySelections()
    );
    const withSelection = bookingReducer(
      withDates,
      updateDailySelection({ index: 0, selection: { hotelId: 101 } })
    );

    const afterDestinationChange = bookingReducer(withSelection, setBookingInfo({ destination: "Italy" }));
    expect(afterDestinationChange.dailySelections[0].hotelId).toBeNull();
  });

  it("strips disallowed meals when switching to No Board", () => {
    const withMeal: typeof initialState = {
      ...initialState,
      boardType: "FB",
      dailySelections: [{ date: "2026-08-01", hotelId: 101, lunchId: 4, dinnerId: 1 }],
    };

    const result = bookingReducer(withMeal, setBookingInfo({ boardType: "NB" }));
    expect(result.dailySelections[0].lunchId).toBeNull();
    expect(result.dailySelections[0].dinnerId).toBeNull();
  });

  it("generates one row per day, preserving existing selections for unchanged dates", () => {
    const step1 = { ...initialState, startDate: "2026-08-01", days: 2 };
    const generated = bookingReducer(step1, generateDailySelections());
    expect(generated.dailySelections).toHaveLength(2);
    expect(generated.dailySelections.map((d) => d.date)).toEqual(["2026-08-01", "2026-08-02"]);
  });
});
