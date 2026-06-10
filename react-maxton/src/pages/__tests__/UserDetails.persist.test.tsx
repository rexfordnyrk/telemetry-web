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
  // No view_user_roles → UserDetails skips fetchRoles on mount, so the
  // mocked fetch only ever sees the PUT we're asserting on.
  usePermissions: () => ({
    hasPermission: (permission: string) =>
      ['read_users', 'update_users'].includes(permission),
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
        availableRoles: [],
        loading: false,
        createUserLoading: false,
        userDetailsLoading: false,
        error: null,
        assignRoleLoading: false,
        removeRoleLoading: false,
        adminPasswordLoading: false,
      },
      rolesPermissions: {
        roles: [],
        selectedRole: null,
        rolesTotal: 0,
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

describe('UserDetails profile edit persistence', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    jest.spyOn(passwordPolicyModule, 'fetchPasswordPolicy').mockResolvedValue(
      passwordPolicyModule.DEFAULT_PASSWORD_POLICY,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls PUT /api/v1/users/:id with edited fields on save', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { ...testUser, first_name: 'Updated' } }),
    });

    const store = createStore();
    render(
      <Provider store={store}>
        <UserDetails />
      </Provider>,
    );

    // Enter edit mode.
    fireEvent.click(await screen.findByRole('button', { name: /Edit Profile/i }));

    // Mutate first name.
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });

    // Submit form (there may be multiple Save buttons across cards; pick the
    // one inside the user-form, which submits via type=submit).
    const saveBtn = (await screen.findAllByRole('button', { name: /Save/i }))[0];
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/users/user-123'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"first_name":"Updated"'),
        }),
      );
    });

    await waitFor(() => {
      const alerts = store.getState().alerts.alerts;
      expect(alerts.some((a) => a.type === 'success' && a.title === 'Profile Updated')).toBe(true);
    });
  });

  it('shows danger alert when the API rejects the update', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'validation failed' }),
    });

    const store = createStore();
    render(
      <Provider store={store}>
        <UserDetails />
      </Provider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /Edit Profile/i }));
    fireEvent.change(await screen.findByLabelText(/First Name/i), {
      target: { value: 'Broken' },
    });
    const saveBtn = (await screen.findAllByRole('button', { name: /Save/i }))[0];
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const alerts = store.getState().alerts.alerts;
      expect(alerts.some((a) => a.type === 'danger' && a.title === 'Update Failed')).toBe(true);
    });
  });
});
