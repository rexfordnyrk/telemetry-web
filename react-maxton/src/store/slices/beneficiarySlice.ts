import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import { handleApiError } from '../../utils/apiUtils';

// Define the Beneficiary type (adjust fields as needed)
export interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  district: string;
  programme: string;
  date_enrolled: string;
  is_active: boolean;
  current_device_id?: string | null;
  current_device?: {
    id: string;
    device_name: string;
    android_version: string;
    app_version: string;
  } | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Optional performance metrics for the beneficiary details page
  performance_metrics?: {
    surveys_completed?: number;
    training_sessions_attended?: number;
    avg_app_usage_hours?: number;
    compliance_rate?: number;
  };
  // Optional participation history for the beneficiary details page
  participation_history?: Array<{
    date: string;
    activity: string;
    status: string;
  }>;
}

// Define parameters interface for beneficiary fetching
export interface BeneficiaryFetchParams {
  is_unassigned?: boolean;
  search?: string;
  organization?: string;
  programme?: string;
  district?: string;
  is_active?: boolean;
}

// Define the state shape for beneficiaries
interface BeneficiaryState {
  beneficiaries: Beneficiary[];
  unassignedBeneficiaries: Beneficiary[];
  loading: boolean;
  unassignedLoading: boolean;
  error: string | null;
  unassignedError: string | null;
  // Single beneficiary state for details page
  loadingSingle: boolean;
  singleError: string | null;
}

const initialState: BeneficiaryState = {
  beneficiaries: [],
  unassignedBeneficiaries: [],
  loading: false,
  unassignedLoading: false,
  error: null,
  unassignedError: null,
  loadingSingle: false,
  singleError: null,
};

/**
 * Async thunk to fetch a single beneficiary by ID from the API.
 * This will check the store first, and if not found, fetch from API.
 */
export const fetchBeneficiaryById = createAsyncThunk(
  'beneficiaries/fetchBeneficiaryById',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Check if beneficiary already exists in store
      const beneficiariesState = state.beneficiaries;
      if (beneficiariesState && beneficiariesState.beneficiaries && Array.isArray(beneficiariesState.beneficiaries)) {
        const existingBeneficiary = beneficiariesState.beneficiaries.find(b => b && b.id === id);
        if (existingBeneficiary) {
          return existingBeneficiary;
        }
      }

      // Fetch from API if not in store
      const url = buildApiUrl(`/api/v1/beneficiaries/${id}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Beneficiary not found');
        }
        const errorMessage = await handleApiError(response, 'Failed to fetch beneficiary', dispatch);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Return the beneficiary data (API returns object with 'data' property)
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch beneficiary');
    }
  }
);

/**
 * Async thunk to fetch beneficiaries from the API.
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchBeneficiaries',
  async (params: BeneficiaryFetchParams = {}, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const url = queryParams.toString() 
        ? `/api/v1/beneficiaries?${queryParams.toString()}`
        : '/api/v1/beneficiaries';

      const response = await fetch(buildApiUrl(url), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) {
        // Use global error handler for consistent error messages and session handling
        const errorMessage = await handleApiError(response, 'Failed to fetch beneficiaries', dispatch);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // The API returns an object with a 'data' property containing the array
      if (data && Array.isArray(data.data)) {
        return data.data;
      } else {
        // If the response is not as expected, return an empty array
        return [];
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch beneficiaries');
    }
  }
);

/**
 * Async thunk to fetch unassigned beneficiaries from the API.
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchUnassignedBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchUnassignedBeneficiaries',
  async (search: string = '', { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('is_unassigned', 'true');
      if (search) {
        queryParams.append('search', search);
      }
      
      const url = `/api/v1/beneficiaries?${queryParams.toString()}`;

      const response = await fetch(buildApiUrl(url), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) {
        // Use global error handler for consistent error messages and session handling
        const errorMessage = await handleApiError(response, 'Failed to fetch unassigned beneficiaries', dispatch);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // The API returns an object with a 'data' property containing the array
      if (data && Array.isArray(data.data)) {
        return data.data;
      } else {
        // If the response is not as expected, return an empty array
        return [];
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch unassigned beneficiaries');
    }
  }
);

// Create the beneficiaries slice
const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {
    // Clear single beneficiary error
    clearSingleError: (state) => {
      state.singleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all beneficiaries
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetching single beneficiary
      .addCase(fetchBeneficiaryById.pending, (state) => {
        state.loadingSingle = true;
        state.singleError = null;
      })
      .addCase(fetchBeneficiaryById.fulfilled, (state, action) => {
        state.loadingSingle = false;
        // Add or update the beneficiary in the list if not already present
        const existingIndex = state.beneficiaries.findIndex(b => b.id === action.payload.id);
        if (existingIndex >= 0) {
          state.beneficiaries[existingIndex] = action.payload;
        } else {
          state.beneficiaries.push(action.payload);
        }
      })
      .addCase(fetchBeneficiaryById.rejected, (state, action) => {
        state.loadingSingle = false;
        state.singleError = action.payload as string;
      })
      // Handle fetchUnassignedBeneficiaries
      .addCase(fetchUnassignedBeneficiaries.pending, (state) => {
        state.unassignedLoading = true;
        state.unassignedError = null;
      })
      .addCase(fetchUnassignedBeneficiaries.fulfilled, (state, action) => {
        state.unassignedLoading = false;
        state.unassignedBeneficiaries = action.payload;
      })
      .addCase(fetchUnassignedBeneficiaries.rejected, (state, action) => {
        state.unassignedLoading = false;
        state.unassignedError = action.payload as string;
      });
  },
});

export const { clearSingleError } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;
