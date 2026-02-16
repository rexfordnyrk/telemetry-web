import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { handleApiError } from '../../utils/apiUtils';

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  organization: string;
  photo?: string;
  status: "active" | "disabled" | "pending";
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  availableRoles: Role[];
  loading: boolean;
  userDetailsLoading: boolean;
  error: string | null;
  assignRoleLoading: boolean;
  removeRoleLoading: boolean;
  adminPasswordLoading: boolean;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  availableRoles: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "admin",
      description: "Administrator role with full permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "manager",
      description: "Manager role with team permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "user",
      description: "Basic user role",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "developer",
      description: "Developer role with coding permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
  ],
  loading: false,
  userDetailsLoading: false,
  error: null,
  assignRoleLoading: false,
  removeRoleLoading: false,
  adminPasswordLoading: false,
};

/**
 * Async thunk for fetching all users from the API
 * 
 * This thunk makes a GET request to /api/v1/users with the Bearer token
 * in the Authorization header for authentication.
 * 
 * Features:
 * - Automatic authentication using stored JWT token
 * - Error handling for network issues and API errors
 * - Loading state management
 * - Proper TypeScript typing
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl('/api/v1/users');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch users', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error fetching users:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch users'
      );
    }
  }
);

/**
 * Async thunk for fetching a single user by ID (e.g. for direct link / refresh on user details page).
 * GET /api/v1/users/:id
 */
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = buildApiUrl(`/api/v1/users/${userId}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch user', dispatch);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // API may return { data: user } or the user object directly
      return data?.data ?? data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user'
      );
    }
  }
);

/**
 * Async thunk for creating a new user
 * 
 * This thunk makes a POST request to /api/v1/users with user data
 * and the Bearer token for authentication.
 */
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User>, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl('/api/v1/users');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to create user', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error creating user:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create user'
      );
    }
  }
);

/**
 * Async thunk for updating an existing user
 * 
 * This thunk makes a PUT request to /api/v1/users/{id} with updated user data
 * and the Bearer token for authentication.
 */
export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(`/api/v1/users/${id}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to update user', dispatch);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error updating user:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update user'
      );
    }
  }
);

/**
 * Async thunk for deleting a user
 * 
 * This thunk makes a DELETE request to /api/v1/users/{id}
 * with the Bearer token for authentication.
 */
