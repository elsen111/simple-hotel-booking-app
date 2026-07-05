import type { BookingState, SavedBooking } from "../types/booking.types";

const STORAGE_KEY = "hotel-booking:saved-bookings";

function readAll(): SavedBooking[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(bookings: SavedBooking[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function listSavedBookings(): SavedBooking[] {
  return readAll().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveBooking(name: string, state: BookingState): SavedBooking {
  const entry: SavedBooking = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    name: name.trim() || "Untitled booking",
    savedAt: new Date().toISOString(),
    state,
  };

  writeAll([...readAll(), entry]);
  return entry;
}

export function deleteSavedBooking(id: string): void {
  writeAll(readAll().filter((entry) => entry.id !== id));
}
