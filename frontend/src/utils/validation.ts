import type { BookingConfig } from "../types/booking.types";

export type Step1Errors = Partial<Record<keyof BookingConfig, string>>;

export function validateStep1(config: BookingConfig): Step1Errors {
  const errors: Step1Errors = {};

  if (!config.citizenship.trim()) {
    errors.citizenship = "Please select your citizenship.";
  }

  if (!config.destination.trim()) {
    errors.destination = "Please select a destination.";
  }

  if (!config.boardType) {
    errors.boardType = "Please choose a board type.";
  }

  if (!config.startDate) {
    errors.startDate = "Please choose a start date.";
  }

  if (!Number.isFinite(config.days) || config.days < 1) {
    errors.days = "Trip length must be at least 1 day.";
  } else if (config.days > 60) {
    errors.days = "Trip length must be 60 days or fewer.";
  }

  return errors;
}

export function isStep1Valid(config: BookingConfig): boolean {
  return Object.keys(validateStep1(config)).length === 0;
}
