/**
 * Returns a YYYY-MM-DD date string in the given IANA timezone.
 * Used by the timeline endpoint to group stops by destination local date.
 *
 * The en-CA locale produces YYYY-MM-DD output directly from Intl.DateTimeFormat.
 */
export function localDateKeyForTrip(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
