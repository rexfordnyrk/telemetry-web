/**
 * Authentication Redux Slice
 * 
 * This slice manages all authentication-related state including:
 * - User login/logout
 * - Token management
 * - Authentication status
 * - Loading states and error handling
 * 
 * It uses Redux Toolkit's createSlice and createAsyncThunk for efficient state management.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../../config/api";
import { logJWTClaims, decodeJWT } from "../../utils/jwtUtils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface for login credentials
 * Used when making login API requests
 */
export interface LoginCredentials {
  username: string;  // User's email or username
  password: string;  // User's password
}

/**
 * Interface for the response from the login API
 * This matches what the backend returns after successful authentication
 */
export interface AuthResponse {
  token: string;  // JWT token for authenticated requests
  user?: {        // Optional user data (if provided by API)
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
  };
}

/**
 * Interface for server error responses
 * This matches the error structure returned by the authentication API
 */
export interface ServerError {
  error: string;              // Error code (e.g., "invalid_credentials", "invalid_request", "server_error")
  error_description?: string;  // Optional detailed error description
  Description?: string;        // Alternative field name for error description
}

/**
 * Interface for JWT claims structure
 * This matches the actual JWT token structure from your API
 */
export interface JWTClaims {
  // Standard JWT claims
  iss?: string;        // Issuer
  sub?: string;        // Subject (usually user ID)
  aud?: string | string[]; // Audience
  exp?: number;        // Expiration time
  nbf?: number;        // Not before time
  iat?: number;        // Issued at time
  jti?: string;        // JWT ID
  
  // Custom claims (specific to your application)
  user_id?: string;    // User ID
  username?: string;   // Username
  email?: string;      // User email
  first_name?: string; // User first name
  last_name?: string;  // User last name
  phone?: string;      // User phone number
  photo?: string;      // User profile photo URL
  organization?: string; // User organization
  designation?: string;  // User job designation/title
  status?: string;     // User account status (active, disabled, etc.)
  roles?: string[];    // User roles
  permissions?: string[]; // User permissions
  client_id?: string;  // OAuth2 client ID
  scopes?: string[];   // OAuth2 scopes
  token_type?: string; // Token type (Bearer)
  
  [key: string]: any;  // Allow for additional custom claims
}

/**
 * Interface for user information extracted from JWT
 * This provides a clean structure for user data throughout the app
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  photo?: string;
  organization?: string;
  designation?: string;
  status?: string;
  roles: string[];
  permissions: string[];
  clientId?: string;
  scopes?: string[];
}

/**
 * Interface for the authentication state in Redux store
 * This defines the structure of our auth state
 */
export interface AuthState {
  isAuthenticated: boolean;        // Whether user is logged in
  user: UserInfo | null;           // Current user information from JWT
  token: string | null;            // JWT token for API requests
  loading: boolean;                // Loading state for async operations
  error: string | null;            // Error message if something goes wrong
  initialized: boolean;             // Whether auth state has been initialized from localStorage
  formData: {                      // Form data that persists across re-renders
    email: string;
    password: string;
    rememberMe: boolean;
  };
}

// ============================================================================
// LOCALSTORAGE PERSISTENCE UTILITIES
// ============================================================================

/**
 * Save complete authentication state to localStorage
 * This ensures all auth data persists across page reloads
 * 
 * @param authState - The complete authentication state to save
 */
const saveAuthToStorage = (authState: AuthState) => {
  try {
    const authData = {
      token: authState.token,
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      initialized: authState.initialized,
    };
    localStorage.setItem('auth_state', JSON.stringify(authData));
  } catch (error) {
    console.error('Failed to save auth state to localStorage:', error);
  }
};

/**
 * Load authentication state from localStorage
 * This restores the complete auth state on app startup
 * 
 * @returns The restored authentication state or null if not found
 */
