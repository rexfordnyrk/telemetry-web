import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import SearchableDropdown from "../SearchableDropdown";

// UAT bug 1: the dropdowns in the assignment modal only filtered the
// in-memory `items` array. The modal pre-loaded just one slice on
// open, so any term outside that slice returned "No results found".
// The new onSearch hook lets the parent re-fetch from the API.
describe("SearchableDropdown — onSearch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  function openMenu() {
    const toggle = screen.getByPlaceholderText("Choose...");
    // The Toggle is read-only — click to open.
    fireEvent.click(toggle);
  }

  it("fires onSearch (debounced) on every keystroke when provided", () => {
    const onSearch = jest.fn();
    render(
      <SearchableDropdown
        items={[]}
        selectedItem={null}
        onSelect={() => {}}
        placeholder="Choose..."
        onSearch={onSearch}
        searchDebounceMs={200}
      />
    );

    openMenu();
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "g" } });
    fireEvent.change(input, { target: { value: "ga" } });
    fireEvent.change(input, { target: { value: "gal" } });
    // Mid-type — no flush yet.
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });
    // Trailing edge: exactly one call with the final term.
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenLastCalledWith("gal");
  });

  it("trims the search term before dispatching", () => {
    const onSearch = jest.fn();
    render(
      <SearchableDropdown
        items={[]}
        selectedItem={null}
        onSelect={() => {}}
        placeholder="Choose..."
        onSearch={onSearch}
        searchDebounceMs={100}
      />
    );
    openMenu();
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "   alice   " },
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onSearch).toHaveBeenLastCalledWith("alice");
  });

  it("falls back to local filtering when onSearch is not provided", () => {
    render(
      <SearchableDropdown
        items={[
          { id: "1", name: "Galaxy", subtitle: "" },
          { id: "2", name: "Pixel", subtitle: "" },
        ]}
        selectedItem={null}
        onSelect={() => {}}
        placeholder="Choose..."
      />
    );
    openMenu();
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Gal" },
    });
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
    expect(screen.queryByText("Pixel")).not.toBeInTheDocument();
  });

  it("mirrors items directly in server-search mode (no local filter)", () => {
    // The parent owns `items` and refreshes it on onSearch; the
    // dropdown must NOT try to filter locally or the parent's
    // server-side matches would get hidden.
    render(
      <SearchableDropdown
        items={[
          { id: "1", name: "Galaxy", subtitle: "" },
          { id: "2", name: "Pixel", subtitle: "" },
        ]}
        selectedItem={null}
        onSelect={() => {}}
        placeholder="Choose..."
        onSearch={jest.fn()}
      />
    );
    openMenu();
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Iphone" },
    });
    // Even though "Iphone" doesn't match Galaxy/Pixel, both stay
    // visible — the parent will replace `items` after the
    // server roundtrip.
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Pixel")).toBeInTheDocument();
  });
});
