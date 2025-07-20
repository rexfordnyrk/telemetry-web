/**
 * Global API error handler for authenticated API calls
 * Handles common API errors like 401 session expired
 * 
 * NOTE: This is NOT for auth endpoints (login/logout) which have their own error handling.
 * This is specifically for authenticated API calls that require a valid JWT token.
 * 
 * When a 401 error is received, it checks the specific error message:
 * - "Authorization header is required"
 * - "Invalid authorization header format" 
 * - "Token has been revoked"
 * - "Invalid token"
 * - "Token has expired"
 * - "Invalid token claims"
 * 
 * For all these cases, it:
 * 1. Dispatches sessionExpired action to clear auth state (if dispatch provided)
 * 2. Shows a warning alert to the user (if dispatch provided)
 * 3. Redirects to login page after 2 seconds (if dispatch provided)
 * 4. Returns a user-friendly error message
 * 
 * @param response - The fetch response object
 * @param errorMessage - Default error message if parsing fails
 * @param dispatch - Redux dispatch function (optional, for session expired handling)
 * @returns Parsed error message
 */

// Import types and actions from authSlice
import { ServerError, sessionExpired } from '../store/slices/authSlice';

export const handleApiError = async (
  response: Response, 
  errorMessage: string, 
  dispatch?: any
): Promise<string> => {
  try {
    // Try to parse the error response from server
    const errorData: ServerError = await response.json();
    
    // Check for 401 authentication errors
    if (response.status === 401) {
      const authErrors = [
        "Authorization header is required",
        "Invalid authorization header format", 
        "Token has been revoked",
        "Invalid token",
        "Token has expired",
        "Invalid token claims"
      ];
      
      // Check if this is an authentication-related error
      if (authErrors.includes(errorData.error)) {
        // Handle session expiration/authentication issues
        if (dispatch) {
          // Clear auth state
          dispatch(sessionExpired());
          
          // Show user-friendly message
          alert('Your session has expired. Please log in again.');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        
        // Return user-friendly message
        return 'Your session has expired. Please log in again.';
      }
    }
    
    // For non-401 errors or non-auth 401 errors, return the parsed error message
    return errorData.error || errorMessage;
  } catch (parseError) {
    // If we can't parse the error response, use HTTP status-based messages
    switch (response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found. Please check the URL and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        return `Request failed (${response.status}). Please try again.`;
    }
  }
};

/**
 * Enhanced fetch wrapper with global error handling
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param dispatch - Redux dispatch function (optional)
 * @returns Promise with response data
 */
export const apiFetch = async (
  url: string, 
  options: RequestInit = {},
  dispatch?: any
): Promise<any> => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response, 'API request failed', dispatch);
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    // Re-throw the error for the calling code to handle
    throw error;
  }
}; 