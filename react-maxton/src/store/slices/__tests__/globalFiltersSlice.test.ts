import globalFilters, {
  setProgramme,
  setOrganisation,
  setDistrict,
  resetFilters,
  GlobalFilterState,
  STORAGE_KEY,
} from "../globalFiltersSlice";

describe("globalFiltersSlice", () => {
  beforeEach(() => localStorage.clear());

  it("initialises to sentinels when storage is empty", () => {
    const state = globalFilters(undefined, { type: "@@INIT" });
    expect(state.programme).toBe("All Programmes");
    expect(state.organisation).toBe("All Organisations");
    expect(state.district).toBe("All Districts");
  });

  it("setProgramme writes to storage", () => {
    const next = globalFilters(undefined, setProgramme("Alpha"));
    expect(next.programme).toBe("Alpha");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).programme).toBe("Alpha");
  });

  it("resetFilters restores sentinels", () => {
    let state = globalFilters(undefined, setProgramme("Alpha"));
    state = globalFilters(state, setOrganisation("Org1"));
    state = globalFilters(state, setDistrict("Kumasi"));
    state = globalFilters(state, resetFilters());
    expect(state.programme).toBe("All Programmes");
    expect(state.organisation).toBe("All Organisations");
    expect(state.district).toBe("All Districts");
  });

  it("recovers from malformed storage without throwing", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const state = globalFilters(undefined, { type: "@@INIT" });
    expect(state.programme).toBe("All Programmes");
  });
});
