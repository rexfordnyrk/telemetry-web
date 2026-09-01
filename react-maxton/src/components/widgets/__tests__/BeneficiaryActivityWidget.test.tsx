import React from "react";
import { render, screen } from "@testing-library/react";
import BeneficiaryActivityWidget from "../BeneficiaryActivityWidget";

const baseRow = {
  beneficiary_id: "b1",
  name: "Alice",
  device_id: "d1",
  mac_address: "AA:BB:CC:DD:EE:FF",
  programme: "Alpha",
  organisation: "Org1",
  district: "Kumasi",
  total_screentime_ms: 0,
  total_net_usage_bytes: 0,
};

describe("BeneficiaryActivityWidget — null field rendering", () => {
  it("renders em-dash for null last_synced_at", () => {
    render(
      <BeneficiaryActivityWidget
        rows={[{ ...baseRow, last_synced_at: null, most_used_app: null }]}
      />
    );
    // Two em-dash cells expected: last synced + most used app
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("renders app name and package when most_used_app is present", () => {
    render(
      <BeneficiaryActivityWidget
        rows={[{
          ...baseRow,
          last_synced_at: "2026-06-01T12:00:00Z",
          most_used_app: { name: "YouTube", package: "com.google.android.youtube" },
        }]}
      />
    );
    expect(screen.getByText("YouTube")).toBeInTheDocument();
    expect(screen.getByText("com.google.android.youtube")).toBeInTheDocument();
  });

  it("never renders an empty string in a cell", () => {
    const { container } = render(
      <BeneficiaryActivityWidget
        rows={[{ ...baseRow, last_synced_at: null, most_used_app: null }]}
      />
    );
    container.querySelectorAll("td").forEach((td) => {
      expect(td.textContent?.trim()).not.toBe("");
    });
  });

  it("renders empty-state message when rows is an empty array", () => {
    render(
      <BeneficiaryActivityWidget
        rows={[]}
      />
    );
    expect(screen.getByText("No beneficiary activity in this period.")).toBeInTheDocument();
  });
});
