/**
 * Formats a date_enrolled value for display.
 * Returns "—" when the value is null, undefined, or invalid.
 */
export function formatDateEnrolled(d?: string | null): string {
  if (!d) return '—';
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString();
}
