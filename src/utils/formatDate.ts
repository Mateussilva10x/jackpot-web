/**
 * Formats a match datetime string into the user's local date and time,
 * automatically respecting the browser's timezone and locale (like FIFA's official schedule).
 *
 * @param dateTime - ISO 8601 datetime string from the API (e.g. "2026-06-11T18:00:00Z")
 * @returns object with formatted `date` and `time` strings in the user's local timezone
 */
export function formatMatchDateTime(dateTime: string): {
  date: string;
  time: string;
} {
  const d = new Date(dateTime);

  // Temporary fix: Add +7 hours to adjust API's UTC time to expected BRT/local time
  d.setTime(d.getTime() + 7 * 60 * 60 * 1000);

  const date = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date, time };
}
