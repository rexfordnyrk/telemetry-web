import { loadPrefs, savePrefs } from '../widgetPrefs';

beforeEach(() => localStorage.clear());

test('loadPrefs falls back to defaults when storage empty', () => {
  expect(loadPrefs('w1', { visibleColumns: ['a', 'b'], rowsPerPage: 10 }))
    .toEqual({ visibleColumns: ['a', 'b'], rowsPerPage: 10 });
});

test('round-trip', () => {
  savePrefs('w1', { visibleColumns: ['a'], rowsPerPage: 25 });
  expect(loadPrefs('w1', { visibleColumns: ['a', 'b'], rowsPerPage: 10 }))
    .toEqual({ visibleColumns: ['a'], rowsPerPage: 25 });
});

test('malformed columns JSON falls back to defaults for that key', () => {
  localStorage.setItem('widget:w1:columns', 'not-json');
  expect(loadPrefs('w1', { visibleColumns: ['a', 'b'], rowsPerPage: 10 }).visibleColumns)
    .toEqual(['a', 'b']);
});
