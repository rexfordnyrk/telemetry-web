/**
 * Helper for the 2–3 device comparison panel on the Devices list
 * (DEF-042, REQ-DEV-007 — device-level telemetry insights).
 *
 * The backend doesn't yet have a dedicated /devices/compare endpoint,
 * so we fan out three existing per-device requests in parallel and
 * reduce the responses into a single row per device.
 */

import { buildApiUrl, getAuthHeaders } from "../config/api";

export interface DeviceCompareRow {
  deviceId: string;
  deviceName: string;
  lastSynced: string;
  status: string;
  screenTime7d: string;
  topApp: string;
  dataUsage7d: string;
  error?: string;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function formatDurationSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0h 0m";
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${m}m`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

interface FetchOpts {
  // Allow tests to inject a clock so window timing isn't brittle.
  now?: () => number;
}

export async function fetchDeviceCompareRow(
  deviceId: string,
  token: string,
  opts: FetchOpts = {},
): Promise<DeviceCompareRow> {
  const headers = getAuthHeaders(token);
  const now = opts.now ?? (() => Date.now());

  const base: DeviceCompareRow = {
    deviceId,
    deviceName: deviceId,
    lastSynced: "—",
    status: "—",
    screenTime7d: "—",
    topApp: "—",
    dataUsage7d: "—",
  };

  try {
    const deviceRes = await fetch(buildApiUrl(`/api/v1/devices/${deviceId}`), { headers });
    if (!deviceRes.ok) throw new Error("Device fetch failed");
    const deviceJson = await deviceRes.json();
    const device = deviceJson?.data ?? {};
    base.deviceName = device.device_name ?? deviceId;
    base.lastSynced = device.last_synced
      ? new Date(device.last_synced).toLocaleString()
      : "Never";
    base.status = device.is_active ? "Active" : "Retired";

    const end = now();
    const start = end - SEVEN_DAYS_MS;
    const analyticsUrl = buildApiUrl(
      `/api/v1/devices/${deviceId}/usage-analytics?start_time=${start}&end_time=${end}`,
    );
    const analyticsRes = await fetch(analyticsUrl, { headers });
    if (analyticsRes.ok) {
      const analyticsJson = await analyticsRes.json();
      const entries: Array<{
        total_time_in_foreground?: number;
        total_network_bytes?: number;
        app_name?: string;
        package_name?: string;
      }> = analyticsJson?.data?.usage_analytics ?? [];

      const totalForeground = entries.reduce(
        (sum, e) => sum + (e.total_time_in_foreground ?? 0),
        0,
      );
      const totalBytes = entries.reduce(
        (sum, e) => sum + (e.total_network_bytes ?? 0),
        0,
      );
      base.screenTime7d = formatDurationSeconds(totalForeground);
      base.dataUsage7d = formatBytes(totalBytes);
      if (entries.length > 0) {
        const top = [...entries].sort(
          (a, b) => (b.total_time_in_foreground ?? 0) - (a.total_time_in_foreground ?? 0),
        )[0];
        base.topApp = top.app_name || top.package_name || "—";
      }
    } else {
      // Fallback for older deployments: derive top app from
      // device-details' top5_used_apps.
      const detailsRes = await fetch(
        buildApiUrl(`/api/v1/devices/${deviceId}/device-details`),
        { headers },
      );
      if (detailsRes.ok) {
        const detailsJson = await detailsRes.json();
        const top5 = detailsJson?.data?.top5_used_apps ?? [];
        if (top5.length > 0) {
          base.topApp = top5[0].app_name ?? "—";
        }
      }
    }
    return base;
  } catch (e) {
    return {
      ...base,
      error: e instanceof Error ? e.message : "Failed to load",
    };
  }
}
