import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { alertsAPI } from "../../services/apiService";

export interface AlertRule {
  rule_type: string;
  is_enabled: boolean;
  params: any;
  updated_at?: string;
  [key: string]: any;
}

export interface AlertEvent {
  id: string;
  rule_type: string;
  device_id?: string;
  programme?: string;
  fired_at: string;
  delivered_at?: string;
  delivery_error?: string;
  details?: any;
  [key: string]: any;
}

export interface AlertsState {
  rules: AlertRule[];
  events: AlertEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  rules: [],
  events: [],
  loading: false,
  error: null,
};

export const fetchRules = createAsyncThunk<AlertRule[], void, { rejectValue: string }>(
  "alerts/fetchRules",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await alertsAPI.listRules();
      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alert rules"
      );
    }
  }
);

export const fetchEvents = createAsyncThunk<AlertEvent[], number | undefined, { rejectValue: string }>(
  "alerts/fetchEvents",
  async (limit, { rejectWithValue }) => {
    try {
      const response: any = await alertsAPI.listEvents(limit ?? 100);
      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alert events"
      );
    }
  }
);

export const updateRule = createAsyncThunk<
  { ruleType: string; is_enabled: boolean; params: any },
  { ruleType: string; is_enabled: boolean; params: any },
  { rejectValue: string }
>(
  "alerts/updateRule",
  async (payload, { rejectWithValue }) => {
    try {
      await alertsAPI.updateRule(payload.ruleType, {
        is_enabled: payload.is_enabled,
        params: payload.params,
      });
      return payload;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update alert rule"
      );
    }
  }
);

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch alert rules";
      })
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch alert events";
      })
      .addCase(updateRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRule.fulfilled, (state, action) => {
        state.loading = false;
        const { ruleType, is_enabled, params } = action.payload;
        const index = state.rules.findIndex((rule) => rule.rule_type === ruleType);
        if (index >= 0) {
          state.rules[index] = { ...state.rules[index], is_enabled, params };
        } else {
          state.rules.push({ rule_type: ruleType, is_enabled, params });
        }
      })
      .addCase(updateRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to update alert rule";
      });
  },
});

export default alertsSlice.reducer;
