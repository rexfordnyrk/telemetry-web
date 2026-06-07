import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RolesPermissions from '../RolesPermissions';
import rolesPermissionsReducer from '../../store/slices/rolesPermissionsSlice';
import alertReducer from '../../store/slices/alertSlice';
import authReducer from '../../store/slices/authSlice';

jest.mock('../../hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: () => true,
  }),
}));

jest.mock('../../hooks/useDataTable', () => ({
  useDataTable: () => ({
    isInitialized: false,
    destroyDataTable: jest.fn(),
  }),
}));

jest.mock('../../components/PermissionRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

global.fetch = jest.fn();

const selectedRole = {
  id: 'role-custom',
  name: 'Custom',
  description: 'Custom role',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  permissions: [
    {
      id: 'perm-1',
      name: 'read_users',
      description: 'Read users',
      created_at: '',
      updated_at: '',
    },
  ],
};

const pendingPermission = {
  id: 'perm-2',
  name: 'list_users',
  description: 'List users',
  created_at: '',
  updated_at: '',
};

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      rolesPermissions: rolesPermissionsReducer,
      alert: alertReducer,
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
      rolesPermissions: {
        roles: [selectedRole],
        selectedRole,
        rolesTotal: 1,
        rolesPage: 1,
        rolesLimit: 100,
        rolesLoading: false,
        roleDetailLoading: false,
        rolesError: null,
        permissions: [selectedRole.permissions[0], pendingPermission],
        permissionsTotal: 2,
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

describe('RolesPermissions save', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    (fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST' && url.includes('/permissions')) {
        return Promise.resolve({ ok: true, json: async () => ({ message: 'assigned' }) });
      }
      if (options?.method === 'DELETE' && url.includes('/permissions')) {
        return Promise.resolve({ ok: true, json: async () => ({ message: 'removed' }) });
      }
      if (options?.method === 'GET' && url.includes('/roles/') && !url.includes('?')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: {
              ...selectedRole,
              permissions: [pendingPermission],
            },
          }),
        });
      }
      if (options?.method === 'GET' && url.includes('/roles')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [selectedRole], total: 1, page: 1, limit: 100 }),
        });
      }
      if (options?.method === 'GET' && url.includes('/permissions')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: [selectedRole.permissions[0], pendingPermission],
            total: 2,
            page: 1,
            limit: 100,
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ data: [] }) });
    });
  });

  it('save dispatches assignPermissionsToRole and removePermissionsFromRole', async () => {
    render(
      <Provider store={createStore()}>
        <RolesPermissions />
      </Provider>
    );

    expect(await screen.findByText('list_users')).toBeInTheDocument();
    fireEvent.click(screen.getByText('list_users'));
    fireEvent.click(screen.getByTitle('Remove permission'));
    fireEvent.click(screen.getByRole('button', { name: /Apply Changes/i }));

    await waitFor(() => {
      const calls = (fetch as jest.Mock).mock.calls;
      expect(calls.some(([url, opts]) => opts?.method === 'POST' && url.includes('/permissions'))).toBe(true);
      expect(calls.some(([url, opts]) => opts?.method === 'DELETE' && url.includes('/permissions'))).toBe(true);
    });
  });

  it('refetches role detail after successful save', async () => {
    render(
      <Provider store={createStore()}>
        <RolesPermissions />
      </Provider>
    );

    expect(await screen.findByText('list_users')).toBeInTheDocument();
    fireEvent.click(screen.getByText('list_users'));
    fireEvent.click(screen.getByRole('button', { name: /Apply Changes/i }));

    await waitFor(() => {
      const getRoleCalls = (fetch as jest.Mock).mock.calls.filter(
        ([url, opts]) => opts?.method === 'GET' && url.includes(`/roles/${selectedRole.id}`)
      );
      expect(getRoleCalls.length).toBeGreaterThan(0);
    });
  });

  it('clears pending additions/removals after save', async () => {
    render(
      <Provider store={createStore()}>
        <RolesPermissions />
      </Provider>
    );

    expect(await screen.findByText('list_users')).toBeInTheDocument();
    fireEvent.click(screen.getByText('list_users'));
    fireEvent.click(screen.getByRole('button', { name: /Apply Changes/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Pending Additions/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Pending Removals/i)).not.toBeInTheDocument();
    });
  });
});
