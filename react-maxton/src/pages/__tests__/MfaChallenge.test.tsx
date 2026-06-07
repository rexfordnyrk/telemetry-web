import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import MfaChallenge from '../MfaChallenge';

jest.mock('../../utils/jwtUtils', () => ({
  decodeJWT: jest.fn(() => ({
    user_id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    roles: [],
    permissions: [],
  })),
  logJWTClaims: jest.fn(),
}));

jest.mock('../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      AUTH: {
        MFA_VERIFY: '/api/v1/auth/mfa/verify',
        MFA_SEND_EMAIL_OTP: '/api/v1/auth/mfa/send-email-otp',
      },
    },
  },
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: jest.fn(),
}));

global.fetch = jest.fn();

const createTestStore = (authOverrides = {}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        expiresIn: null,
        mfaPending: true,
        mfaToken: 'test-mfa-token',
        mfaMethods: ['totp', 'email'],
        mfaEmailOtpSent: false,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
        ...authOverrides,
      },
    },
  });

const renderMfaChallenge = (authOverrides = {}) => {
  const store = createTestStore(authOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MfaChallenge />
      </MemoryRouter>
    </Provider>
  );
};

describe('MfaChallenge', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders TOTP input by default when both methods available', () => {
    renderMfaChallenge();
    expect(screen.getByLabelText(/authenticator code/i)).toBeInTheDocument();
  });

  it('shows Use email instead link when email OTP enabled', () => {
    renderMfaChallenge();
    expect(screen.getByRole('button', { name: /use email instead/i })).toBeInTheDocument();
  });

  it('shows backup code entry option', () => {
    renderMfaChallenge();
    expect(screen.getByRole('button', { name: /use a backup code/i })).toBeInTheDocument();
  });

  it('shows resend button and email label when only email OTP is enabled', () => {
    renderMfaChallenge({
      mfaMethods: ['email'],
      mfaEmailOtpSent: true,
    });

    expect(screen.getByLabelText(/email verification code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend code/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /use email instead/i })
    ).not.toBeInTheDocument();
  });

  it('calls verify endpoint on submit', async () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ user_id: 'user-1', exp: 9999999999 }));
    const mockToken = `${header}.${payload}.sig`;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
        refresh_token: 'refresh-1',
        expires_in: 900,
      }),
    });

    renderMfaChallenge();

    fireEvent.change(screen.getByLabelText(/authenticator code/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^verify$/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/auth/mfa/verify',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            mfa_token: 'test-mfa-token',
            method: 'totp',
            code: '123456',
          }),
        })
      );
    });
  });
});
