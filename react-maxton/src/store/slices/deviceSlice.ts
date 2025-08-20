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

// Define the detailed Device interface for device details page
export interface DeviceDetails extends Device {
  // Device specifications
  device_specs?: {
    storage: string;
    ram: string;
    battery: string;
    screen_size: string;
  };
  
  // Device identifiers
  imei?: string;
  serial_number?: string;
  fingerprint?: string;
  
  // Last sync information
  last_synced?: string;
  
  // Installed apps
  installed_apps?: Array<{
    id: string;
    package_name: string;
    app_name: string;
    app_icon: string;
    version: string;
    size: string;
    install_date: string;
    last_updated: string;
    category: string;
  }>;
  
  // App sessions
  app_sessions?: Array<{
    id: string;
    package_name: string;
    app_name: string;
    app_icon: string;
    foreground_time_stamp: number;
    background_time_stamp: number;
    session_time: number;
    session_duration: {
      hours: number;
      minutes: number;
      formatted: string;
    };
    start_activity_class: string;
    end_activity_class: string;
    network_usage: {
      formatted: string;
    };
  }>;
  
  // Screen sessions
  screen_sessions?: Array<{
    id: string;
    screen_on_time_stamp: number;
    screen_off_time_stamp: number;
    session_duration: {
      milliseconds: number;
      hours: number;
      minutes: number;
      formatted: string;
    };
    trigger_source: string;
    created_at: string;
  }>;
  
  // Assignment history
  assignment_history?: Array<{
    id: string;
    device_id: string;
    beneficiary_id: string;
    assigned_at: string;
    unassigned_at?: string | null;
    assigned_by: string;
    notes: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    beneficiary: {
      id: string;
      name: string;
    };
  }>;
  
  // Sync history
  sync_history?: Array<{
    id: string;
    device_id: string;
    sync_type: string;
    status: string;
    records_synced: number;
    sync_duration_ms: number;
    created_at: string;
  }>;
}

// Define the state shape for devices
interface DeviceState {
  devices: Device[];
  deviceDetails: DeviceDetails | null;
  loading: boolean;
  detailsLoading: boolean;
  deleting: boolean;
  error: string | null;
  detailsError: string | null;
  deleteError: string | null;
}

const initialState: DeviceState = {
  devices: [],
  deviceDetails: null,
  loading: false,
  detailsLoading: false,
  deleting: false,
  error: null,
  detailsError: null,
  deleteError: null,
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

/**
 * Async thunk to fetch detailed device information from the API.
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchDeviceDetails = createAsyncThunk(
  'devices/fetchDeviceDetails',
  async (deviceId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }
      const url = buildApiUrl(`/api/v1/devices/${deviceId}/device-details`);
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch device details', dispatch);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // Merge the 'device' object and the rest of the details into a single object
      return { ...data.data.device, ...data.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch device details');
    }
  }
);

/**
 * Async thunk to delete a device from the API.
 * This request is authenticated using the JWT token from the auth state.
 * After successful deletion, the device is removed from the local state.
 */
export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (deviceId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }
      const url = buildApiUrl(`/api/v1/devices/${deviceId}`);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to delete device', dispatch);
        throw new Error(errorMessage);
      }
      // Return the device ID so we can remove it from the store
      return deviceId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete device');
    }
  }
);

// Create the devices slice
const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    // Clear device details when navigating away
    clearDeviceDetails: (state) => {
      state.deviceDetails = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDevices
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
      })
      // Handle fetchDeviceDetails
      .addCase(fetchDeviceDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchDeviceDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.deviceDetails = action.payload;
      })
      .addCase(fetchDeviceDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
      })
      // Handle deleteDevice
      .addCase(deleteDevice.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.deleting = false;
        // Remove the deleted device from the devices array
        state.devices = state.devices.filter(device => device.id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearDeviceDetails } = deviceSlice.actions;
export default deviceSlice.reducer; 