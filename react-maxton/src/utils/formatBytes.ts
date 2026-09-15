export function formatMB(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0.00 MB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}