const loadAuthFromStorage = (): Partial<AuthState> | null => {
  try {
    const authData = localStorage.getItem('auth_state');
    if (authData) {
      const parsed = JSON.parse(authData);
      return {
        token: parsed.token || null,
        user: parsed.user || null,
        isAuthenticated: parsed.isAuthenticated || false,
        initialized: parsed.initialized || false,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  return null;
};

/**
 * Clear authentication state from localStorage
 * Used during logout or when clearing invalid tokens
 */
const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('auth_state');
    localStorage.removeItem('auth_token'); // Legacy cleanup
  } catch (error) {
    console.error('Failed to clear auth state from localStorage:', error);
  }
};

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Initial state for the authentication slice
 * This is what the state looks like when the app first loads
 */
const initialState: AuthState = {
  isAuthenticated: false,  // User starts as not authenticated
  user: null,              // No user data initially
  token: null,             // No token initially
  loading: false,          // Not loading initially
  error: null,             // No errors initially
  initialized: false,       // Not initialized initially
  formData: {
    email: '',
    password: '',
    rememberMe: false,
  },
};

// Load persisted auth state from localStorage
const persistedAuth = loadAuthFromStorage();
if (persistedAuth) {
  initialState.token = persistedAuth.token || null;
  initialState.user = persistedAuth.user || null;
  initialState.isAuthenticated = persistedAuth.isAuthenticated || false;
  initialState.initialized = persistedAuth.initialized || false;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Parse server error response and return user-friendly message
 * This function handles different error formats from the server
 * 
 * @param errorData - The error response from the server
 * @returns User-friendly error message
 */
const parseServerError = (errorData: ServerError): string => {
  // Handle different error types with user-friendly messages
  switch (errorData.error) {
    case 'invalid_credentials':
      return errorData.error_description || errorData.Description || 'Invalid username or password. Please check your credentials and try again.';
    
    case 'invalid_request':
      return errorData.Description || errorData.error_description || 'Invalid request format. Please provide username and password.';
    
    case 'server_error':
      return errorData.Description || errorData.error_description || 'Server error occurred. Please try again later.';
    
    default:
      // Return the description if available, otherwise a generic message
      return errorData.error_description || errorData.Description || 'Authentication failed. Please try again.';
  }
};

// ============================================================================
// ASYNC THUNKS (API CALLS)
// ============================================================================

/**
 * Async thunk for user login
 * This handles the API call to authenticate a user
 * 
 * @param credentials - User's login credentials
 * @param rejectWithValue - Function to reject with custom error
 * @returns Promise that resolves to auth response or rejects with error
 */
export const loginUser = createAsyncThunk(
  'auth/login',  // Action type prefix
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Create FormData for login request (as required by the API)
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      // Make the login API request
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',  // Expect JSON response
        },
        body: formData,  // Send as FormData (not JSON)
      });

      // Handle different HTTP status codes
      if (!response.ok) {
        let errorMessage = 'Login failed';
        
        try {
          // Try to parse the error response from server
          const errorData: ServerError = await response.json();
          
          // Parse server error and get user-friendly message
          errorMessage = parseServerError(errorData);
        } catch (parseError) {
          // If we can't parse the error response, use HTTP status-based messages
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input and try again.';
              break;
            case 401:
              errorMessage = 'Invalid username or password. Please check your credentials.';
              break;
            case 500:
              errorMessage = 'Server error occurred. Please try again later.';
              break;
            default:
              errorMessage = `Login failed (${response.status}). Please try again.`;
          }
        }
        
        // Return error without clearing form data - user can see and correct their input
        return rejectWithValue(errorMessage);
      }

      // Only parse and return data on successful response (200)
      // This ensures form data is only cleared on successful login
      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      // Handle network errors or other exceptions
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Network error. Please check your internet connection and try again.');
      }
      
      return rejectWithValue('An unexpected error occurred. Please try again.');
    }
  }
);

/**
 * Async thunk for user logout
 * This handles the API call to logout a user and clears local state
 * 
 * @param _ - Unused parameter (thunk requirement)
 * @param getState - Function to get current Redux state
 * @returns Promise that resolves when logout is complete
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',  // Action type prefix
  async (_, { getState }) => {
    // Get current auth state to access token
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;

    // If we have a token, try to call logout API
    if (token) {
      try {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
          method: 'POST',
          headers: getAuthHeaders(token),  // Include auth token
        });
      } catch (error) {
        // Log error but don't fail logout (user should still be logged out locally)
        console.error('Logout API call failed:', error);
      }
    }
    // Note: We don't return anything because we always want to clear local state
  }
);

// ============================================================================
// REDUX SLICE
// ============================================================================

/**
 * Authentication slice using Redux Toolkit's createSlice
 * This creates actions and reducers for managing auth state
 */
