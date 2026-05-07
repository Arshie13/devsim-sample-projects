// L5-T2 BUG (intentional): this helper is wrong in two distinct ways.
//
// Bug 1: it slices the ISO string to its date part (`YYYY-MM-DD`), which
//        throws away the time and timezone information entirely.
// Bug 2: it uses Math.round on the day diff, so 0.4 days → 0 ("today")
//        but 0.6 days → 1 ("1 day ago"), making the label flip back and
//        forth around midnight or a DST boundary.
//
// Reported symptom: "Recipes I posted last night show 'Posted 2 days ago'
// for users in EU; the date label flips by 1 day around midnight."
//
// Students must rewrite this to:
//   - work from raw timestamps (Date.parse(iso) in milliseconds)
//   - use Math.floor on the elapsed-day count
//   - accept an explicit `now` parameter so the function is deterministic
//     and easy to test across timezones / DST boundaries
//
// Required output contract (after fix):
//   - elapsed < 24h           → "Posted today"
//   - elapsed >= 24h * N      → "Posted N day(s) ago"  (N = Math.floor(elapsed/86400000))
export function formatPostedAt(iso: string): string {
  const datePart = iso.split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const diff = (Date.parse(today) - Date.parse(datePart)) / 86400000;
  if (Math.round(diff) === 0) return "Posted today";
  return `Posted ${Math.round(diff)} days ago`;
}

// L5-T2: pure helper students should add for testability.
// Provided as a stub so the test file can import it — students replace the body.
export function daysAgo(_now: Date | string, _iso: string): string {
  // TODO (Level 5 task 2): replace this stub with a deterministic implementation.
  return formatPostedAt(typeof _iso === "string" ? _iso : String(_iso));
}
