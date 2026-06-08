import { formatDateEnrolled } from '../formatDate';

describe('formatDateEnrolled', () => {
  it('returns "—" for null', () => {
    expect(formatDateEnrolled(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatDateEnrolled(undefined)).toBe('—');
  });

  it('returns "—" for empty string', () => {
    expect(formatDateEnrolled('')).toBe('—');
  });

  it('returns "—" for invalid date string', () => {
    expect(formatDateEnrolled('not-a-date')).toBe('—');
  });

  it('returns formatted date string for valid ISO date', () => {
    const result = formatDateEnrolled('2024-01-15');
    expect(result).not.toBe('—');
    // Should be a non-empty string in locale format
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns formatted date string for valid ISO datetime', () => {
    const result = formatDateEnrolled('2024-06-01T00:00:00Z');
    expect(result).not.toBe('—');
    expect(typeof result).toBe('string');
  });
});
