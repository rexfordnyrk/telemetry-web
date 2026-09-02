import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import alerts from "../../store/slices/alertsSlice";
import AlertSettings from "../AlertSettings";

jest.mock("../../layouts/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../services/apiService", () => ({
  alertsAPI: {
    listRules: jest.fn(),
    updateRule: jest.fn(),
    listEvents: jest.fn(),
  },
}));

import { alertsAPI } from "../../services/apiService";

function renderPage() {
  const store = configureStore({ reducer: { alerts } });
  return render(<Provider store={store}><AlertSettings /></Provider>);
}

describe("AlertSettings", () => {
  beforeEach(() => {
    (alertsAPI.listRules as jest.Mock).mockResolvedValue({ data: [
      { rule_type: "device_offline", is_enabled: true, params: { offline_hours: 24 } },
      { rule_type: "usage_spike", is_enabled: true,
        params: { multiplier: 3, floor_bytes: 104857600, lookback_days: 7 } },
    ]});
    (alertsAPI.updateRule as jest.Mock).mockResolvedValue({ ok: true });
    (alertsAPI.listEvents as jest.Mock).mockResolvedValue({ data: [] });
  });

  it("loads and renders both rules on mount", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText(/offline hours/i)).toHaveValue(24);
      expect(screen.getByLabelText(/multiplier/i)).toHaveValue(3);
    });
  });

  it("calls updateRule on Save", async () => {
    renderPage();
    await screen.findByLabelText(/offline hours/i);
    fireEvent.change(screen.getByLabelText(/offline hours/i), { target: { value: "12" } });
    fireEvent.click(screen.getAllByRole("button", { name: /save/i })[0]);
    await waitFor(() => {
      expect(alertsAPI.updateRule).toHaveBeenCalledWith("device_offline",
        expect.objectContaining({ is_enabled: true, params: { offline_hours: 12 } }));
    });
  });
});
