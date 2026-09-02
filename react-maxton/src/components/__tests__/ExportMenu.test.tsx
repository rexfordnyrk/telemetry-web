import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import globalFilters from "../../store/slices/globalFiltersSlice";
import ExportMenu from "../ExportMenu";

jest.mock("../../utils/downloadCsv", () => ({ downloadCsv: jest.fn() }));

describe("ExportMenu", () => {
  it("renders four dataset items", () => {
    const store = configureStore({ reducer: { globalFilters } });
    render(<Provider store={store}><ExportMenu /></Provider>);
    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    expect(screen.getByText(/dashboard summary/i)).toBeInTheDocument();
    expect(screen.getByText(/beneficiary activity/i)).toBeInTheDocument();
    expect(screen.getByText(/app usage/i)).toBeInTheDocument();
    expect(screen.getByText(/programme breakdown/i)).toBeInTheDocument();
  });

  it("passes global filter params to downloadCsv", () => {
    const { downloadCsv } = require("../../utils/downloadCsv");
    const store = configureStore({ reducer: { globalFilters } });
    store.dispatch({ type: "globalFilters/setProgramme", payload: "Alpha" });
    render(<Provider store={store}><ExportMenu /></Provider>);
    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    fireEvent.click(screen.getByText(/beneficiary activity/i));
    expect(downloadCsv).toHaveBeenCalledWith(
      "/analytics/export/beneficiary-activity.csv",
      expect.any(URLSearchParams),
    );
    const call = (downloadCsv as jest.Mock).mock.calls[0];
    expect(call[1].get("programme")).toBe("Alpha");
  });
});
