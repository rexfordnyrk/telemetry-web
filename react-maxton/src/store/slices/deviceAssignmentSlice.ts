import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { deviceAssignmentsAPI } from '../../services/apiService';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { handleApiError } from '../../utils/apiUtils';

// Define the DeviceAssignment type based on the API response structure
export interface DeviceAssignment {
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
  // Related data
  device?: {
    id: string;
    device_name: string;
    mac_address: string;
    android_version: string;
    app_version: string;
    organization: string;
    programme: string;
    is_active: boolean;
  };
  beneficiary?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    district: string;
    programme: string;
    is_active: boolean;
  };
}

// Define the comprehensive assignment type from the new API
export interface AssignmentPageData {
  assignment_id: string;
  device_id: string;
  beneficiary_id: string;
  assigned_at: string;
  unassigned_at?: string | null;
  assigned_by: string;
  assignment_notes: string;
  assignment_is_active: boolean;
  assignment_created_at: string;
  assignment_updated_at: string;
  // Device information
  device_name: string;
  mac_address: string;
  android_version: string;
  app_version: string;
  device_organization: string;
  device_programme: string;
  device_date_enrolled: string;
  last_synced: string;
  current_beneficiary_id: string;
  device_is_active: boolean;
  fingerprint: string;
  imei: string;
  serial_number: string;
  device_details: {
    manufacturer: string;
    model: string;
    screen_size: string;
  };
  device_created_at: string;
  device_updated_at: string;
  // Beneficiary information
  beneficiary_name: string;
  beneficiary_email: string;
  beneficiary_phone: string;
  beneficiary_photo: string;
  beneficiary_organization: string;
  beneficiary_district: string;
  beneficiary_programme: string;
  beneficiary_date_enrolled: string;
  current_device_id: string;
  beneficiary_is_active: boolean;
  beneficiary_created_at: string;
  beneficiary_updated_at: string;
}

// Define basic statistics structure
export interface BasicStats {
  total_assignments: number;
  active_assignments: number;
  available_devices: number;
  unassigned_participants: number;
}

// Define pagination structure for the new API
export interface AssignmentPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Define the assignments page response structure
export interface AssignmentsPageResponse {
  basic_stats: BasicStats;
  assignments: AssignmentPageData[];
  pagination: AssignmentPagination;
}

// Define search and filter parameters
export interface AssignmentSearchParams {
  search?: string;
  device_name?: string;
  beneficiary_name?: string;
  organization?: string;
  is_active?: boolean;
  android_version?: string;
  district?: string;
  device_mac_address?: string;
  beneficiary_email?: string;
  notes?: string;
  assigned_after?: string;
  assigned_before?: string;
  page?: number;
  limit?: number;
}

// Define pagination info
export interface PaginationInfo {
  limit: number;
  page: number;
  total: number;
}

// Define the state shape for device assignments
interface DeviceAssignmentState {
  assignments: DeviceAssignment[];
  pageData: AssignmentPageData[];
  basicStats: BasicStats | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  searchParams: AssignmentSearchParams;
  pagination: PaginationInfo | null;
  pagePagination: AssignmentPagination | null;
}

// Initial state
const initialState: DeviceAssignmentState = {
  assignments: [],
  pageData: [],
  basicStats: null,
  loading: false,
  error: null,
  lastFetch: null,
  searchParams: {},
  pagination: null,
  pagePagination: null,
};

// Async thunks for API operations

/**
 * Fetch all device assignments from the API
 * This thunk handles loading all device assignments with their related data
 * This request is authenticated using the JWT token from the auth state.
 */
