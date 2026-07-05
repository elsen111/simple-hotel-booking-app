import { describe, expect, it } from "vitest";
import { isStep1Valid, validateStep1 } from "../validation";
import type { BookingConfig } from "../../types/booking.types";

const validConfig: BookingConfig = {
  citizenship: "Turkey",
  destination: "Italy",
  boardType: "FB",
  startDate: "2026-08-01",
  days: 5,
};

describe("validateStep1", () => {
  it("returns no errors for a fully valid configuration", () => {
    expect(validateStep1(validConfig)).toEqual({});
    expect(isStep1Valid(validConfig)).toBe(true);
  });

  it("flags missing required fields", () => {
    const errors = validateStep1({ ...validConfig, citizenship: "", boardType: "" });
    expect(errors.citizenship).toBeDefined();
    expect(errors.boardType).toBeDefined();
  });

  it("flags an invalid number of days", () => {
    expect(validateStep1({ ...validConfig, days: 0 }).days).toBeDefined();
    expect(validateStep1({ ...validConfig, days: 90 }).days).toBeDefined();
  });
});
