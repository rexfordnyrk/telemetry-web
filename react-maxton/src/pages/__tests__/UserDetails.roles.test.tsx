import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserDetails from '../UserDetails';
import usersReducer, { removeRoleFromUser } from '../../store/slices/userSlice';
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
      ['read_users', 'view_user_roles', 'manage_user_roles', 'update_users'].includes(permission),
  }),
}));

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

const userId = 'user-123';
const adminRole = {
  id: 'role-admin',
  name: 'Admin',
  description: 'Admin role',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
const fieldRole = {
  id: 'role-field',
  name: 'Field Agent',
  description: 'Field role',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const testUser = {
  id: userId,
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
  roles: [adminRole, fieldRole],
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
        availableRoles: [adminRole, fieldRole, { id: 'role-manager', name: 'Manager', description: 'Manager', created_at: '', updated_at: '' }],
        loading: false,
        createUserLoading: false,
        userDetailsLoading: false,
        error: null,
        assignRoleLoading: false,
        removeRoleLoading: false,
        adminPasswordLoading: false,
      },
      rolesPermissions: {
        roles: [adminRole, fieldRole, { id: 'role-manager', name: 'Manager', description: 'Manager', created_at: '', updated_at: '' }],
        selectedRole: null,
        rolesTotal: 3,
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

describe('UserDetails roles', () => {
  beforeEach(() => {
    jest.spyOn(passwordPolicyModule, 'fetchPasswordPolicy').mockResolvedValue(
      passwordPolicyModule.DEFAULT_PASSWORD_POLICY
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all assigned roles as removable chips', async () => {
    render(
      <Provider store={createStore()}>
        <UserDetails />
      </Provider>
    );

    expect(await screen.findByText('Manage Roles')).toBeInTheDocument();
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Field Agent').length).toBeGreaterThan(0);
    expect(screen.getAllByTitle('Remove role')).toHaveLength(2);
  });

  it('assign dropdown excludes already-assigned roles', async () => {
    render(
      <Provider store={createStore()}>
        <UserDetails />
      </Provider>
    );

    expect(await screen.findByText('Manage Roles')).toBeInTheDocument();
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const optionTexts = Array.from(select.options).map((option) => option.textContent);

    expect(optionTexts.some((text) => text?.includes('Manager'))).toBe(true);
    expect(optionTexts.some((text) => text?.includes('Admin'))).toBe(false);
    expect(optionTexts.some((text) => text?.includes('Field Agent'))).toBe(false);
  });

  it('remove role dispatches removeRoleFromUser with correct ids', async () => {
    const removeSpy = jest.spyOn(require('../../store/slices/userSlice'), 'removeRoleFromUser');
    const store = createStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <UserDetails />
      </Provider>
    );

    expect(await screen.findByText('Manage Roles')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Remove role')[1]);
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Remove Role' }));

    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith({
        userId,
        roleId: fieldRole.id,
      });
      expect(dispatchSpy).toHaveBeenCalled();
    });

    removeSpy.mockRestore();
  });
});
