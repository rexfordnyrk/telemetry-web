import { serializeForApi, valueFromLabel, labelFromValue, customRangePayload } from '../period';

test('serializes slugs verbatim', () => {
  expect(serializeForApi('today')).toBe('today');
  expect(serializeForApi('week')).toBe('week');
});

test('serializes custom range as start:end', () => {
  expect(serializeForApi({ start: 1700000000000, end: 1700604800000 }))
    .toBe('1700000000000:1700604800000');
});

test('maps legacy display labels to slugs', () => {
  expect(valueFromLabel('Today')).toBe('today');
  expect(valueFromLabel('Last 7 Days')).toBe('week');
  expect(valueFromLabel('This Month')).toBe('month');
  expect(valueFromLabel('This Year')).toBe('year');
  expect(valueFromLabel('Unknown')).toBe('today');
});

test('labelFromValue returns human label for slug and formatted range for custom', () => {
  expect(labelFromValue('today')).toBe('Today');
  expect(labelFromValue({ start: 1700000000000, end: 1700604800000 }))
    .toMatch(/^\d{4}-\d{2}-\d{2} → \d{4}-\d{2}-\d{2}$/);
});

test('customRangePayload extends end to last ms of day for same-day pick', () => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const date = new Date('2024-11-01T00:00:00Z');
  const payload = customRangePayload(date, date);

  // For same-day pick, end must be > start
  expect(payload.end).toBeGreaterThan(payload.start);

  // Difference should be close to 24 hours minus 1 millisecond
  expect(payload.end - payload.start).toBe(DAY_MS - 1);
});

test('customRangePayload preserves multi-day ranges', () => {
  const start = new Date('2024-11-01T00:00:00Z');
  const end = new Date('2024-11-05T00:00:00Z');
  const payload = customRangePayload(start, end);

  expect(payload.start).toBe(start.getTime());
  expect(payload.end).toBeGreaterThan(payload.start);
  expect(payload.end).toBe(end.getTime() + 24 * 60 * 60 * 1000 - 1);
});
