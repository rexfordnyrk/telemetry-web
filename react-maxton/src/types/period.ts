export type PeriodSlug = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year';
export type PeriodRange = { start: number; end: number };
export type PeriodValue = PeriodSlug | PeriodRange;

export const PERIOD_LABELS: Record<PeriodSlug, string> = {
  today: 'Today', yesterday: 'Yesterday', week: 'Last 7 Days',
  month: 'This Month', quarter: 'Last 90 Days', year: 'This Year',
};

const LABEL_TO_SLUG: Record<string, PeriodSlug> = {
  'Today': 'today', 'Yesterday': 'yesterday', 'Last 7 Days': 'week',
  'This Month': 'month', 'Last 90 Days': 'quarter', 'This Year': 'year',
};

export function labelFromValue(v: PeriodValue): string {
  if (typeof v === 'string') return PERIOD_LABELS[v];
  const s = new Date(v.start).toISOString().slice(0, 10);
  const e = new Date(v.end).toISOString().slice(0, 10);
  return `${s} → ${e}`;
}

export function valueFromLabel(label: string): PeriodValue {
  return LABEL_TO_SLUG[label] ?? 'today';
}

export function serializeForApi(v: PeriodValue): string {
  return typeof v === 'string' ? v : `${v.start}:${v.end}`;
}
