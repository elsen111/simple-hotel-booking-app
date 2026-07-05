import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { hotels } from "../data/hotels";
import { meals } from "../data/meals";
import { computeAllDayPrices, computeGrandTotal } from "../utils/pricing";
import { isStep1Valid } from "../utils/validation";

export const selectBooking = (state: RootState) => state.booking;

export const selectHotelsForDestination = createSelector(
  [(state: RootState) => state.booking.destination],
  (destination) => (destination ? hotels[destination] ?? [] : [])
);

export const selectMealsForDestination = createSelector(
  [(state: RootState) => state.booking.destination],
  (destination) => (destination ? meals[destination] : undefined)
);

export const selectDayPriceBreakdown = createSelector(
  [
    (state: RootState) => state.booking.dailySelections,
    (state: RootState) => state.booking.destination,
  ],
  (dailySelections, destination) => computeAllDayPrices(dailySelections, destination, hotels, meals)
);

export const selectGrandTotal = createSelector([selectDayPriceBreakdown], (breakdown) =>
  computeGrandTotal(breakdown)
);

export const selectIsStep1Valid = (state: RootState) => isStep1Valid(state.booking);

export const selectIsStep2Valid = createSelector(
  [(state: RootState) => state.booking.dailySelections],
  (dailySelections) => dailySelections.length > 0 && dailySelections.every((day) => day.hotelId !== null)
);
