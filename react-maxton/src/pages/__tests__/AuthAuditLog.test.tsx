import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import AuthAuditLog from '../AuthAuditLog';

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../hooks/usePermissions', () => ({
  usePermissions: jest.fn(),
}));

jest.mock('../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      AUTH: {
        AUTH_EVENTS: '/api/v1/auth/events',
        AUTH_EVENTS_EXPORT: '/api/v1/auth/events/export',
      },
    },
  },
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: (token?: string) => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }),
}));

import { usePermissions } from '../../hooks/usePermissions';

const mockEvents = {
  data: [
    {
      id: 'evt-1',
      created_at: '2026-06-07T10:00:00Z',
      email: 'user@example.com',
      event_type: 'login_success',
      success: true,
      ip_address: '127.0.0.1',
    },
    {
      id: 'evt-2',
      created_at: '2026-06-07T09:00:00Z',
      email: 'user@example.com',
      event_type: 'login_failure',
      success: false,
      ip_address: '127.0.0.1',
    },
  ],
  total: 2,
  page: 1,
  limit: 50,
};

global.fetch = jest.fn();
URL.createObjectURL = jest.fn(() => 'blob:mock');
URL.revokeObjectURL = jest.fn();

const renderAuthAuditLog = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          id: 'admin-1',
          username: 'admin',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
          roles: ['Admin'],
          permissions: ['read_auth_events', 'export_auth_events'],
        },
        token: 'test-token',
        refreshToken: null,
        expiresIn: null,
        mfaPending: false,
        mfaToken: null,
        mfaMethods: [],
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      },
    },
  });

  return render(
    <Provider store={store}>
      <AuthAuditLog />
    </Provider>
  );
};

describe('AuthAuditLog', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    });
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: (p: string) =>
        p === 'read_auth_events' || p === 'export_auth_events',
    });
  });

  it('renders event rows from API response', async () => {
    renderAuthAuditLog();

    await waitFor(() => {
      expect(screen.getAllByTestId('auth-event-row')).toHaveLength(2);
    });

    const table = screen.getByTestId('auth-events-table');
    expect(table).toHaveTextContent('login_success');
    expect(table).toHaveTextContent('login_failure');
    expect(table).toHaveTextContent('user@example.com');
  });

  it('hides export button without export_auth_events permission', async () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: (p: string) => p === 'read_auth_events',
    });

    renderAuthAuditLog();

    await waitFor(() => {
      expect(screen.getByTestId('auth-events-table')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('export-auth-events')).not.toBeInTheDocument();
  });

  it('shows export button and triggers download when permitted', async () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderAuthAuditLog();

    await waitFor(() => {
      expect(screen.getByTestId('export-auth-events')).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['id,email\n1,a@b.com'], { type: 'text/csv' }),
    });

    fireEvent.click(screen.getByTestId('export-auth-events'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/events/export'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('applies filter controls to API query params', async () => {
    renderAuthAuditLog();

    await waitFor(() => {
      expect(screen.getByTestId('auth-event-filters')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'login_failure' },
    });
    fireEvent.change(screen.getByLabelText(/^success$/i), {
      target: { value: 'false' },
    });

    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /email=user%40example\.com.*event_type=login_failure.*success=false/
        ),
        expect.any(Object)
      );
    });
  });
});
