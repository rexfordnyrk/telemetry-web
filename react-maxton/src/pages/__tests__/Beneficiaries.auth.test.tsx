/**
 * Beneficiaries Auth Guard Tests — §7.2 Phase 4
 *
 * Verifies that the /beneficiary-management/beneficiaries route is protected
 * by ProtectedRoute: unauthenticated users (no token, not authenticated) are
 * redirected to /login and never see beneficiary content.
 *
 * Note on scope: ProtectedRoute guards on `isAuthenticated` flag (set by the
 * auth slice on login). Expired-token detection lives in §7.1 Phase 2 (the
 * 401 interceptor); this suite only asserts presence-based auth guard.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import ProtectedRoute from '../../components/ProtectedRoute';

// ---------------------------------------------------------------------------
// Minimal store builder
// ---------------------------------------------------------------------------

const defaultAuthState = {
  isAuthenticated: false,
  user: null,
  token: null as string | null,
  refreshToken: null,
  expiresIn: null,
  mfaPending: false,
  mfaToken: null,
  mfaMethods: [] as string[],
  mfaEmailOtpSent: false,
  loading: false,
  error: null,
  initialized: true,
  formData: { email: '', password: '', rememberMe: false },
};

const createAuthStore = (overrides: Partial<typeof defaultAuthState> = {}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { ...defaultAuthState, ...overrides } },
  });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ProtectedContent = () => <div>Beneficiaries Management</div>;

const renderWithStore = (store: ReturnType<typeof createAuthStore>) =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      </BrowserRouter>
    </Provider>,
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Beneficiaries — ProtectedRoute auth guard (§7.2 phase-4)', () => {
  it('renders a Navigate redirect to /login when there is no token and isAuthenticated is false', () => {
    const store = createAuthStore({ isAuthenticated: false, token: null, initialized: true });
    renderWithStore(store);

    // Protected content must NOT appear
    expect(screen.queryByText('Beneficiaries Management')).not.toBeInTheDocument();

    // The mock Navigate renders a div with data-to="/login"
    const redirect = screen.getByTestId('router-navigate');
    expect(redirect).toHaveAttribute('data-to', '/login');
    expect(redirect).toHaveAttribute('data-replace', 'true');
  });

  it('renders a Navigate redirect to /login when token is present but isAuthenticated flag is false (expired-session scenario)', () => {
    // Token string exists in state but isAuthenticated has been cleared (e.g.
    // after a 401 clears the auth slice). ProtectedRoute must still redirect.
    const store = createAuthStore({
      isAuthenticated: false,
      token: 'stale.jwt.token',
      initialized: true,
    });
    renderWithStore(store);

    expect(screen.queryByText('Beneficiaries Management')).not.toBeInTheDocument();

    const redirect = screen.getByTestId('router-navigate');
    expect(redirect).toHaveAttribute('data-to', '/login');
  });

  it('renders protected content when isAuthenticated is true', () => {
    const store = createAuthStore({
      isAuthenticated: true,
      token: 'valid.jwt.token',
      initialized: true,
    });
    renderWithStore(store);

    expect(screen.getByText('Beneficiaries Management')).toBeInTheDocument();
    expect(screen.queryByTestId('router-navigate')).not.toBeInTheDocument();
  });

  it('shows initializing spinner (no redirect) when auth is not yet initialized', () => {
    const store = createAuthStore({ isAuthenticated: false, token: null, initialized: false });
    renderWithStore(store);

    // Should show loading state, not redirect yet
    expect(screen.queryByTestId('router-navigate')).not.toBeInTheDocument();
    expect(screen.queryByText('Beneficiaries Management')).not.toBeInTheDocument();
    // Loading spinner present
    expect(screen.getByText(/Initializing authentication/i)).toBeInTheDocument();
  });
});
