import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { handleApiError } from '../../utils/apiUtils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Permission object type
 * Represents a single permission that can be assigned to roles
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Role object type
 * Represents a role that can be assigned to users
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

/**
 * Request types for API calls
 */
export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface AssignPermissionRequest {
  permission_id?: string;
  permission_ids?: string[];
}

export interface RemovePermissionsRequest {
  permission_ids: string[];
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * State type for the roles and permissions slice
 */
interface RolesPermissionsState {
  // Roles
  roles: Role[];
  selectedRole: Role | null;
  rolesTotal: number;
  rolesPage: number;
  rolesLimit: number;
  rolesLoading: boolean;
  roleDetailLoading: boolean;  // Separate loading state for fetching single role
  rolesError: string | null;
  
  // Permissions
  permissions: Permission[];
  permissionsTotal: number;
  permissionsPage: number;
  permissionsLimit: number;
  permissionsLoading: boolean;
  permissionsError: string | null;
  
  // Operation states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  assignLoading: boolean;
}

const initialState: RolesPermissionsState = {
  // Roles
  roles: [],
  selectedRole: null,
  rolesTotal: 0,
  rolesPage: 1,
  rolesLimit: 10,
  rolesLoading: false,
  roleDetailLoading: false,
  rolesError: null,
  
  // Permissions
  permissions: [],
  permissionsTotal: 0,
  permissionsPage: 1,
  permissionsLimit: 100, // Load more permissions by default for selection
  permissionsLoading: false,
  permissionsError: null,
  
  // Operation states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  assignLoading: false,
};

// ============================================================================
// ASYNC THUNKS - ROLES
// ============================================================================

/**
 * Fetch all roles with pagination
 */
export const fetchRoles = createAsyncThunk(
  'rolesPermissions/fetchRoles',
  async (params: { page?: number; limit?: number } = {}, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const { page = 1, limit = 10 } = params;
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.ROLES.LIST}?page=${page}&limit=${limit}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch roles', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { ...data, page, limit };
      
    } catch (error) {
      console.error('Error fetching roles:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch roles'
      );
    }
  }
);

/**
 * Fetch a single role by ID
 */
export const fetchRoleById = createAsyncThunk(
  'rolesPermissions/fetchRoleById',
  async (roleId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.DETAIL(roleId));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch role', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.data || data;
      
    } catch (error) {
      console.error('Error fetching role:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch role'
      );
    }
  }
);

/**
 * Create a new role
 */
export const createRole = createAsyncThunk(
  'rolesPermissions/createRole',
  async (roleData: CreateRoleRequest, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.CREATE);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(roleData),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to create role', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.data || data;
      
    } catch (error) {
      console.error('Error creating role:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create role'
      );
    }
  }
);

/**
 * Update an existing role
 */
export const updateRole = createAsyncThunk(
  'rolesPermissions/updateRole',
  async ({ id, roleData }: { id: string; roleData: UpdateRoleRequest }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.UPDATE(id));
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(roleData),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to update role', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.data || data;
      
    } catch (error) {
      console.error('Error updating role:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update role'
      );
    }
  }
);

/**
 * Delete a role
 */
export const deleteRole = createAsyncThunk(
  'rolesPermissions/deleteRole',
  async (roleId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.DELETE(roleId));
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to delete role', dispatch);
        throw new Error(errorMessage);
      }
      
      return roleId;
      
    } catch (error) {
      console.error('Error deleting role:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete role'
      );
    }
  }
);

// ============================================================================
// ASYNC THUNKS - PERMISSIONS
// ============================================================================

/**
 * Fetch all permissions with pagination
 */
export const fetchPermissions = createAsyncThunk(
  'rolesPermissions/fetchPermissions',
  async (params: { page?: number; limit?: number } = {}, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const { page = 1, limit = 100 } = params;
      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.PERMISSIONS.LIST}?page=${page}&limit=${limit}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch permissions', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { ...data, page, limit };
      
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch permissions'
      );
    }
  }
);

// ============================================================================
// ASYNC THUNKS - ROLE PERMISSIONS
// ============================================================================

/**
 * Assign permission(s) to a role
 */
export const assignPermissionsToRole = createAsyncThunk(
  'rolesPermissions/assignPermissionsToRole',
  async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.ASSIGN_PERMISSIONS(roleId));
      
      const body: AssignPermissionRequest = permissionIds.length === 1
        ? { permission_id: permissionIds[0] }
        : { permission_ids: permissionIds };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to assign permissions', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { roleId, permissionIds, message: data.message };
      
    } catch (error) {
      console.error('Error assigning permissions:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to assign permissions'
      );
    }
  }
);

/**
 * Remove a single permission from a role
 */
export const removePermissionFromRole = createAsyncThunk(
  'rolesPermissions/removePermissionFromRole',
  async ({ roleId, permissionId }: { roleId: string; permissionId: string }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.REMOVE_PERMISSION(roleId, permissionId));
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to remove permission', dispatch);
        throw new Error(errorMessage);
      }
      
      return { roleId, permissionId };
      
    } catch (error) {
      console.error('Error removing permission:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove permission'
      );
    }
  }
);

/**
 * Remove multiple permissions from a role (bulk)
 */
