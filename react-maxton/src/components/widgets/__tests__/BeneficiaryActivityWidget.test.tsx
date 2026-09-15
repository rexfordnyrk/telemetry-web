import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import globalFilters from "../../../store/slices/globalFiltersSlice";
import { BeneficiaryActivityTable } from "../BeneficiaryActivityWidget";
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

// Minimal stub matching the shape the widget reads (state.auth.token).
const auth = (state = { token: "test-token" }, _action: any) => state;

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { globalFilters, auth } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("BeneficiaryActivityWidget — null field rendering", () => {
  it("renders em-dash for null last_synced_at", () => {
    renderWithStore(
      <BeneficiaryActivityWidget
        rows={[{ ...baseRow, last_synced_at: null, most_used_app: null }]}
      />
    );
    // Two em-dash cells expected: last synced + most used app
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("renders app name and package when most_used_app is present", () => {
    renderWithStore(
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
    const { container } = renderWithStore(
      <BeneficiaryActivityWidget
        rows={[{ ...baseRow, last_synced_at: null, most_used_app: null }]}
      />
    );
    container.querySelectorAll("td").forEach((td) => {
      expect(td.textContent?.trim()).not.toBe("");
    });
  });

  it("renders empty-state message when rows is an empty array", () => {
    renderWithStore(
      <BeneficiaryActivityWidget
        rows={[]}
      />
    );
    expect(screen.getByText("No beneficiary activity in this period.")).toBeInTheDocument();
  });
});

describe("BeneficiaryActivityWidget — modal and column picker", () => {
  beforeEach(() => localStorage.clear());

  it("View Details opens the detail modal", async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { widgets: { beneficiary_activity_rows: [] } } }) } as any);
    renderWithStore(<BeneficiaryActivityTable rows={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /more_vert|options/i }));
    fireEvent.click(screen.getByText('View Details'));
    expect(await screen.findByText(/full details/i)).toBeInTheDocument();
  });

  it("unchecking a column via Settings hides its header on next render", () => {
    localStorage.setItem('widget:beneficiary-activity:columns', JSON.stringify(['name', 'last_synced']));
    renderWithStore(<BeneficiaryActivityTable rows={[]} />);
    expect(screen.queryByText('Most Used App')).toBeNull();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Last Synced')).toBeInTheDocument();
  });
});
