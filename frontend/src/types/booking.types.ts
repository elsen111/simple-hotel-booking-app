import type { BoardCode } from "./data.types";

export interface DailySelection {
  date: string;
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
}

export interface BookingConfig {
  citizenship: string;
  destination: string;
  boardType: BoardCode | "";
  startDate: string;
  days: number;
}

export interface BookingState extends BookingConfig {
  currentStep: 1 | 2 | 3;
  dailySelections: DailySelection[];
}

export interface SavedBooking {
  id: string;
  name: string;
  savedAt: string;
  state: BookingState;
}