const authSlice = createSlice({
  name: 'auth',  // Slice name for debugging
  initialState,
  reducers: {
    /**
     * Clear any authentication errors
     * Useful for clearing error messages when user starts new action
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Update form data
     * Used to persist form data across component re-renders
     * 
     * @param state - Current auth state
     * @param action - Payload containing form field updates
     */
    updateFormData: (state, action: PayloadAction<Partial<AuthState['formData']>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    
    /**
     * Clear form data
     * Used when user successfully logs in or manually clears the form
     */
    clearFormData: (state) => {
      state.formData = {
        email: '',
        password: '',
        rememberMe: false,
      };
    },
    
    /**
     * Set authentication token manually
     * Used when restoring token from localStorage on app startup
     * 
     * @param state - Current auth state
     * @param action - Payload containing the token
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.initialized = true; // Mark as initialized
      
      // Extract user information from JWT claims
      const claims = decodeJWT(action.payload);
      if (claims) {
        state.user = {
          id: claims.user_id || claims.sub || '',
          username: claims.username || '',
          email: claims.email || '',
          firstName: claims.first_name || '',
          lastName: claims.last_name || '',
          fullName: `${claims.first_name || ''} ${claims.last_name || ''}`.trim(),
          phone: claims.phone,
          photo: claims.photo,
          organization: claims.organization,
          designation: claims.designation,
          status: claims.status,
          roles: claims.roles || [],
          permissions: claims.permissions || [],
          clientId: claims.client_id,
          scopes: claims.scopes,
        };
      } else {
        state.user = null;
      }
      
      // Save complete auth state to localStorage
      saveAuthToStorage(state);
    },

    /**
     * Mark authentication state as initialized
     * Used when auth initialization is complete
     * 
     * @param state - Current auth state
     */
    setInitialized: (state) => {
      state.initialized = true;
      // Save complete auth state to localStorage
      saveAuthToStorage(state);
    },
    
    /**
     * Clear authentication state
     * Used for logout and clearing invalid tokens
     * 
     * @param state - Current auth state
     */
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.initialized = true; // Mark as initialized even when clearing
      state.formData = {
        email: '',
        password: '',
        rememberMe: false,
      };
      // Clear auth state from localStorage
      clearAuthFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== LOGIN ACTIONS =====
      .addCase(loginUser.pending, (state) => {
        // User is attempting to log in
        state.loading = true;
        state.error = null;  // Clear any previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // Login was successful
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        
        // Extract user information from JWT claims
        const claims = decodeJWT(action.payload.token);
        if (claims) {
          state.user = {
            id: claims.user_id || claims.sub || '',
            username: claims.username || '',
            email: claims.email || '',
            firstName: claims.first_name || '',
            lastName: claims.last_name || '',
            fullName: `${claims.first_name || ''} ${claims.last_name || ''}`.trim(),
            phone: claims.phone,
            photo: claims.photo,
            organization: claims.organization,
            designation: claims.designation,
            status: claims.status,
            roles: claims.roles || [],
            permissions: claims.permissions || [],
            clientId: claims.client_id,
            scopes: claims.scopes,
          };
        } else {
          state.user = null;
        }
        
        state.error = null;
        // Clear form data only on successful login
        state.formData = {
          email: '',
          password: '',
          rememberMe: false,
        };
        
        // Save complete auth state to localStorage
        saveAuthToStorage(state);
        
        // Log the JWT token and its claims for debugging
        console.log('=== LOGIN SUCCESSFUL ===');
        console.log('Full JWT Token:', action.payload.token);
        logJWTClaims(action.payload.token, 'Login JWT Claims');
        console.log('Extracted User Info:', state.user);
        console.log('=== END LOGIN SUCCESS ===');
      })
      .addCase(loginUser.rejected, (state, action) => {
        // Login failed
        state.loading = false;
        state.error = action.payload as string;  // Set error message
      })
      
      // ===== LOGOUT ACTIONS =====
      .addCase(logoutUser.fulfilled, (state) => {
        // Logout was successful (or API call failed but we still logout locally)
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('auth_token');  // Remove token
      });
  },
});

// Export actions for use in components
export const { clearError, updateFormData, clearFormData, setToken, clearAuth, setInitialized } = authSlice.actions;

// Export the reducer for use in store configuration
export default authSlice.reducer; 