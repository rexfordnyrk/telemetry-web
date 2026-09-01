import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import globalFilters from "../../store/slices/globalFiltersSlice";
import GlobalFilterBar from "../GlobalFilterBar";

function renderBar() {
  const store = configureStore({ reducer: { globalFilters } });
  const utils = render(
    <Provider store={store}>
      <GlobalFilterBar />
    </Provider>
  );
  return { ...utils, store };
}

describe("GlobalFilterBar", () => {
  beforeEach(() => localStorage.clear());

  it("renders four dropdowns", () => {
    renderBar();
    expect(screen.getByLabelText(/programme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organisation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/district/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/period/i)).toBeInTheDocument();
  });

  it("dispatches on selection change", () => {
    const { store } = renderBar();
    act(() => {
      store.dispatch({
        type: "globalFilters/setAvailableValues",
        payload: { programmes: ["All Programmes", "Alpha"] },
      });
    });
    fireEvent.change(screen.getByLabelText(/programme/i), { target: { value: "Alpha" } });
    expect(store.getState().globalFilters.programme).toBe("Alpha");
  });

  it("Clear button resets all dims to sentinels", () => {
    const { store } = renderBar();
    act(() => {
      store.dispatch({ type: "globalFilters/setProgramme", payload: "Alpha" });
    });
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(store.getState().globalFilters.programme).toBe("All Programmes");
  });
});