export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const url = buildApiUrl(`/api/v1/users/${userId}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to delete user', dispatch);
        throw new Error(errorMessage);
      }
      
      return userId; // Return the deleted user ID
      
    } catch (error) {
      console.error('Error deleting user:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete user'
      );
    }
  }
);

/**
 * Async thunk for assigning a role to a user.
 * POST /api/v1/users/:id/roles with body { role_id }.
 */
export const assignRoleToUser = createAsyncThunk(
  'users/assignRoleToUser',
  async (
    { userId, role }: { userId: string; role: Role },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES.ASSIGN(userId));
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ role_id: role.id }),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(
          response,
          'Failed to assign role to user',
          dispatch
        );
        throw new Error(errorMessage);
      }

      return { userId, role };
    } catch (error) {
      console.error('Error assigning role to user:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to assign role to user'
      );
    }
  }
);

/**
 * Async thunk for removing a role from a user.
 * DELETE /api/v1/users/:id/roles/:role_id.
 */
export const removeRoleFromUser = createAsyncThunk(
  'users/removeRoleFromUser',
  async (
    { userId, roleId }: { userId: string; roleId: string },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = buildApiUrl(
        API_CONFIG.ENDPOINTS.USER_ROLES.REMOVE(userId, roleId)
      );
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(
          response,
          'Failed to remove role from user',
          dispatch
        );
        throw new Error(errorMessage);
      }

      return { userId, roleId };
    } catch (error) {
      console.error('Error removing role from user:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove role from user'
      );
    }
  }
);

/**
 * Async thunk for admin password update.
 * PUT /api/v1/users/:id/admin-password with body { new_password }.
 * Requires create_users permission.
 */
export const adminUpdatePassword = createAsyncThunk(
  'users/adminUpdatePassword',
  async (
    { userId, newPassword }: { userId: string; newPassword: string },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USERS.ADMIN_PASSWORD(userId));
      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(
          response,
          'Failed to update password',
          dispatch
        );
        throw new Error(errorMessage);
      }

      return undefined;
    } catch (error) {
      console.error('Error updating user password:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update password'
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    assignRole: (
      state,
      action: PayloadAction<{ userId: string; role: Role }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user && !user.roles.find((r) => r.id === action.payload.role.id)) {
        user.roles.push(action.payload.role);
      }
    },
    removeRole: (
      state,
      action: PayloadAction<{ userId: string; roleId: string }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user && user.roles.length > 1) {
        user.roles = user.roles.filter((r) => r.id !== action.payload.roleId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUsers async thunk
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          // If response is directly an array of users
          state.users = action.payload;
        } else if (action.payload.data && Array.isArray(action.payload.data)) {
          // If response has a data property containing users array
          state.users = action.payload.data;
        } else if (action.payload.users && Array.isArray(action.payload.users)) {
          // If response has a users property
          state.users = action.payload.users;
        } else {
          // Fallback: try to use the payload as is
          console.warn('Unexpected users API response format:', action.payload);
          state.users = [];
        }
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.userDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        const user = action.payload;
        if (user && user.id) {
          state.selectedUser = user;
          const index = state.users.findIndex((u) => u.id === user.id);
          if (index === -1) {
            state.users.push(user);
          } else {
            state.users[index] = user;
          }
        }
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.error = action.payload as string || 'Failed to fetch user';
      });

    // Handle createUser async thunk
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Do not push the new user here — the UI will refetch via fetchUsers()
        // so the table (DataTables) is destroyed first, avoiding DOM/removeChild errors.
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create user';
      });

    // Handle updateUserAsync async thunk
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user in the list
        const updatedUser = action.payload;
        if (updatedUser && updatedUser.id) {
          const index = state.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        }
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update user';
      });

    // Handle deleteUserAsync async thunk
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted user from the list
        const deletedUserId = action.payload;
        state.users = state.users.filter(user => user.id !== deletedUserId);
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete user';
      });

    // Handle assignRoleToUser async thunk
    builder
      .addCase(assignRoleToUser.pending, (state) => {
        state.assignRoleLoading = true;
        state.error = null;
      })
      .addCase(assignRoleToUser.fulfilled, (state, action) => {
        state.assignRoleLoading = false;
        const { userId, role } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user && !user.roles.find((r) => r.id === role.id)) {
          user.roles.push(role);
        }
        if (state.selectedUser?.id === userId && state.selectedUser.roles && !state.selectedUser.roles.find((r) => r.id === role.id)) {
          state.selectedUser.roles.push(role);
        }
        state.error = null;
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.assignRoleLoading = false;
        state.error = action.payload as string || 'Failed to assign role to user';
      });

    // Handle removeRoleFromUser async thunk
    builder
      .addCase(removeRoleFromUser.pending, (state) => {
        state.removeRoleLoading = true;
        state.error = null;
      })
      .addCase(removeRoleFromUser.fulfilled, (state, action) => {
        state.removeRoleLoading = false;
        const { userId, roleId } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.roles = user.roles.filter((r) => r.id !== roleId);
        }
        if (state.selectedUser?.id === userId && state.selectedUser.roles) {
          state.selectedUser.roles = state.selectedUser.roles.filter((r) => r.id !== roleId);
        }
        state.error = null;
      })
      .addCase(removeRoleFromUser.rejected, (state, action) => {
        state.removeRoleLoading = false;
        state.error = action.payload as string || 'Failed to remove role from user';
      })

    // Handle adminUpdatePassword async thunk
    .addCase(adminUpdatePassword.pending, (state) => {
      state.adminPasswordLoading = true;
      state.error = null;
    })
    .addCase(adminUpdatePassword.fulfilled, (state) => {
      state.adminPasswordLoading = false;
      state.error = null;
    })
    .addCase(adminUpdatePassword.rejected, (state, action) => {
      state.adminPasswordLoading = false;
      state.error = action.payload as string || 'Failed to update password';
    });
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setSelectedUser,
  assignRole,
  removeRole,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
