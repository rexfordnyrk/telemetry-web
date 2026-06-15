import React from "react";
import { render, screen } from "@testing-library/react";
import DeviceComparePanel from "../DeviceComparePanel";
import type { DeviceCompareRow } from "../../utils/deviceCompare";

function row(overrides: Partial<DeviceCompareRow> = {}): DeviceCompareRow {
  return {
    deviceId: "id",
    deviceName: "Device",
    lastSynced: "—",
    status: "Active",
    screenTime7d: "1h 0m",
    topApp: "Chrome",
    dataUsage7d: "10 MB",
    ...overrides,
  };
}

describe("DeviceComparePanel", () => {
  it("shows a placeholder when no rows are selected and not loading", () => {
    render(<DeviceComparePanel show onHide={() => {}} rows={[]} loading={false} />);
    expect(screen.getByText(/select 2 or 3 devices/i)).toBeInTheDocument();
  });

  it("renders a spinner while loading", () => {
    render(<DeviceComparePanel show onHide={() => {}} rows={[]} loading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders one column per device with metrics", () => {
    render(
      <DeviceComparePanel
        show
        onHide={() => {}}
        rows={[
          row({ deviceId: "1", deviceName: "Phone A", topApp: "Chrome" }),
          row({ deviceId: "2", deviceName: "Phone B", topApp: "WhatsApp" }),
        ]}
        loading={false}
      />,
    );
    expect(screen.getByText("Compare Devices")).toBeInTheDocument();
    expect(screen.getByText("Phone A")).toBeInTheDocument();
    expect(screen.getByText("Phone B")).toBeInTheDocument();
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Last synced")).toBeInTheDocument();
    expect(screen.getByText("Top app")).toBeInTheDocument();
  });

  it("renders per-row error inline instead of metric values", () => {
    render(
      <DeviceComparePanel
        show
        onHide={() => {}}
        rows={[row({ deviceName: "Broken Phone", error: "Device fetch failed" })]}
        loading={false}
      />,
    );
    // Error text appears once per metric row (5 metrics).
    const errors = screen.getAllByText("Device fetch failed");
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });
});
