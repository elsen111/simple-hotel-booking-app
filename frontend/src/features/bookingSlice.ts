import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingState, BookingConfig, DailySelection, SavedBooking } from "../types/booking.types";
import { generateDateRange } from "../utils/dates";
import { sanitizeDayForBoardType } from "../utils/mealRules";

export const initialState: BookingState = {
  citizenship: "",
  destination: "",
  boardType: "",
  startDate: "",
  days: 3,
  currentStep: 1,
  dailySelections: [],
};

function buildDailySelections(dates: string[], previous: DailySelection[]): DailySelection[] {
  const previousByDate = new Map(previous.map((day) => [day.date, day]));

  return dates.map(
    (date) =>
      previousByDate.get(date) ?? {
        date,
        hotelId: null,
        lunchId: null,
        dinnerId: null,
      }
  );
}

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {
    setBookingInfo(state, action: PayloadAction<Partial<BookingConfig>>) {
      Object.assign(state, action.payload);

      if ("destination" in action.payload) {
        state.dailySelections = state.dailySelections.map((day) => ({
          ...day,
          hotelId: null,
          lunchId: null,
          dinnerId: null,
        }));
      }

      if ("boardType" in action.payload) {
        state.dailySelections = state.dailySelections.map((day) =>
          sanitizeDayForBoardType(day, state.boardType)
        );
      }
    },

    generateDailySelections(state) {
      const dates = generateDateRange(state.startDate, state.days);
      state.dailySelections = buildDailySelections(dates, state.dailySelections);
    },

    updateDailySelection(
      state,
      action: PayloadAction<{ index: number; selection: Partial<DailySelection> }>
    ) {
      const { index, selection } = action.payload;
      const current = state.dailySelections[index];
      if (!current) return;
      state.dailySelections[index] = { ...current, ...selection };
    },

    setStep(state, action: PayloadAction<1 | 2 | 3>) {
      state.currentStep = action.payload;
    },

    loadBooking(_state, action: PayloadAction<BookingState>) {
      return action.payload;
    },

    resetBooking() {
      return initialState;
    },
  },
});

export const {
  setBookingInfo,
  generateDailySelections,
  updateDailySelection,
  setStep,
  loadBooking,
  resetBooking,
} = bookingSlice.actions;

export const bookingReducer = bookingSlice.reducer;

export type { SavedBooking };
