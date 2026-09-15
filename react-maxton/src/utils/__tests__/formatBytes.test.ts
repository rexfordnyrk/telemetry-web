import { formatMB } from '../formatBytes';

test('formats bytes to MB with 2 decimals', () => {
  expect(formatMB(0)).toBe('0.00 MB');
  expect(formatMB(1048576)).toBe('1.00 MB');
  expect(formatMB(10485760)).toBe('10.00 MB');
  expect(formatMB(1572864)).toBe('1.50 MB');
});

test('handles negative and non-finite input gracefully', () => {
  expect(formatMB(-1024)).toBe('0.00 MB');
  expect(formatMB(Number.NaN)).toBe('0.00 MB');
});
