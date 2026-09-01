import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const STORAGE_KEY = "dare.globalFilters.v1";

export interface GlobalFilterState {
  programme: string;
  organisation: string;
  district: string;
  period: string;
  availableProgrammes: string[];
  availableOrganisations: string[];
  availableDistricts: string[];
}

const SENTINELS = {
  programme: "All Programmes",
  organisation: "All Organisations",
  district: "All Districts",
  period: "Today",
};

const defaults = (): GlobalFilterState => ({
  ...SENTINELS,
  availableProgrammes: [SENTINELS.programme],
  availableOrganisations: [SENTINELS.organisation],
  availableDistricts: [SENTINELS.district],
});

function loadFromStorage(): GlobalFilterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return { ...defaults(), ...parsed };
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
    setPeriod(state, action: PayloadAction<string>) {
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
