// §7.8 phase-4 (DEF-466): renders a sync-history timestamp in the device's
// own IANA timezone rather than the browser viewer's local timezone.
//
// Uses the native Intl.DateTimeFormat with the `timeZone` option — no new
// dependency. `date-fns` v4 is present in the project but has no timezone
// plugin, and adding one is out of scope for this fix.

const EN_DASH = '—';

export interface FormattedDeviceTime {
  /** Short human-readable date+time rendered in the resolved timezone. */
  display: string;
  /** "Device time (<Zone>)" — suitable for a title/tooltip attribute. */
  tooltip: string;
}

/**
 * Formats an ISO timestamp in the given IANA timezone.
 *
 * Falls back to UTC when the timezone is missing, empty, or not a zone name
 * Intl.DateTimeFormat recognizes (e.g. an older/malformed value). Never
 * throws — an unparseable timestamp or unsupported zone degrades to an
 * em-dash / UTC rendering instead.
 */
export function formatDeviceTime(
  isoTimestamp: string,
  timezone: string | null | undefined,
): FormattedDeviceTime {
  if (!isoTimestamp) {
    return { display: EN_DASH, tooltip: '' };
  }

  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return { display: EN_DASH, tooltip: '' };
  }

  const zone = timezone && timezone.length > 0 ? timezone : 'UTC';

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  let effectiveZone = zone;
  let display: string;
  try {
    display = new Intl.DateTimeFormat('en-US', {
      ...formatOptions,
      timeZone: zone,
    }).format(date);
  } catch {
    // Unknown/invalid IANA zone name — fall back to UTC rather than
    // letting Intl throw and break the whole table render.
    effectiveZone = 'UTC';
    display = new Intl.DateTimeFormat('en-US', {
      ...formatOptions,
      timeZone: 'UTC',
    }).format(date);
  }

  return {
    display,
    tooltip: `Device time (${effectiveZone})`,
  };
}
