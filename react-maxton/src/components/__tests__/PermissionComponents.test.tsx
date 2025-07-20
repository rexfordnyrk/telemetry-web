import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import PermissionRoute from '../PermissionRoute';
import Sidebar from '../Sidebar';
import { navigationData } from '../../utils/navigationData';

// Mock the usePermissions hook
jest.mock('../../hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: jest.fn(),
    hasAnyPermission: jest.fn(),
    hasAllPermissions: jest.fn(),
    hasRole: jest.fn(),
    hasAnyRole: jest.fn(),
    hasAllRoles: jest.fn(),
    getAllPermissions: jest.fn(),
    getAllRoles: jest.fn(),
    can: jest.fn(),
    user: null,
    isAuthenticated: false,
  }),
}));

// Mock the LayoutContext
jest.mock('../../context/LayoutContext', () => ({
  useLayout: () => ({
    sidebarToggled: false,
    setSidebarToggled: jest.fn(),
    theme: 'blue-theme',
    setTheme: jest.fn(),
  }),
}));

/**
 * Test suite for PermissionRoute component
 */
describe('PermissionRoute', () => {
  const createTestStore = (authState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
          formData: {
            email: '',
            password: '',
            rememberMe: false,
          },
          ...authState,
        },
      },
    });
  };

  const renderWithProviders = (component: React.ReactElement, store: any) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  describe('Permission-based access control', () => {
    test('should render children when user has required permission', () => {
      const store = createTestStore({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['Admin'],
          permissions: ['list_users'],
          clientId: 'test-client',
          scopes: ['read', 'write'],
        },
      });

      const { usePermissions } = require('../../hooks/usePermissions');
      usePermissions.mockReturnValue({
        hasPermission: jest.fn().mockReturnValue(true),
        hasAnyPermission: jest.fn().mockReturnValue(true),
        hasAllPermissions: jest.fn().mockReturnValue(true),
        hasRole: jest.fn().mockReturnValue(false),
        hasAnyRole: jest.fn().mockReturnValue(false),
        hasAllRoles: jest.fn().mockReturnValue(false),
        getAllPermissions: jest.fn().mockReturnValue(['list_users']),
        getAllRoles: jest.fn().mockReturnValue(['Admin']),
        can: jest.fn().mockReturnValue(true),
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['Admin'],
          permissions: ['list_users'],
          clientId: 'test-client',
          scopes: ['read', 'write'],
        },
        isAuthenticated: true,
      });

      renderWithProviders(
        <PermissionRoute requiredPermissions={['list_users']}>
          <div data-testid="protected-content">Protected Content</div>
        </PermissionRoute>,
        store
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('should show access denied when user lacks required permission', () => {
      const store = createTestStore({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['User'],
          permissions: ['read_users'],
          clientId: 'test-client',
          scopes: ['read'],
        },
      });

      const { usePermissions } = require('../../hooks/usePermissions');
      usePermissions.mockReturnValue({
        hasPermission: jest.fn().mockReturnValue(false),
        hasAnyPermission: jest.fn().mockReturnValue(false),
        hasAllPermissions: jest.fn().mockReturnValue(false),
        hasRole: jest.fn().mockReturnValue(false),
        hasAnyRole: jest.fn().mockReturnValue(false),
        hasAllRoles: jest.fn().mockReturnValue(false),
        getAllPermissions: jest.fn().mockReturnValue(['read_users']),
        getAllRoles: jest.fn().mockReturnValue(['User']),
        can: jest.fn().mockReturnValue(false),
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['User'],
          permissions: ['read_users'],
          clientId: 'test-client',
          scopes: ['read'],
        },
        isAuthenticated: true,
      });

      renderWithProviders(
        <PermissionRoute requiredPermissions={['list_users']}>
          <div data-testid="protected-content">Protected Content</div>
        </PermissionRoute>,
        store
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText("You don't have permission to access this page.")).toBeInTheDocument();
    });

    test('should show login message when user is not authenticated', () => {
      const store = createTestStore({
        isAuthenticated: false,
        user: null,
      });

      const { usePermissions } = require('../../hooks/usePermissions');
      usePermissions.mockReturnValue({
        hasPermission: jest.fn().mockReturnValue(false),
        hasAnyPermission: jest.fn().mockReturnValue(false),
        hasAllPermissions: jest.fn().mockReturnValue(false),
        hasRole: jest.fn().mockReturnValue(false),
        hasAnyRole: jest.fn().mockReturnValue(false),
        hasAllRoles: jest.fn().mockReturnValue(false),
        getAllPermissions: jest.fn().mockReturnValue([]),
        getAllRoles: jest.fn().mockReturnValue([]),
        can: jest.fn().mockReturnValue(false),
        user: null,
        isAuthenticated: false,
      });

      renderWithProviders(
        <PermissionRoute requiredPermissions={['list_users']}>
          <div data-testid="protected-content">Protected Content</div>
        </PermissionRoute>,
        store
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText('Please log in to access this page.')).toBeInTheDocument();
    });
  });

  describe('Navigation filtering', () => {
    test('should filter navigation items based on permissions', () => {
      const store = createTestStore({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['User'],
          permissions: ['read_users'],
          clientId: 'test-client',
          scopes: ['read'],
        },
      });

      const { usePermissions } = require('../../hooks/usePermissions');
      usePermissions.mockReturnValue({
        hasPermission: jest.fn().mockImplementation((permission) => {
          return permission === 'read_users';
        }),
        hasAnyPermission: jest.fn().mockImplementation((permissions) => {
          return permissions.some((p: string) => p === 'read_users');
        }),
        hasAllPermissions: jest.fn().mockReturnValue(false),
        hasRole: jest.fn().mockReturnValue(false),
        hasAnyRole: jest.fn().mockReturnValue(false),
        hasAllRoles: jest.fn().mockReturnValue(false),
        getAllPermissions: jest.fn().mockReturnValue(['read_users']),
        getAllRoles: jest.fn().mockReturnValue(['User']),
        can: jest.fn().mockReturnValue(false),
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['User'],
          permissions: ['read_users'],
          clientId: 'test-client',
          scopes: ['read'],
        },
        isAuthenticated: true,
      });

      renderWithProviders(<Sidebar />, store);

      // Users menu item should not be visible because user lacks 'list_users' permission
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });

    test('should show navigation items when user has required permissions', () => {
      const store = createTestStore({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['Admin'],
          permissions: ['list_users'],
          clientId: 'test-client',
          scopes: ['read', 'write'],
        },
      });

      const { usePermissions } = require('../../hooks/usePermissions');
      usePermissions.mockReturnValue({
        hasPermission: jest.fn().mockImplementation((permission) => {
          return permission === 'list_users';
        }),
        hasAnyPermission: jest.fn().mockImplementation((permissions) => {
          return permissions.some((p: string) => p === 'list_users');
        }),
        hasAllPermissions: jest.fn().mockReturnValue(false),
        hasRole: jest.fn().mockReturnValue(false),
        hasAnyRole: jest.fn().mockReturnValue(false),
        hasAllRoles: jest.fn().mockReturnValue(false),
        getAllPermissions: jest.fn().mockReturnValue(['list_users']),
        getAllRoles: jest.fn().mockReturnValue(['Admin']),
        can: jest.fn().mockReturnValue(false),
        user: {
          id: '1',
          username: 'test@example.com',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['Admin'],
          permissions: ['list_users'],
          clientId: 'test-client',
          scopes: ['read', 'write'],
        },
        isAuthenticated: true,
      });

      renderWithProviders(<Sidebar />, store);

      // Users menu item should be visible because user has 'list_users' permission
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });
}); 