import { formatBytes, formatDurationSeconds, fetchDeviceCompareRow } from "../deviceCompare";

jest.mock("../../config/api", () => ({
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ Authorization: "Bearer test-token" }),
}));

describe("formatDurationSeconds", () => {
  it("returns 0h 0m for non-positive input", () => {
    expect(formatDurationSeconds(0)).toBe("0h 0m");
    expect(formatDurationSeconds(-1)).toBe("0h 0m");
    expect(formatDurationSeconds(NaN as unknown as number)).toBe("0h 0m");
  });

  it("rolls minutes into hours correctly", () => {
    expect(formatDurationSeconds(3600)).toBe("1h 0m");
    expect(formatDurationSeconds(5430)).toBe("1h 30m");
    expect(formatDurationSeconds(7325)).toBe("2h 2m");
  });
});

describe("formatBytes", () => {
  it("handles each magnitude", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toBe("2.0 GB");
  });
});

describe("fetchDeviceCompareRow", () => {
  const NOW = 1_700_000_000_000;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns an error row when the device endpoint fails", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 500 }) as any;
    const row = await fetchDeviceCompareRow("dev-1", "token", { now: () => NOW });
    expect(row.deviceId).toBe("dev-1");
    expect(row.error).toBeDefined();
  });

  it("aggregates analytics entries into screen time + top app + data usage", async () => {
    const deviceJson = {
      data: {
        device_name: "Phone A",
        is_active: true,
        last_synced: "2024-01-15T10:30:00Z",
      },
    };
    const analyticsJson = {
      data: {
        usage_analytics: [
          { app_name: "Chrome", total_time_in_foreground: 3600, total_network_bytes: 2 * 1024 * 1024 },
          { app_name: "WhatsApp", total_time_in_foreground: 1800, total_network_bytes: 1024 * 1024 },
        ],
      },
    };
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => deviceJson })
      .mockResolvedValueOnce({ ok: true, json: async () => analyticsJson }) as any;

    const row = await fetchDeviceCompareRow("dev-1", "token", { now: () => NOW });

    expect(row.deviceName).toBe("Phone A");
    expect(row.status).toBe("Active");
    expect(row.screenTime7d).toBe("1h 30m");
    expect(row.topApp).toBe("Chrome");
    expect(row.dataUsage7d).toBe("3.0 MB");

    const calls = (global.fetch as jest.Mock).mock.calls.map((c) => c[0]);
    expect(calls[1]).toContain(`start_time=${NOW - 7 * 24 * 60 * 60 * 1000}`);
    expect(calls[1]).toContain(`end_time=${NOW}`);
  });

  it("falls back to device-details top5_used_apps if usage-analytics 404s", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { device_name: "X", is_active: false } }) })
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { top5_used_apps: [{ app_name: "YouTube" }] } }),
      }) as any;

    const row = await fetchDeviceCompareRow("dev-2", "token", { now: () => NOW });
    expect(row.topApp).toBe("YouTube");
    expect(row.status).toBe("Retired");
  });
});
