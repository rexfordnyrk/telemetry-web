/**
 * PublicRoute Component
 * 
 * This component acts as a wrapper for public routes (like login pages).
 * It prevents authenticated users from accessing public pages by redirecting
 * them to the dashboard or another authenticated page.
 * 
 * How it works:
 * 1. Checks authentication status from Redux store
 * 2. Shows loading spinner while checking
 * 3. Redirects authenticated users to dashboard
 * 4. Renders children if not authenticated
 * 
 * Usage:
 * <PublicRoute>
 *   <BasicLogin />
 * </PublicRoute>
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

/**
 * Props interface for PublicRoute component
 */
interface PublicRouteProps {
  children: React.ReactNode;    // The component to render if not authenticated
  redirectTo?: string;          // Where to redirect if authenticated (default: /dashboard)
}

/**
 * PublicRoute component that prevents authenticated users from accessing public pages
 * 
 * @param children - The component(s) to render if user is not authenticated
 * @param redirectTo - Optional path to redirect to if authenticated
 * @returns Either the public content or a redirect component
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard'  // Default redirect path for authenticated users
}) => {
  // Get authentication state from Redux store
  const { isAuthenticated, loading, initialized } = useSelector((state: RootState) => state.auth);

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
  
  // If user is already authenticated, redirect them to dashboard
  // The 'replace' prop replaces the current entry in history instead of adding a new one
  // This prevents users from going "back" to login page after being redirected
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // ============================================================================
  // RENDER PUBLIC CONTENT
  // ============================================================================
  
  // If user is not authenticated, render the public content
  // The children prop contains the component(s) that should be rendered
  return <>{children}</>;
};

export default PublicRoute; 