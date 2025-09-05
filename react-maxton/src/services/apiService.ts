/**
 * API Service Module
 * 
 * This module provides a centralized way to make authenticated API requests.
 * It handles token management, request formatting, and error handling.
 * 
 * Features:
 * - Automatic token inclusion in requests
 * - Standardized error handling
 * - Support for different HTTP methods
 * - Form data support for login requests
 * - Type-safe API responses
 * - User-friendly error messages
 * 
 * The service automatically retrieves the authentication token from localStorage
 * and includes it in the Authorization header for authenticated requests.
 */

import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../config/api';

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

/**
 * Interface for server error responses
 * This matches the error structure returned by the API
 */
export interface ServerError {
  error: string;              // Error code
  error_description?: string;  // Optional detailed error description
  Description?: string;        // Alternative field name for error description
}

/**
 * Interface for API error response
 * Contains both HTTP status and parsed error data
 */
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Parse server error response and return user-friendly message
 * This function handles different error formats from the server
 * 
 * @param errorData - The error response from the server
 * @param status - HTTP status code
 * @returns User-friendly error message
 */
const parseServerError = (errorData: ServerError, status: number): string => {
  // If we have structured error data, use it
  if (errorData.error) {
    switch (errorData.error) {
      case 'invalid_credentials':
        return errorData.error_description || errorData.Description || 'Invalid username or password. Please check your credentials and try again.';
      
      case 'invalid_request':
        return errorData.Description || errorData.error_description || 'Invalid request format. Please check your input and try again.';
      
      case 'server_error':
        return errorData.Description || errorData.error_description || 'Server error occurred. Please try again later.';
      
      default:
        // Return the description if available, otherwise a generic message
        return errorData.error_description || errorData.Description || 'Request failed. Please try again.';
    }
  }
  
  // Fallback to HTTP status-based messages
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Authentication required. Please log in again.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'Resource not found. Please check the URL and try again.';
    case 422:
      return 'Validation error. Please check your input and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error occurred. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `Request failed (${status}). Please try again.`;
  }
};

/**
 * Create a standardized API error object
 * 
 * @param response - The fetch response object
 * @param errorData - Optional parsed error data
 * @returns Standardized API error object
 */
const createApiError = async (response: Response, errorData?: ServerError): Promise<ApiError> => {
  let message: string;
  
  if (errorData) {
    message = parseServerError(errorData, response.status);
  } else {
    message = parseServerError({} as ServerError, response.status);
  }
  
  return {
    status: response.status,
    message,
    data: errorData,
  };
};

// ============================================================================
// API SERVICE CLASS
// ============================================================================

/**
 * Main API service class that handles all HTTP requests
 * This class provides methods for making authenticated API calls
 */
export class ApiService {
  /**
   * Get the current authentication token from localStorage
   * This is used to include the token in API request headers
   * 
   * @returns The stored JWT token or undefined if not found
   */
  private static getToken(): string | undefined {
    return localStorage.getItem('auth_token') || undefined;
  }

  /**
   * Make a GET request to the API
   * 
   * @param endpoint - The API endpoint to call (e.g., '/api/v1/users')
   * @returns Promise that resolves to the API response data
   * 
   * Example:
   * const users = await ApiService.get<User[]>('/api/v1/users');
   */
  static async get<T>(endpoint: string): Promise<T> {
    // Get the current authentication token
    const token = this.getToken();
    
    // Make the API request with authentication headers
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'GET',
      headers: getAuthHeaders(token),  // Include auth token if available
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData: ServerError | undefined;
      
      try {
        // Try to parse error response
        errorData = await response.json();
      } catch {
        // If parsing fails, continue with undefined errorData
      }
      
      const apiError = await createApiError(response, errorData);
      throw new Error(apiError.message);
    }

