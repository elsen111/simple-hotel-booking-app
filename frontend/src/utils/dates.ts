import { addDays, format, parseISO } from "date-fns";

export function generateDateRange(startDate: string, days: number): string[] {
  if (!startDate || !Number.isFinite(days) || days < 1) return [];

  const start = parseISO(startDate);
  if (Number.isNaN(start.getTime())) return [];

  return Array.from({ length: days }, (_, index) =>
    format(addDays(start, index), "yyyy-MM-dd")
  );
}

/** Human-friendly date label, e.g. "Mon, 12 Jan 2026". */
export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const parsed = parseISO(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return format(parsed, "EEE, d MMM yyyy");
}

/** Returns the checkout date label (start date + number of nights). */
export function getEndDate(startDate: string, days: number): string {
  if (!startDate || !Number.isFinite(days) || days < 1) return "";
  const start = parseISO(startDate);
  if (Number.isNaN(start.getTime())) return "";
  return format(addDays(start, days), "yyyy-MM-dd");
}