export const removePermissionsFromRole = createAsyncThunk(
  'rolesPermissions/removePermissionsFromRole',
  async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES.REMOVE_PERMISSIONS(roleId));
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ permission_ids: permissionIds }),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to remove permissions', dispatch);
        throw new Error(errorMessage);
      }
      
      return { roleId, permissionIds };
      
    } catch (error) {
      console.error('Error removing permissions:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove permissions'
      );
    }
  }
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const rolesPermissionsSlice = createSlice({
  name: 'rolesPermissions',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    clearRolesError: (state) => {
      state.rolesError = null;
    },
    clearPermissionsError: (state) => {
      state.permissionsError = null;
    },
    setRolesPage: (state, action: PayloadAction<number>) => {
      state.rolesPage = action.payload;
    },
    setRolesLimit: (state, action: PayloadAction<number>) => {
      state.rolesLimit = action.payload;
    },
    // Update local state when permissions change
    updateRolePermissions: (state, action: PayloadAction<{ roleId: string; permissions: Permission[] }>) => {
      const role = state.roles.find(r => r.id === action.payload.roleId);
      if (role) {
        role.permissions = action.payload.permissions;
      }
      if (state.selectedRole && state.selectedRole.id === action.payload.roleId) {
        state.selectedRole.permissions = action.payload.permissions;
      }
    },
  },
  extraReducers: (builder) => {
    // ========== FETCH ROLES ==========
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload.data || [];
        state.rolesTotal = action.payload.total || 0;
        state.rolesPage = action.payload.page || 1;
        state.rolesLimit = action.payload.limit || 10;
        state.rolesError = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload as string || 'Failed to fetch roles';
      });

    // ========== FETCH ROLE BY ID ==========
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.roleDetailLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.roleDetailLoading = false;
        state.selectedRole = action.payload;
        // Also update the role in the roles list if it exists
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.rolesError = null;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.roleDetailLoading = false;
        state.rolesError = action.payload as string || 'Failed to fetch role';
      });

    // ========== CREATE ROLE ==========
    builder
      .addCase(createRole.pending, (state) => {
        state.createLoading = true;
        state.rolesError = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createLoading = false;
        state.roles.push(action.payload);
        state.rolesTotal += 1;
        state.rolesError = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.createLoading = false;
        state.rolesError = action.payload as string || 'Failed to create role';
      });

    // ========== UPDATE ROLE ==========
    builder
      .addCase(updateRole.pending, (state) => {
        state.updateLoading = true;
        state.rolesError = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole && state.selectedRole.id === action.payload.id) {
          state.selectedRole = action.payload;
        }
        state.rolesError = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.updateLoading = false;
        state.rolesError = action.payload as string || 'Failed to update role';
      });

    // ========== DELETE ROLE ==========
    builder
      .addCase(deleteRole.pending, (state) => {
        state.deleteLoading = true;
        state.rolesError = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.roles = state.roles.filter(r => r.id !== action.payload);
        state.rolesTotal -= 1;
        if (state.selectedRole && state.selectedRole.id === action.payload) {
          state.selectedRole = null;
        }
        state.rolesError = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.deleteLoading = false;
        state.rolesError = action.payload as string || 'Failed to delete role';
      });

    // ========== FETCH PERMISSIONS ==========
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.permissions = action.payload.data || [];
        state.permissionsTotal = action.payload.total || 0;
        state.permissionsPage = action.payload.page || 1;
        state.permissionsLimit = action.payload.limit || 100;
        state.permissionsError = null;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload as string || 'Failed to fetch permissions';
      });

    // ========== ASSIGN PERMISSIONS TO ROLE ==========
    builder
      .addCase(assignPermissionsToRole.pending, (state) => {
        state.assignLoading = true;
        state.rolesError = null;
      })
      .addCase(assignPermissionsToRole.fulfilled, (state) => {
        state.assignLoading = false;
        state.rolesError = null;
      })
      .addCase(assignPermissionsToRole.rejected, (state, action) => {
        state.assignLoading = false;
        state.rolesError = action.payload as string || 'Failed to assign permissions';
      });

    // ========== REMOVE PERMISSION FROM ROLE ==========
    builder
      .addCase(removePermissionFromRole.pending, (state) => {
        state.assignLoading = true;
        state.rolesError = null;
      })
      .addCase(removePermissionFromRole.fulfilled, (state) => {
        state.assignLoading = false;
        state.rolesError = null;
      })
      .addCase(removePermissionFromRole.rejected, (state, action) => {
        state.assignLoading = false;
        state.rolesError = action.payload as string || 'Failed to remove permission';
      });

    // ========== REMOVE PERMISSIONS FROM ROLE (BULK) ==========
    builder
      .addCase(removePermissionsFromRole.pending, (state) => {
        state.assignLoading = true;
        state.rolesError = null;
      })
      .addCase(removePermissionsFromRole.fulfilled, (state) => {
        state.assignLoading = false;
        state.rolesError = null;
      })
      .addCase(removePermissionsFromRole.rejected, (state, action) => {
        state.assignLoading = false;
        state.rolesError = action.payload as string || 'Failed to remove permissions';
      });
  },
});

export const {
  setSelectedRole,
  clearRolesError,
  clearPermissionsError,
  setRolesPage,
  setRolesLimit,
  updateRolePermissions,
} = rolesPermissionsSlice.actions;

export default rolesPermissionsSlice.reducer;