    // Parse and return the JSON response
    return response.json();
  }

  /**
   * Make a POST request to the API
   * 
   * @param endpoint - The API endpoint to call
   * @param data - Optional data to send in the request body
   * @returns Promise that resolves to the API response data
   * 
   * Example:
   * const newUser = await ApiService.post<User>('/api/v1/users', userData);
   */
  static async post<T>(endpoint: string, data?: any): Promise<T> {
    // Get the current authentication token
    const token = this.getToken();
    
    // Make the API request
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      headers: getAuthHeaders(token),  // Include auth token if available
      body: data ? JSON.stringify(data) : undefined,  // Send JSON data if provided
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData: ServerError | undefined;
      
      try {
        // Try to parse error response
        errorData = await response.json();
      } catch {
        // If parsing fails, continue with undefined errorData
      }
      
      const apiError = await createApiError(response, errorData);
      throw new Error(apiError.message);
    }

    // Parse and return the JSON response
    return response.json();
  }

  /**
   * Make a PUT request to the API (for updating resources)
   * 
   * @param endpoint - The API endpoint to call
   * @param data - Data to send in the request body
   * @returns Promise that resolves to the API response data
   * 
   * Example:
   * const updatedUser = await ApiService.put<User>('/api/v1/users/123', userData);
   */
  static async put<T>(endpoint: string, data: any): Promise<T> {
    // Get the current authentication token
    const token = this.getToken();
    
    // Make the API request
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'PUT',
      headers: getAuthHeaders(token),  // Include auth token if available
      body: JSON.stringify(data),      // Send JSON data
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData: ServerError | undefined;
      
      try {
        // Try to parse error response
        errorData = await response.json();
      } catch {
        // If parsing fails, continue with undefined errorData
      }
      
      const apiError = await createApiError(response, errorData);
      throw new Error(apiError.message);
    }

    // Parse and return the JSON response
    return response.json();
  }

  /**
   * Make a DELETE request to the API
   * 
   * @param endpoint - The API endpoint to call
   * @returns Promise that resolves to the API response data
   * 
   * Example:
   * await ApiService.delete('/api/v1/users/123');
   */
  static async delete<T>(endpoint: string): Promise<T> {
    // Get the current authentication token
    const token = this.getToken();
    
    // Make the API request
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'DELETE',
      headers: getAuthHeaders(token),  // Include auth token if available
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData: ServerError | undefined;
      
      try {
        // Try to parse error response
        errorData = await response.json();
      } catch {
        // If parsing fails, continue with undefined errorData
      }
      
      const apiError = await createApiError(response, errorData);
      throw new Error(apiError.message);
    }

    // Parse and return the JSON response
    return response.json();
  }

  /**
   * Make a POST request with FormData (used for login)
   * This is specifically for endpoints that expect form data instead of JSON
   * 
   * @param endpoint - The API endpoint to call
   * @param formData - FormData object to send
   * @returns Promise that resolves to the API response data
   * 
   * Example:
   * const formData = new FormData();
   * formData.append('username', 'user@example.com');
   * formData.append('password', 'password123');
   * const auth = await ApiService.postFormData<AuthResponse>('/api/v1/auth/login', formData);
   */
  static async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    // Make the API request with FormData
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',  // Expect JSON response
        // Note: Don't set Content-Type for FormData (browser sets it automatically)
      },
      body: formData,  // Send as FormData
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData: ServerError | undefined;
      
      try {
        // Try to parse error response
        errorData = await response.json();
      } catch {
        // If parsing fails, continue with undefined errorData
      }
      
      const apiError = await createApiError(response, errorData);
      throw new Error(apiError.message);
    }

    // Parse and return the JSON response
    return response.json();
  }
}

// ============================================================================
// SPECIALIZED API METHODS
// ============================================================================

/**
 * Authentication-specific API methods
 * These methods handle login and logout functionality
 */
export const authAPI = {
  /**
   * Login a user with username/email and password
   * 
   * @param credentials - User's login credentials
   * @returns Promise that resolves to authentication response
   */
  login: (credentials: { username: string; password: string }) => {
    // Create FormData for login request (as required by the API)
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    // Make the login request
    return ApiService.postFormData(API_CONFIG.ENDPOINTS.AUTH.LOGIN, formData);
  },
  
  /**
   * Logout the current user
   * 
   * @returns Promise that resolves when logout is complete
   */
  logout: () => {
    return ApiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  },
};

/**
 * User management API methods
 * These methods handle CRUD operations for users
 */
