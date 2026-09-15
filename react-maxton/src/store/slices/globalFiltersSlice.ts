import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PeriodValue, PERIOD_LABELS, valueFromLabel } from "../../types/period";

export const STORAGE_KEY = "dare.globalFilters.v1";

export interface GlobalFilterState {
  programme: string;
  organisation: string;
  district: string;
  period: PeriodValue;
  availableProgrammes: string[];
  availableOrganisations: string[];
  availableDistricts: string[];
}

const SENTINELS = {
  programme: "All Programmes",
  organisation: "All Organisations",
  district: "All Districts",
  period: "today" as PeriodValue,
};

const defaults = (): GlobalFilterState => ({
  ...SENTINELS,
  availableProgrammes: [SENTINELS.programme],
  availableOrganisations: [SENTINELS.organisation],
  availableDistricts: [SENTINELS.district],
});

function migratePeriod(v: unknown): PeriodValue {
  if (typeof v === "string") {
    if (v in PERIOD_LABELS) return v as PeriodValue;
    return valueFromLabel(v);
  }
  if (v && typeof v === "object" && "start" in v && "end" in v) {
    const r = v as { start: unknown; end: unknown };
    if (typeof r.start === "number" && typeof r.end === "number") {
      return { start: r.start, end: r.end };
    }
  }
  return "today";
}

function loadFromStorage(): GlobalFilterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return {
      ...defaults(),
      ...parsed,
      period: migratePeriod(parsed.period),
    };
  } catch {
    return defaults();
  }
}

function saveToStorage(state: GlobalFilterState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      programme: state.programme,
      organisation: state.organisation,
      district: state.district,
      period: state.period,
    }));
  } catch { /* storage disabled */ }
}

const slice = createSlice({
  name: "globalFilters",
  initialState: loadFromStorage(),
  reducers: {
    setProgramme(state, action: PayloadAction<string>) {
      state.programme = action.payload;
      saveToStorage(state);
    },
    setOrganisation(state, action: PayloadAction<string>) {
      state.organisation = action.payload;
      saveToStorage(state);
    },
    setDistrict(state, action: PayloadAction<string>) {
      state.district = action.payload;
      saveToStorage(state);
    },
    setPeriod(state, action: PayloadAction<PeriodValue>) {
      state.period = action.payload;
      saveToStorage(state);
    },
    setAvailableValues(state, action: PayloadAction<{
      programmes?: string[]; organisations?: string[]; districts?: string[];
    }>) {
      if (action.payload.programmes) state.availableProgrammes = action.payload.programmes;
      if (action.payload.organisations) state.availableOrganisations = action.payload.organisations;
      if (action.payload.districts) state.availableDistricts = action.payload.districts;
    },
    resetFilters(state) {
      state.programme = SENTINELS.programme;
      state.organisation = SENTINELS.organisation;
      state.district = SENTINELS.district;
      state.period = SENTINELS.period;
      saveToStorage(state);
    },
  },
});

export const {
  setProgramme,
  setOrganisation,
  setDistrict,
  setPeriod,
  setAvailableValues,
  resetFilters,
} = slice.actions;

export default slice.reducer;
