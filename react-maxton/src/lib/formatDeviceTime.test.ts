import { formatDeviceTime } from './formatDeviceTime';

describe('formatDeviceTime', () => {
  const iso = '2026-09-24T14:00:00Z'; // 14:00 UTC

  it('renders in the device timezone when provided', () => {
    const { display, tooltip } = formatDeviceTime(iso, 'Africa/Accra');
    // Africa/Accra is UTC+0 year-round → 14:00
    expect(display).toContain('14');
    expect(display).toContain(':00');
    expect(tooltip).toContain('Africa/Accra');
  });

  it('shifts hours correctly for a non-zero-offset zone', () => {
    const { display, tooltip } = formatDeviceTime(iso, 'Asia/Kolkata');
    // Asia/Kolkata is UTC+5:30 → 19:30
    expect(display).toContain('19');
    expect(display).toContain(':30');
    expect(tooltip).toContain('Asia/Kolkata');
  });

  it('falls back to UTC when timezone is null', () => {
    const { display, tooltip } = formatDeviceTime(iso, null);
    expect(display).toContain('14');
    expect(tooltip).toContain('UTC');
  });

  it('falls back to UTC when timezone is undefined', () => {
    const { display, tooltip } = formatDeviceTime(iso, undefined);
    expect(display).toContain('14');
    expect(tooltip).toContain('UTC');
  });

  it('falls back to UTC when timezone is an empty string', () => {
    const { display, tooltip } = formatDeviceTime(iso, '');
    expect(display).toContain('14');
    expect(tooltip).toContain('UTC');
  });

  it('falls back to UTC when timezone is not a valid IANA name', () => {
    const { display, tooltip } = formatDeviceTime(iso, 'Not/A_Zone');
    expect(display).toContain('14');
    expect(tooltip).toContain('UTC');
  });

  it('returns an em-dash for empty input', () => {
    const { display } = formatDeviceTime('', 'UTC');
    expect(display).toBe('—');
  });

  it('returns an em-dash for an unparseable timestamp', () => {
    const { display } = formatDeviceTime('not-a-date', 'UTC');
    expect(display).toBe('—');
  });
});