export const userAPI = {
  /**
   * Get all users
   * 
   * @returns Promise that resolves to list of users
   */
  getUsers: () => {
    return ApiService.get(API_CONFIG.ENDPOINTS.USERS.LIST);
  },
  
  /**
   * Create a new user
   * 
   * @param userData - User data to create
   * @returns Promise that resolves to created user
   */
  createUser: (userData: any) => {
    return ApiService.post(API_CONFIG.ENDPOINTS.USERS.CREATE, userData);
  },
  
  /**
   * Update an existing user
   * 
   * @param id - User ID to update
   * @param userData - Updated user data
   * @returns Promise that resolves to updated user
   */
  updateUser: (id: string, userData: any) => {
    return ApiService.put(API_CONFIG.ENDPOINTS.USERS.UPDATE(id), userData);
  },
  
  /**
   * Delete a user
   * 
   * @param id - User ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  deleteUser: (id: string) => {
    return ApiService.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(id));
  },
};

/**
 * Location analytics API methods
 * These methods handle location-related data retrieval
 */
export const locationAnalyticsAPI = {
  /**
   * Get device location history
   * 
   * @param deviceId - Device ID to get location history for
   * @param limit - Optional limit for number of records (default: 20)
   * @returns Promise that resolves to location history data
   */
  getDeviceLocationHistory: (deviceId: string, limit: number = 20) => {
    return ApiService.get(API_CONFIG.ENDPOINTS.LOCATION_ANALYTICS.DEVICE_HISTORY(deviceId, limit));
  },
};

/**
 * Beneficiary management API methods
 * These methods handle CRUD operations for beneficiaries
 */
export const beneficiariesAPI = {
  getBeneficiaries: () => ApiService.get(API_CONFIG.ENDPOINTS.BENEFICIARIES.LIST),
  getBeneficiary: (id: string) => ApiService.get(API_CONFIG.ENDPOINTS.BENEFICIARIES.UPDATE(id)),
  createBeneficiary: (beneficiaryData: any) => ApiService.post(API_CONFIG.ENDPOINTS.BENEFICIARIES.CREATE, beneficiaryData),
  updateBeneficiary: (id: string, beneficiaryData: any) => ApiService.put(API_CONFIG.ENDPOINTS.BENEFICIARIES.UPDATE(id), beneficiaryData),
  deleteBeneficiary: (id: string) => ApiService.delete(API_CONFIG.ENDPOINTS.BENEFICIARIES.DELETE(id)),
};

/**
 * Device management API methods
 * These methods handle CRUD operations for devices
 */
export const devicesAPI = {
  getDevices: () => ApiService.get(API_CONFIG.ENDPOINTS.DEVICES.LIST),
  getDevice: (id: string) => ApiService.get(API_CONFIG.ENDPOINTS.DEVICES.UPDATE(id)),
  createDevice: (deviceData: any) => ApiService.post(API_CONFIG.ENDPOINTS.DEVICES.CREATE, deviceData),
  updateDevice: (id: string, deviceData: any) => ApiService.put(API_CONFIG.ENDPOINTS.DEVICES.UPDATE(id), deviceData),
  deleteDevice: (id: string) => ApiService.delete(API_CONFIG.ENDPOINTS.DEVICES.DELETE(id)),
};

/**
 * Device assignment API methods
 * These methods handle device assignment operations
 */
export const deviceAssignmentsAPI = {
  getAssignments: () => ApiService.get(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.LIST),
  getAssignment: (id: string) => ApiService.get(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.UPDATE(id)),
  createAssignment: (assignmentData: any) => ApiService.post(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.CREATE, assignmentData),
  updateAssignment: (id: string, assignmentData: any) => ApiService.put(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.UPDATE(id), assignmentData),
  deleteAssignment: (id: string) => ApiService.delete(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.DELETE(id)),
  assignDevice: (deviceId: string, beneficiaryId: string, notes?: string) => 
    ApiService.post(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.ASSIGN, {
      device_id: deviceId,
      beneficiary_id: beneficiaryId,
      notes: notes || ''
    }),
  unassignDevice: (deviceId: string, notes?: string) => 
    ApiService.post(API_CONFIG.ENDPOINTS.DEVICE_ASSIGNMENTS.UNASSIGN, {
      device_id: deviceId,
      notes: notes || ''
    }),
};

/**
 * Analytics API methods
 * These methods handle data analytics and reporting
 */
export const analyticsAPI = {
  getOverviewDashboard: () => ApiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.OVERVIEW),
  getAggregateAnalytics: (period: string) => ApiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.AGGREGATE(period)),
  getDeviceStats: (period: string) => ApiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.DEVICE_STATS(period)),
  getDeviceUsage: (deviceId: string, period: string) => ApiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.DEVICE_USAGE(deviceId, period)),
  getBeneficiaryUsage: (beneficiaryId: string, period: string) => ApiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.BENEFICIARY_USAGE(beneficiaryId, period)),
};
