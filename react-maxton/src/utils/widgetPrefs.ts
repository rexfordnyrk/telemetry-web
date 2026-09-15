export interface WidgetPrefs {
  visibleColumns: string[];
  rowsPerPage: number;
}

const colsKey = (widgetId: string) => `widget:${widgetId}:columns`;
const rppKey  = (widgetId: string) => `widget:${widgetId}:rowsPerPage`;

export function loadPrefs(widgetId: string, defaults: WidgetPrefs): WidgetPrefs {
  let visibleColumns = defaults.visibleColumns;
  let rowsPerPage = defaults.rowsPerPage;
  try {
    const raw = localStorage.getItem(colsKey(widgetId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string')) {
        visibleColumns = parsed;
      }
    }
  } catch { /* fall back */ }
  try {
    const raw = localStorage.getItem(rppKey(widgetId));
    if (raw) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) rowsPerPage = n;
    }
  } catch { /* fall back */ }
  return { visibleColumns, rowsPerPage };
}

export function savePrefs(widgetId: string, prefs: WidgetPrefs): void {
  try {
    localStorage.setItem(colsKey(widgetId), JSON.stringify(prefs.visibleColumns));
    localStorage.setItem(rppKey(widgetId), String(prefs.rowsPerPage));
  } catch { /* storage disabled */ }
}
