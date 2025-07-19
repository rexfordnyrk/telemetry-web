/**
 * AuthInitializer Component
 * 
 * This component handles the initialization of authentication state when the app starts.
 * It checks for existing tokens in localStorage and sets up the initial authentication state.
 * 
 * Key responsibilities:
 * 1. Check for stored authentication token on app startup
 * 2. Validate token and set authentication state
 * 3. Clear invalid or expired tokens
 * 4. Provide a foundation for authentication state management
 * 
 * This component wraps the entire app to ensure authentication state
 * is properly initialized before any other components render.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setToken, clearAuth } from '../store/slices/authSlice';

/**
 * Props interface for AuthInitializer component
 */
interface AuthInitializerProps {
  children: React.ReactNode;  // The app components to render after initialization
}

/**
 * AuthInitializer component that handles authentication state initialization
 * 
 * @param children - The app components to render after auth initialization
 * @returns The app wrapped with authentication initialization logic
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  // ============================================================================
  // INITIALIZATION EFFECT
  // ============================================================================
  
  /**
   * Effect to initialize authentication state on app startup
   * This runs once when the component mounts
   */
  useEffect(() => {
    // Check if there's a stored authentication token in localStorage
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedToken) {
      // If we have a stored token, set it in the Redux store
      // This will mark the user as authenticated
      dispatch(setToken(storedToken));
    } else {
      // If no stored token, clear any stale authentication state
      // This ensures we start with a clean authentication state
      dispatch(clearAuth());
    }
  }, [dispatch]); // Only re-run if dispatch function changes

  // ============================================================================
  // TOKEN VALIDATION EFFECT (OPTIONAL)
  // ============================================================================
  
  /**
   * Effect to validate authentication token
   * This runs whenever the token changes
   * 
   * TODO: Implement token validation logic here
   * You can add API calls to validate the token with your backend
   * If the token is invalid, dispatch clearAuth() to log the user out
   */
  useEffect(() => {
    if (token) {
      // Optional: Validate token with backend
      // This could be a simple API call to check if the token is still valid
      // Example:
      // validateToken(token).catch(() => dispatch(clearAuth()));
      
      // For now, we'll just log that we have a token
      console.log('Token found, user is authenticated');
    }
  }, [token]); // Only re-run if token changes

  // ============================================================================
  // RENDER
  // ============================================================================
  
  // Render the app components after authentication initialization
  // The children prop contains all the app components that need authentication
  return <>{children}</>;
};

export default AuthInitializer; 