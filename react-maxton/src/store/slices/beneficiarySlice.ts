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
}

// Define the state shape for beneficiaries
interface BeneficiaryState {
  beneficiaries: Beneficiary[];
  loading: boolean;
  error: string | null;
}

const initialState: BeneficiaryState = {
  beneficiaries: [],
  loading: false,
  error: null,
};

/**
 * Async thunk to fetch beneficiaries from the API.
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchBeneficiaries = createAsyncThunk(
  'beneficiaries/fetchBeneficiaries',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }
      const url = buildApiUrl('/api/v1/beneficiaries');
      const response = await fetch(url, {
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

// Create the beneficiaries slice
const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default beneficiarySlice.reducer; 