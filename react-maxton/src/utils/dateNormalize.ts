/** Normalize a date string for API. YYYY-MM-DD → YYYY-MM-DDT00:00:00Z. Empty → null. Already ISO → unchanged. */
export function normalizeDateForApi(input: string | null | undefined): string | null {
  if (input === null || input === undefined) return null;
  const trimmed = String(input).trim();
  if (trimmed === '') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T00:00:00Z`;
  return trimmed; // assume caller passed something parseable (e.g., RFC3339)
}
