import { describe, expect, it } from "vitest";
import { computeAllDayPrices, computeDayPrice, computeGrandTotal } from "../pricing";
import { hotels } from "../../data/hotels";
import { meals } from "../../data/meals";
import type { DailySelection } from "../../types/booking.types";

describe("computeDayPrice", () => {
  it("sums hotel + lunch + dinner price for a fully booked day", () => {
    const day: DailySelection = { date: "2026-08-01", hotelId: 101, lunchId: 4, dinnerId: 1 };
    const result = computeDayPrice(day, "Turkey", hotels, meals);

    expect(result.dayTotal).toBe(145);
    expect(result.hotelName).toBe("Hilton Istanbul");
  });

  it("treats unselected meals as zero cost", () => {
    const day: DailySelection = { date: "2026-08-01", hotelId: 101, lunchId: null, dinnerId: null };
    const result = computeDayPrice(day, "Turkey", hotels, meals);
    expect(result.dayTotal).toBe(120);
  });

  it("returns zero total when nothing is selected yet", () => {
    const day: DailySelection = { date: "2026-08-01", hotelId: null, lunchId: null, dinnerId: null };
    const result = computeDayPrice(day, "Turkey", hotels, meals);
    expect(result.dayTotal).toBe(0);
  });
});

describe("computeGrandTotal", () => {
  it("sums totals across every day of the stay", () => {
    const days: DailySelection[] = [
      { date: "2026-08-01", hotelId: 101, lunchId: 4, dinnerId: null },
      { date: "2026-08-02", hotelId: 101, lunchId: null, dinnerId: 1 },
    ];
    const breakdown = computeAllDayPrices(days, "Turkey", hotels, meals);
    expect(computeGrandTotal(breakdown)).toBe(265);
  });
});
