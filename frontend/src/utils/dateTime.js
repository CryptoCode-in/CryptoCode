/**
 * Shared date & time utilities for CryptoCode
 * Ensures consistent handling of timestamps in Indian Standard Time (IST, UTC+05:30)
 */

export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Safely parses a UTC date string from PostgreSQL/Supabase.
 * If the string lacks a timezone suffix (e.g. "2026-10-31T18:40:40.259578"),
 * appends "Z" so JavaScript does not treat it as local browser time.
 */
export function parseUtcDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }
  let s = String(dateStr).trim();
  if (!s.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(s)) {
    s += "Z";
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

const istDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const istTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const istDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TIMEZONE,
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/**
 * Formats a submission timestamp in Indian Standard Time (IST):
 * - If submitted today in IST: "Today, 06:40 PM"
 * - If submitted on any other date: "Oct 26, 2026, 06:21 AM"
 */
export function formatSubmissionDate(dateStr) {
  if (!dateStr) return "—";
  const date = parseUtcDate(dateStr);
  if (!date) return String(dateStr);

  const isToday = istDayFormatter.format(date) === istDayFormatter.format(new Date());
  const timePart = istTimeFormatter.format(date);

  if (isToday) {
    return `Today, ${timePart}`;
  }

  return `${istDateFormatter.format(date)}, ${timePart}`;
}
