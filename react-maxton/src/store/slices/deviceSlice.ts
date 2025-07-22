import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import { handleApiError } from '../../utils/apiUtils';

// Define the Device type based on the API response structure
export interface Device {
  id: string;
  mac_address: string;
  device_name: string;
  android_version: string;
  app_version: string;
  organization: string;
  programme: string;
  date_enrolled: string;
  current_beneficiary_id?: string | null;
  is_active: boolean;
  current_beneficiary?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    district: string;
    programme: string;
    date_enrolled: string;
    current_device_id?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Define the state shape for devices
interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
};

/**
 * Async thunk to fetch devices from the API.
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }
      const url = buildApiUrl('/api/v1/devices');
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) {
        // Use global error handler for consistent error messages and session handling
        const errorMessage = await handleApiError(response, 'Failed to fetch devices', dispatch);
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
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch devices');
    }
  }
);

// Create the devices slice
const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default deviceSlice.reducer; 