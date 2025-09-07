import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { deviceAssignmentsAPI } from '../../services/apiService';

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

// Define the state shape for device assignments
interface DeviceAssignmentState {
  assignments: DeviceAssignment[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Initial state
const initialState: DeviceAssignmentState = {
  assignments: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// Async thunks for API operations

/**
 * Fetch all device assignments from the API
 * This thunk handles loading all device assignments with their related data
 */
export const fetchDeviceAssignments = createAsyncThunk(
  'deviceAssignments/fetchDeviceAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceAssignmentsAPI.getAssignments();
      return (response as any).data.data; // Extract data from the response wrapper
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch device assignments');
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
        state.assignments = action.payload;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchDeviceAssignments.rejected, (state, action) => {
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
export const { clearError, clearAssignments } = deviceAssignmentSlice.actions;

// Selectors for accessing state
export const selectDeviceAssignments = (state: RootState) => state.deviceAssignments.assignments;
export const selectDeviceAssignmentsLoading = (state: RootState) => state.deviceAssignments.loading;
export const selectDeviceAssignmentsError = (state: RootState) => state.deviceAssignments.error;
export const selectDeviceAssignmentsLastFetch = (state: RootState) => state.deviceAssignments.lastFetch;

// Selector for active assignments only
export const selectActiveDeviceAssignments = (state: RootState) => 
  state.deviceAssignments.assignments.filter(assignment => assignment.is_active);

// Selector for assignments by device ID
export const selectAssignmentsByDeviceId = (deviceId: string) => (state: RootState) =>
  state.deviceAssignments.assignments.filter(assignment => assignment.device_id === deviceId);

// Selector for assignments by beneficiary ID
export const selectAssignmentsByBeneficiaryId = (beneficiaryId: string) => (state: RootState) =>
  state.deviceAssignments.assignments.filter(assignment => assignment.beneficiary_id === beneficiaryId);

export default deviceAssignmentSlice.reducer;
