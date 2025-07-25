import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
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
  error: string | null;
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
  error: null,
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
      });

    // Handle createUser async thunk
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Add the newly created user to the list
        const newUser = action.payload;
        if (newUser && newUser.id) {
          state.users.push(newUser);
        }
        state.error = null;
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
