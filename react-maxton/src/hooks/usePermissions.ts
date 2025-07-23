/**
 * Custom Hook for Permission Management
 * 
 * This hook provides utilities for checking user permissions and roles
 * throughout the application. It uses the JWT claims stored in Redux state.
 * 
 * Features:
 * - Check if user has specific permissions
 * - Check if user has specific roles
 * - Check if user has any of multiple permissions
 * - Check if user has any of multiple roles
 * - Get user's full permission and role lists
 */

import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * Custom hook for checking user permissions and roles
 * 
 * @returns Object with permission checking utilities
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  /**
   * Check if user has a specific permission
   * 
   * @param permission - The permission to check (e.g., "create_users")
   * @returns True if user has the permission, false otherwise
   * 
   * Example:
   * const canCreateUsers = usePermissions().hasPermission('create_users');
   */
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   * 
   * @param permissions - Array of permissions to check
   * @returns True if user has any of the permissions, false otherwise
   * 
   * Example:
   * const canManageUsers = usePermissions().hasAnyPermission(['create_users', 'update_users', 'delete_users']);
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return permissions.some(permission => user.permissions.includes(permission));
  };

  /**
   * Check if user has all of the specified permissions
   * 
   * @param permissions - Array of permissions to check
   * @returns True if user has all of the permissions, false otherwise
   * 
   * Example:
   * const canFullyManageUsers = usePermissions().hasAllPermissions(['create_users', 'read_users', 'update_users', 'delete_users']);
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return permissions.every(permission => user.permissions.includes(permission));
  };

  /**
   * Check if user has a specific role
   * 
   * @param role - The role to check (e.g., "Admin")
   * @returns True if user has the role, false otherwise
   * 
   * Example:
   * const isAdmin = usePermissions().hasRole('Admin');
   */
  const hasRole = (role: string): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return user.roles.includes(role);
  };

  /**
   * Check if user has any of the specified roles
   * 
   * @param roles - Array of roles to check
   * @returns True if user has any of the roles, false otherwise
   * 
   * Example:
   * const isManagerOrAdmin = usePermissions().hasAnyRole(['Manager', 'Admin']);
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return roles.some(role => user.roles.includes(role));
  };

  /**
   * Check if user has all of the specified roles
   * 
   * @param roles - Array of roles to check
   * @returns True if user has all of the roles, false otherwise
   * 
   * Example:
   * const isSuperAdmin = usePermissions().hasAllRoles(['Admin', 'SuperUser']);
   */
  const hasAllRoles = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return roles.every(role => user.roles.includes(role));
  };

  /**
   * Get all user permissions
   * 
   * @returns Array of user permissions or empty array if not authenticated
   */
  const getAllPermissions = (): string[] => {
    if (!isAuthenticated || !user) {
      return [];
    }
    return user.permissions;
  };

  /**
   * Get all user roles
   * 
   * @returns Array of user roles or empty array if not authenticated
   */
  const getAllRoles = (): string[] => {
    if (!isAuthenticated || !user) {
      return [];
    }
    return user.roles;
  };

  /**
   * Check if user has permission for a specific resource action
   * 
   * @param action - The action to perform (e.g., "create", "read", "update", "delete")
   * @param resource - The resource to act on (e.g., "users", "devices", "beneficiaries")
   * @returns True if user has permission for the action on the resource
   * 
   * Example:
   * const canCreateUsers = usePermissions().can('create', 'users');
   * const canReadDevices = usePermissions().can('read', 'devices');
   */
  const can = (action: string, resource: string): boolean => {
    const permission = `${action}_${resource}`;
    return hasPermission(permission);
  };

  return {
    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role checking
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Data access
    getAllPermissions,
    getAllRoles,
    
    // Convenience method
    can,
    
    // User info
    user,
    isAuthenticated,
  };
}; 