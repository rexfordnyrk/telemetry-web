/**
 * PermissionRoute Component
 * 
 * This component provides permission-based route protection by checking
 * if the user has the required permissions or roles before rendering content.
 * 
 * Features:
 * - Check specific permissions
 * - Check specific roles
 * - Check multiple permissions (any or all)
 * - Check multiple roles (any or all)
 * - Fallback content for unauthorized users
 * - Loading states during permission checks
 * 
 * Usage:
 * <PermissionRoute requiredPermissions={['create_users', 'read_users']}>
 *   <UserManagement />
 * </PermissionRoute>
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Props interface for PermissionRoute component
 */
interface PermissionRouteProps {
  children: React.ReactNode;                    // The component to render if authorized
  requiredPermissions?: string[];                // Required permissions (any of these)
  requiredAllPermissions?: string[];             // Required permissions (all of these)
  requiredRoles?: string[];                      // Required roles (any of these)
  requiredAllRoles?: string[];                   // Required roles (all of these)
  fallback?: React.ReactNode;                   // Content to show if unauthorized
  showFallback?: boolean;                       // Whether to show fallback content
  redirectTo?: string;                          // Redirect path if unauthorized
}

/**
 * PermissionRoute component that checks user permissions before rendering content
 * 
 * @param children - The component(s) to render if user has required permissions
 * @param requiredPermissions - Array of permissions (user needs any of these)
 * @param requiredAllPermissions - Array of permissions (user needs all of these)
 * @param requiredRoles - Array of roles (user needs any of these)
 * @param requiredAllRoles - Array of roles (user needs all of these)
 * @param fallback - Optional content to show if unauthorized
 * @param showFallback - Whether to show fallback content or nothing
 * @param redirectTo - Optional redirect path if unauthorized
 * @returns Either the protected content or fallback content
 */
const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredAllPermissions = [],
  requiredRoles = [],
  requiredAllRoles = [],
  fallback = null,
  showFallback = true,
  redirectTo,
}) => {
  // Get authentication and permission state
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const { hasAnyPermission, hasAllPermissions, hasAnyRole, hasAllRoles } = usePermissions();

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  
  // Show loading spinner while checking authentication
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
  // PERMISSION CHECKING
  // ============================================================================
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return showFallback ? (
      <div className="alert alert-warning" role="alert">
        Please log in to access this page.
      </div>
    ) : null;
  }

  // Check permissions and roles
  let hasAccess = true;

  // Check if user has any of the required permissions
  if (requiredPermissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(requiredPermissions);
  }

  // Check if user has all of the required permissions
  if (requiredAllPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(requiredAllPermissions);
  }

  // Check if user has any of the required roles
  if (requiredRoles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(requiredRoles);
  }

  // Check if user has all of the required roles
  if (requiredAllRoles.length > 0) {
    hasAccess = hasAccess && hasAllRoles(requiredAllRoles);
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  
  if (hasAccess) {
    // User has required permissions/roles, render the protected content
    return <>{children}</>;
  } else {
    // User doesn't have required permissions/roles
    if (showFallback) {
      return fallback ? (
        <>{fallback}</>
      ) : (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          {requiredPermissions.length > 0 && (
            <p><strong>Required permissions:</strong> {requiredPermissions.join(', ')}</p>
          )}
          {requiredRoles.length > 0 && (
            <p><strong>Required roles:</strong> {requiredRoles.join(', ')}</p>
          )}
        </div>
      );
    }
    
    return null;
  }
};

export default PermissionRoute; 