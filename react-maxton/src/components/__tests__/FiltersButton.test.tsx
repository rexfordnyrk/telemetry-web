import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import globalFilters from "../../store/slices/globalFiltersSlice";
import FiltersButton from "../FiltersButton";

function renderButton() {
  const store = configureStore({ reducer: { globalFilters } });
  const utils = render(
    <Provider store={store}>
      <FiltersButton />
    </Provider>,
  );
  return { ...utils, store };
}

describe("FiltersButton", () => {
  beforeEach(() => localStorage.clear());

  it("modal is closed by default; button opens it and shows four dropdowns", () => {
    renderButton();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/period/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/programme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organisation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/district/i)).toBeInTheDocument();
  });

  it("dispatches on selection change", () => {
    const { store } = renderButton();
    act(() => {
      store.dispatch({
        type: "globalFilters/setAvailableValues",
        payload: { programmes: ["All Programmes", "Alpha"] },
      });
    });
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    fireEvent.change(screen.getByLabelText(/programme/i), {
      target: { value: "Alpha" },
    });
    expect(store.getState().globalFilters.programme).toBe("Alpha");
  });

  it("Clear all button resets all dims to sentinels", () => {
    const { store } = renderButton();
    act(() => {
      store.dispatch({ type: "globalFilters/setProgramme", payload: "Alpha" });
    });
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(store.getState().globalFilters.programme).toBe("All Programmes");
  });

  it("shows an active count badge when non-sentinel filters are set", () => {
    const { store } = renderButton();
    act(() => {
      store.dispatch({ type: "globalFilters/setProgramme", payload: "Alpha" });
      store.dispatch({ type: "globalFilters/setDistrict", payload: "Volta" });
    });
    // button re-renders; badge is a child element with the count
    const btn = screen.getByRole("button", { name: /filters/i });
    expect(btn.textContent).toMatch(/2/);
  });
});
