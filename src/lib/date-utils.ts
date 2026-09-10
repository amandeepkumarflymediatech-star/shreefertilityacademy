/**
 * Standardized Date and Time formatting utilities for Shree Fertility Academy
 * Defaulting to India Standard Time (IST / Asia/Kolkata, UTC+5:30)
 */

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Formats time accurately (e.g., "10:00 AM", "04:30 PM")
 */
export function formatClassTime(
  date: Date | string | number | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });
}

/**
 * Formats short/medium date (e.g., "Sep 16, 2026" or "Wed, Sep 16, 2026")
 */
export function formatClassDate(
  date: Date | string | number | null | undefined,
  includeWeekday = false,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-US", {
    weekday: includeWeekday ? "short" : undefined,
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
}

/**
 * Formats full date with day name (e.g., "Wednesday, Sep 16, 2026")
 */
export function formatClassDateFull(
  date: Date | string | number | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
}

/**
 * Formats full date and time (e.g., "Wed, Sep 16, 10:00 AM")
 */
export function formatClassDateTime(
  date: Date | string | number | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  return `${formatClassDate(d, true, timeZone)} at ${formatClassTime(d, timeZone)}`;
}
