import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserDetails from '../UserDetails';
import usersReducer from '../../store/slices/userSlice';
import rolesPermissionsReducer from '../../store/slices/rolesPermissionsSlice';
import alertReducer from '../../store/slices/alertSlice';
import authReducer from '../../store/slices/authSlice';
import * as passwordPolicyModule from '../../utils/passwordPolicy';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'user-123' }),
}));

jest.mock('../../hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: (permission: string) =>
      [
        'read_users',
        'view_user_roles',
        'manage_user_roles',
        'update_users',
        'create_users',
      ].includes(permission),
  }),
}));

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const testUser = {
  id: 'user-123',
  email: 'agent@example.com',
  username: 'agent@example.com',
  first_name: 'Field',
  last_name: 'Agent',
  phone: '',
  organization: 'Org',
  designation: 'Agent',
  status: 'active' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  roles: [],
};

const adminRole = {
  id: 'role-admin',
  name: 'Admin',
  description: 'Admin role',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      rolesPermissions: rolesPermissionsReducer,
      alerts: alertReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: null,
        token: 'token',
        refreshToken: null,
        expiresIn: 900,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      },
      users: {
        users: [testUser],
        selectedUser: null,
        availableRoles: [adminRole],
        loading: false,
        createUserLoading: false,
        userDetailsLoading: false,
        error: null,
        assignRoleLoading: false,
        removeRoleLoading: false,
        adminPasswordLoading: false,
      },
      rolesPermissions: {
        roles: [adminRole],
        selectedRole: null,
        rolesTotal: 1,
        rolesPage: 1,
        rolesLimit: 100,
        rolesLoading: false,
        roleDetailLoading: false,
        rolesError: null,
        permissions: [],
        permissionsTotal: 0,
        permissionsPage: 1,
        permissionsLimit: 100,
        permissionsLoading: false,
        permissionsError: null,
        createLoading: false,
        updateLoading: false,
        deleteLoading: false,
        assignLoading: false,
      },
    },
  });

describe('UserDetails send reset link', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    jest.spyOn(passwordPolicyModule, 'fetchPasswordPolicy').mockResolvedValue(
      passwordPolicyModule.DEFAULT_PASSWORD_POLICY,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dispatches success alert when reset link request succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: 'If an account exists for that email, a reset link has been sent.',
      }),
    });

    const store = createStore();
    render(
      <Provider store={store}>
        <UserDetails />
      </Provider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Send Reset Link/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/forgot-password'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: testUser.email }),
        }),
      );
    });

    await waitFor(() => {
      const alerts = store.getState().alerts.alerts;
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('success');
      expect(alerts[0].title).toBe('Reset Link Sent');
    });
  });

  it('dispatches warning alert when reset link request is rate limited', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'too_many_requests',
        error_description: 'Too many password reset requests. Please try again later.',
      }),
    });

    const store = createStore();
    render(
      <Provider store={store}>
        <UserDetails />
      </Provider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Send Reset Link/i }));

    await waitFor(() => {
      const alerts = store.getState().alerts.alerts;
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('warning');
      expect(alerts[0].title).toBe('Too Many Requests');
      expect(alerts[0].message).toMatch(/try again later/i);
    });
  });
});
