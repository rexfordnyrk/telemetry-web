import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MyProfile from '../MyProfile';
import usersReducer, { type User } from '../../store/slices/userSlice';
import alertReducer from '../../store/slices/alertSlice';
import authReducer from '../../store/slices/authSlice';

// Mutable permission flag flipped per test via setCanEdit(). The prefix
// `mock` is required so jest.mock's factory can reference it.
let mockCanEditFlag = true;
const setCanEdit = (v: boolean) => {
  mockCanEditFlag = v;
};

jest.mock('../../hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: (perm: string) =>
      mockCanEditFlag ? perm === 'update_own_profile' : false,
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

const selfUser: User = {
  id: 'self-user',
  email: 'me@example.com',
  username: 'me@example.com',
  first_name: 'Me',
  last_name: 'Self',
  phone: '+233200000000',
  organization: 'Acme',
  designation: 'Engineer',
  status: 'active',
  roles: [
    {
      id: 'role-user',
      name: 'User',
      description: 'User',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

function buildStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      alerts: alertReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          id: selfUser.id,
          username: selfUser.username,
          email: selfUser.email,
          firstName: selfUser.first_name,
          lastName: selfUser.last_name,
          fullName: `${selfUser.first_name} ${selfUser.last_name}`,
          roles: ['User'],
          permissions: ['update_own_profile'],
        },
        token: 'token',
        refreshToken: null,
        expiresIn: 900,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      } as any,
      users: {
        users: [selfUser],
        selectedUser: selfUser,
        availableRoles: [],
        loading: false,
        createUserLoading: false,
        userDetailsLoading: false,
        error: null,
        assignRoleLoading: false,
        removeRoleLoading: false,
        adminPasswordLoading: false,
      },
    },
  });
}

const renderProfile = () =>
  render(
    <Provider store={buildStore()}>
      <MemoryRouter>
        <MyProfile />
      </MemoryRouter>
    </Provider>,
  );

describe('MyProfile', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    setCanEdit(true);
  });

  it('renders profile details from the authenticated user', () => {
    renderProfile();
    expect(screen.getByText('Me Self')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('me@example.com').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Engineer · Acme/)).toBeInTheDocument();
  });

  it('hides the Edit button when update_own_profile is missing', () => {
    setCanEdit(false);
    renderProfile();
    expect(screen.queryByRole('button', { name: /Edit Profile/i })).not.toBeInTheDocument();
    expect(
      screen.getByText(/Profile editing is disabled for your account/i),
    ).toBeInTheDocument();
  });

  it('submits only the whitelisted fields when saving', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { ...selfUser, first_name: 'Updated' } }),
    });

    renderProfile();
    fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    const lastCall = mockFetch.mock.calls.at(-1)!;
    const init: any = lastCall[1];
    expect(init.method).toBe('PUT');
    const body = JSON.parse(init.body);
    expect(body.first_name).toBe('Updated');
    expect(body.last_name).toBe('Self');
    expect(body.phone).toBe('+233200000000');
    // Whitelisted shape only — no email/username/organization in the payload.
    expect(body.email).toBeUndefined();
    expect(body.organization).toBeUndefined();
  });
});
