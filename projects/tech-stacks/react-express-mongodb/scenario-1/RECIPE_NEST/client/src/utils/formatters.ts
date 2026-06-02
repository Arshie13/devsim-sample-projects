export function formatPostedAt(iso: string): string {
  const datePart = iso.split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const diff = (Date.parse(today) - Date.parse(datePart)) / 86400000;
  if (Math.round(diff) === 0) return "Posted today";
  return `Posted ${Math.round(diff)} days ago`;
}

export function daysAgo(_now: Date | string, _iso: string): string {
  return formatPostedAt(typeof _iso === "string" ? _iso : String(_iso));
}
