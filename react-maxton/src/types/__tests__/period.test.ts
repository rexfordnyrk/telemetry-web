import { serializeForApi, valueFromLabel, labelFromValue } from '../period';

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
