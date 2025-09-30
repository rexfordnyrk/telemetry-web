import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../../config/api";
import { handleApiError } from "../../utils/apiUtils";

export interface Visit {
  id: string;
  cic: string;
  name: string;
  programme: string; // Intervention
  activity: string;
  assisted_by: string | null;
  notes: string;
  check_in: string; // ISO datetime
  check_out: string | null; // ISO datetime or null
  duration_minutes: number | null; // in minutes
  created_at: string;
  updated_at: string;
}

export interface VisitFetchParams {
  cic?: string;
  programme?: string;
  search?: string;
}

interface VisitState {
  visits: Visit[];
  loading: boolean;
  error: string | null;
}

const initialState: VisitState = {
  visits: [],
  loading: false,
  error: null,
};

export const fetchVisits = createAsyncThunk(
  "visits/fetchVisits",
  async (params: VisitFetchParams = {}, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error("No authentication token available");
      }

      // If backend endpoint exists, this will work; otherwise the error handler will surface a friendly error.
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") queryParams.append(k, String(v));
      });
      const url = queryParams.toString()
        ? `/api/v1/cic-visits?${queryParams.toString()}`
        : "/api/v1/cic-visits";

      const response = await fetch(buildApiUrl(url), {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const message = await handleApiError(response, "Failed to fetch CIC visits", dispatch);
        throw new Error(message);
      }

      const data = await response.json();
      const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      return arr as Visit[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch CIC visits");
    }
  }
);

export const checkoutVisit = createAsyncThunk(
  "visits/checkoutVisit",
  async (
    { id, checkoutTime }: { id: string; checkoutTime?: string },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error("No authentication token available");
      }

      const body = {
        check_out: checkoutTime ?? new Date().toISOString(),
      };

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.VISITS.CHECKOUT(id)), {
        method: "POST",
        headers: {
          ...getAuthHeaders(token),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const message = await handleApiError(response, "Failed to checkout visit", dispatch);
        throw new Error(message);
      }

      const data = await response.json();
      const visit = (data?.data ?? data) as Visit;
      return visit;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to checkout visit");
    }
  }
);

const visitSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {
    addVisits: (state, action: PayloadAction<Visit[]>) => {
      const incoming = action.payload;
      const map = new Map<string, Visit>();
      state.visits.forEach((v) => map.set(v.id, v));
      incoming.forEach((v) => map.set(v.id, v));
      state.visits = Array.from(map.values());
    },
    upsertVisit: (state, action: PayloadAction<Visit>) => {
      const v = action.payload;
      const idx = state.visits.findIndex((x) => x.id === v.id);
      if (idx >= 0) state.visits[idx] = v; else state.visits.push(v);
    },
    removeVisit: (state, action: PayloadAction<string>) => {
      state.visits = state.visits.filter((v) => v.id !== action.payload);
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkoutVisit.pending, (state) => {
        state.error = null;
      })
      .addCase(checkoutVisit.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.visits.findIndex((visit) => visit.id === updated.id);
        if (idx >= 0) {
          state.visits[idx] = updated;
        } else {
          state.visits.push(updated);
        }
      })
      .addCase(checkoutVisit.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addVisits, upsertVisit, removeVisit, clearError } = visitSlice.actions;
export default visitSlice.reducer;
