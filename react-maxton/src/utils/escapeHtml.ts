/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * Handles null/undefined safely by returning empty string.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
