import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiService } from "../../services/apiService";
import { API_CONFIG } from "../../config/api";

export interface Visit {
  id: string;
  cic_id: string;
  cic_name: string;
  beneficiary_id: string;
  beneficiary_name: string;
  intervention_id: string | null;
  intervention_name: string | null;
  activity_name: string | null;
  assisted_by: string | null;
  notes: string | null;
  check_in_at: string;
  check_out_at: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

interface VisitApi {
  id: string;
  cic_id: string;
  beneficiary_id: string;
  intervention_id?: string | null;
  activity_name?: string | null;
  assisted_by?: string | null;
  notes?: string | null;
  check_in_at: string;
  check_out_at?: string | null;
  duration?: number | null;
  created_at: string;
  updated_at: string;
  cic?: { id: string; name?: string | null } | null;
  beneficiary?: { id: string; name?: string | null } | null;
  intervention?: { id: string; name?: string | null } | null;
}

interface VisitPagination {
  current_page: number;
  total_pages: number;
  total_records: number;
  limit: number;
}

export interface VisitFetchParams {
  page?: number;
  limit?: number;
  cic_id?: string;
  beneficiary_id?: string;
  intervention_id?: string;
}

export interface CreateVisitPayload {
  cic_id: string;
  beneficiary_id: string;
  intervention_id?: string | null;
  activity_name?: string | null;
  assisted_by?: string | null;
  notes?: string | null;
  check_in_at: string;
}

export interface UpdateVisitPayload {
  intervention_id?: string | null;
  activity_name?: string | null;
  assisted_by?: string | null;
  notes?: string | null;
  check_in_at?: string;
  check_out_at?: string | null;
}

interface VisitState {
  visits: Visit[];
  pagination: VisitPagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: VisitState = {
  visits: [],
  pagination: null,
  loading: false,
  error: null,
};

const mapApiVisit = (apiVisit: VisitApi): Visit => ({
  id: apiVisit.id,
  cic_id: apiVisit.cic_id,
  cic_name: apiVisit.cic?.name ?? "",
  beneficiary_id: apiVisit.beneficiary_id,
  beneficiary_name: apiVisit.beneficiary?.name ?? "",
  intervention_id: apiVisit.intervention_id ?? null,
  intervention_name: apiVisit.intervention?.name ?? null,
  activity_name: apiVisit.activity_name ?? null,
  assisted_by: apiVisit.assisted_by ?? null,
  notes: apiVisit.notes ?? null,
  check_in_at: apiVisit.check_in_at,
  check_out_at: apiVisit.check_out_at ?? null,
  duration_minutes: apiVisit.duration ?? null,
  created_at: apiVisit.created_at,
  updated_at: apiVisit.updated_at,
});

export const fetchVisits = createAsyncThunk(
  "visits/fetchVisits",
  async (params: VisitFetchParams = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, String(value));
        }
      });

      const endpoint = query.toString()
        ? `${API_CONFIG.ENDPOINTS.VISITS.LIST}?${query.toString()}`
        : API_CONFIG.ENDPOINTS.VISITS.LIST;

      const response = await ApiService.get<{ data?: VisitApi[]; pagination?: VisitPagination | null }>(endpoint);
      const data = Array.isArray(response?.data) ? response.data : [];

      return {
        visits: data.map(mapApiVisit),
        pagination: response?.pagination ?? null,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch CIC visits");
    }
  }
);

export const createVisit = createAsyncThunk(
  "visits/createVisit",
  async (payload: CreateVisitPayload, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<{ data?: VisitApi }>(API_CONFIG.ENDPOINTS.VISITS.LIST, payload);
      const visitData = (response?.data ?? response) as VisitApi;
      return mapApiVisit(visitData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create visit");
    }
  }
);

export const updateVisit = createAsyncThunk(
  "visits/updateVisit",
  async (
    { id, payload }: { id: string; payload: UpdateVisitPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.put<{ data?: VisitApi }>(API_CONFIG.ENDPOINTS.VISITS.DETAIL(id), payload);
      const visitData = (response?.data ?? response) as VisitApi;
      return mapApiVisit(visitData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update visit");
    }
  }
);

export const checkoutVisit = createAsyncThunk(
  "visits/checkoutVisit",
  async (
    { id, checkoutTime }: { id: string; checkoutTime?: string },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        check_out_at: checkoutTime ?? new Date().toISOString(),
      };

      const response = await ApiService.put<{ data?: VisitApi }>(API_CONFIG.ENDPOINTS.VISITS.CHECKOUT(id), body);
      const visitData = (response?.data ?? response) as VisitApi;
      return mapApiVisit(visitData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to checkout visit");
    }
  }
);

export const deleteVisit = createAsyncThunk(
  "visits/deleteVisit",
  async (id: string, { rejectWithValue }) => {
    try {
      await ApiService.delete(API_CONFIG.ENDPOINTS.VISITS.DETAIL(id));
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete visit");
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
      state.visits.forEach((visit) => map.set(visit.id, visit));
      incoming.forEach((visit) => map.set(visit.id, visit));
      state.visits = Array.from(map.values());
    },
    upsertVisit: (state, action: PayloadAction<Visit>) => {
      const visit = action.payload;
      const idx = state.visits.findIndex((x) => x.id === visit.id);
      if (idx >= 0) {
        state.visits[idx] = visit;
      } else {
        state.visits.push(visit);
      }
    },
    removeVisit: (state, action: PayloadAction<string>) => {
      state.visits = state.visits.filter((visit) => visit.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload.visits;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVisit.pending, (state) => {
        state.error = null;
      })
      .addCase(createVisit.fulfilled, (state, action) => {
        state.visits = [action.payload, ...state.visits.filter((visit) => visit.id !== action.payload.id)];
      })
      .addCase(createVisit.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateVisit.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.visits.findIndex((visit) => visit.id === updated.id);
        if (idx >= 0) {
          state.visits[idx] = updated;
        } else {
          state.visits.push(updated);
        }
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
      })
      .addCase(deleteVisit.fulfilled, (state, action) => {
        state.visits = state.visits.filter((visit) => visit.id !== action.payload);
      })
      .addCase(deleteVisit.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addVisits, upsertVisit, removeVisit, clearError } = visitSlice.actions;
export default visitSlice.reducer;
