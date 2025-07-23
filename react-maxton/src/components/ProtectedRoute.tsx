/**
 * ProtectedRoute Component
 * 
 * This component acts as a wrapper that protects routes requiring authentication.
 * It checks if the user is authenticated and either renders the protected content
 * or redirects to the login page.
 * 
 * How it works:
 * 1. Checks authentication status from Redux store
 * 2. Shows loading spinner while checking
 * 3. Redirects to login if not authenticated
 * 4. Renders children if authenticated
 * 
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../store';

/**
 * Props interface for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;    // The component to render if authenticated
  redirectTo?: string;          // Where to redirect if not authenticated (default: /login)
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * 
 * @param children - The component(s) to render if user is authenticated
 * @param redirectTo - Optional path to redirect to if not authenticated
 * @returns Either the protected content or a redirect component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login'  // Default redirect path
}) => {
  // Get authentication state from Redux store
  const { isAuthenticated, loading, initialized } = useSelector((state: RootState) => state.auth);
  
  // Get current location for redirect state
  const location = useLocation();

  // ============================================================================
  // INITIALIZATION CHECK
  // ============================================================================
  
  // Show loading spinner while auth state is being initialized
  // This prevents premature redirects before localStorage is checked
  if (!initialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Initializing...</span>
        </div>
        <div className="ms-3">
          <small className="text-muted">Initializing authentication...</small>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  
  // Show loading spinner while checking authentication status
  // This prevents flashing of content during authentication checks
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATION CHECK
  // ============================================================================
  
  // If user is not authenticated, redirect to login page
  // The 'replace' prop replaces the current entry in history instead of adding a new one
  // This prevents users from going "back" to a protected page after login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // ============================================================================
  // RENDER PROTECTED CONTENT
  // ============================================================================
  
  // If user is authenticated, render the protected content
  // The children prop contains the component(s) that should be rendered
  return <>{children}</>;
};

export default ProtectedRoute; 