export const fetchDeviceAssignments = createAsyncThunk(
  'deviceAssignments/fetchDeviceAssignments',
  async (params: AssignmentSearchParams = {}, { getState, rejectWithValue, dispatch }) => {
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
        ? `${API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.LIST}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.LIST;

      const response = await fetch(buildApiUrl(url), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        // Use global error handler for consistent error messages and session handling
        const errorMessage = await handleApiError(response, 'Failed to fetch device assignments', dispatch);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return {
        data: data.data, // Extract data from the response wrapper
        pagination: data.pagination,
        searchParams: params || {}
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch device assignments');
    }
  }
);

/**
 * Fetch device assignments page data from the new API
 * This thunk handles loading assignments with comprehensive data, stats, and pagination
 */
export const fetchAssignmentsPage = createAsyncThunk(
  'deviceAssignments/fetchAssignmentsPage',
  async (params: { page?: number; limit?: number } = {}, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const url = queryParams.toString() 
        ? `${API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.PAGE}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.PAGE;

      const response = await fetch(buildApiUrl(url), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        // Use global error handler for consistent error messages and session handling
        const errorMessage = await handleApiError(response, 'Failed to fetch assignments page data', dispatch);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return {
        data: data.data, // Extract data from the response wrapper
        searchParams: params || {}
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch assignments page data');
    }
  }
);

/**
 * Create a new device assignment
 * This thunk handles assigning a device to a beneficiary
 */
export const createDeviceAssignment = createAsyncThunk(
  'deviceAssignments/createDeviceAssignment',
  async (assignmentData: { deviceId: string; beneficiaryId: string; assignedBy: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await deviceAssignmentsAPI.assignDevice(
        assignmentData.deviceId,
        assignmentData.beneficiaryId,
        assignmentData.assignedBy,
        assignmentData.notes
      );
      return (response as any).data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create device assignment');
    }
  }
);

/**
 * Unassign a device from a beneficiary
 * This thunk handles unassigning a device from its current beneficiary
 */
export const unassignDevice = createAsyncThunk(
  'deviceAssignments/unassignDevice',
  async (unassignData: { assignmentId: string; note?: string }, { rejectWithValue }) => {
    try {
      const response = await deviceAssignmentsAPI.unassignDevice(
        unassignData.assignmentId,
        unassignData.note
      );
      return (response as any).data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to unassign device');
    }
  }
);

/**
 * Update an existing device assignment
 * This thunk handles updating assignment details like notes
 */
export const updateDeviceAssignment = createAsyncThunk(
  'deviceAssignments/updateDeviceAssignment',
  async (updateData: { id: string; assignmentData: Partial<DeviceAssignment> }, { rejectWithValue }) => {
    try {
      const response = await deviceAssignmentsAPI.updateAssignment(
        updateData.id,
        updateData.assignmentData
      );
      return (response as any).data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update device assignment');
    }
  }
);

/**
 * Delete a device assignment
 * This thunk handles permanently deleting an assignment record
 */
export const deleteDeviceAssignment = createAsyncThunk(
  'deviceAssignments/deleteDeviceAssignment',
  async (id: string, { rejectWithValue }) => {
    try {
      await deviceAssignmentsAPI.deleteAssignment(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete device assignment');
    }
  }
);

// Create the slice
const deviceAssignmentSlice = createSlice({
  name: 'deviceAssignments',
  initialState,
  reducers: {
    // Clear any existing errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear all assignments (useful for logout)
    clearAssignments: (state) => {
      state.assignments = [];
      state.lastFetch = null;
      state.searchParams = {};
      state.pagination = null;
    },
    
    // Update search parameters
    updateSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    
    // Clear search parameters
    clearSearchParams: (state) => {
      state.searchParams = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchDeviceAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
        state.pagination = action.payload.pagination;
        state.searchParams = action.payload.searchParams;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchDeviceAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch assignments page
      .addCase(fetchAssignmentsPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsPage.fulfilled, (state, action) => {
        state.loading = false;
        state.pageData = action.payload.data.assignments;
        state.basicStats = action.payload.data.basic_stats;
        state.pagePagination = action.payload.data.pagination;
        state.searchParams = action.payload.searchParams;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchAssignmentsPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create assignment
      .addCase(createDeviceAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeviceAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload);
        state.error = null;
      })
      .addCase(createDeviceAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Unassign device
      .addCase(unassignDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unassignDevice.fulfilled, (state, action) => {
        state.loading = false;
        // Update the assignment in the list
        const index = state.assignments.findIndex(
          assignment => assignment.device_id === action.payload.device_id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(unassignDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update assignment
      .addCase(updateDeviceAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeviceAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(
          assignment => assignment.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDeviceAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete assignment
      .addCase(deleteDeviceAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeviceAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          assignment => assignment.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteDeviceAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, clearAssignments, updateSearchParams, clearSearchParams } = deviceAssignmentSlice.actions;

// Selectors for accessing state
export const selectDeviceAssignments = (state: RootState) => state.deviceAssignments.assignments;
export const selectDeviceAssignmentsLoading = (state: RootState) => state.deviceAssignments.loading;
export const selectDeviceAssignmentsError = (state: RootState) => state.deviceAssignments.error;
export const selectDeviceAssignmentsLastFetch = (state: RootState) => state.deviceAssignments.lastFetch;
export const selectDeviceAssignmentsSearchParams = (state: RootState) => state.deviceAssignments.searchParams;
export const selectDeviceAssignmentsPagination = (state: RootState) => state.deviceAssignments.pagination;

// Selector for active assignments only
export const selectActiveDeviceAssignments = (state: RootState) => 
  state.deviceAssignments.assignments.filter(assignment => assignment.is_active);

// Selector for assignments by device ID
export const selectAssignmentsByDeviceId = (deviceId: string) => (state: RootState) =>
  state.deviceAssignments.assignments.filter(assignment => assignment.device_id === deviceId);

// Selector for assignments by beneficiary ID
export const selectAssignmentsByBeneficiaryId = (beneficiaryId: string) => (state: RootState) =>
  state.deviceAssignments.assignments.filter(assignment => assignment.beneficiary_id === beneficiaryId);

// Selectors for the new assignments page data
export const selectAssignmentsPageData = (state: RootState) => state.deviceAssignments.pageData;
export const selectBasicStats = (state: RootState) => state.deviceAssignments.basicStats;
export const selectPagePagination = (state: RootState) => state.deviceAssignments.pagePagination;

// Selector for active assignments from page data
export const selectActivePageAssignments = (state: RootState) => 
  state.deviceAssignments.pageData.filter(assignment => assignment.assignment_is_active);

export default deviceAssignmentSlice.reducer;
