import { describe, expect, it } from "vitest";
import { generateDateRange, getEndDate } from "../dates";

describe("generateDateRange", () => {
  it("generates one ISO date per day starting from the given date", () => {
    expect(generateDateRange("2026-08-01", 3)).toEqual([
      "2026-08-01",
      "2026-08-02",
      "2026-08-03",
    ]);
  });

  it("returns an empty array for invalid input", () => {
    expect(generateDateRange("", 3)).toEqual([]);
    expect(generateDateRange("2026-08-01", 0)).toEqual([]);
    expect(generateDateRange("not-a-date", 3)).toEqual([]);
  });
});

describe("getEndDate", () => {
  it("returns the checkout date, `days` after the start date", () => {
    expect(getEndDate("2026-08-01", 3)).toBe("2026-08-04");
  });
});
