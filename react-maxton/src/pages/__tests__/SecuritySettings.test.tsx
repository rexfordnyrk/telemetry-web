import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import SecuritySettings from '../SecuritySettings';

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      AUTH: {
        MFA_SETTINGS: '/api/v1/auth/mfa/settings',
        MFA_EMAIL_OTP: '/api/v1/auth/mfa/email-otp',
        MFA_TOTP_ENROLL: '/api/v1/auth/mfa/totp/enroll',
        MFA_TOTP_VERIFY: '/api/v1/auth/mfa/totp/verify',
        MFA_BACKUP_CODES_REGENERATE: '/api/v1/auth/mfa/backup-codes/regenerate',
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

global.fetch = jest.fn();

const defaultSettings = {
  email_otp_enabled: true,
  totp_enabled: false,
  has_backup_codes: false,
};

const renderSecuritySettings = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: null,
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
      <SecuritySettings />
    </Provider>
  );
};

describe('SecuritySettings', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => defaultSettings,
    });
  });

  it('toggle email OTP calls API after password confirmation', async () => {
    renderSecuritySettings();

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'updated' }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...defaultSettings, email_otp_enabled: false }),
    });

    fireEvent.click(screen.getByRole('switch', { name: /enabled/i }));
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'mypassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/auth/mfa/email-otp',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ password: 'mypassword', enabled: false }),
        })
      );
    });
  });

  it('TOTP enroll shows QR container after enroll API returns', async () => {
    renderSecuritySettings();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable totp/i })).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        qr_url: 'otpauth://totp/DARE:test@example.com?secret=ABC123',
        secret: 'ABC123',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: /enable totp/i }));

    await waitFor(() => {
      expect(screen.getByTestId('totp-qr-container')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/auth/mfa/totp/enroll',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('displays backup codes once after TOTP verify', async () => {
    renderSecuritySettings();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enable totp/i })).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        qr_url: 'otpauth://totp/DARE:test@example.com?secret=ABC123',
        secret: 'ABC123',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: /enable totp/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/enter code from app/i)).toBeInTheDocument();
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        backup_codes: ['code-one', 'code-two', 'code-three'],
      }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        email_otp_enabled: true,
        totp_enabled: true,
        has_backup_codes: true,
      }),
    });

    fireEvent.change(screen.getByLabelText(/enter code from app/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^verify$/i }));

    await waitFor(() => {
      expect(screen.getByTestId('backup-codes-display')).toBeInTheDocument();
    });

    expect(screen.getByText('code-one')).toBeInTheDocument();
    expect(screen.getByText('code-two')).toBeInTheDocument();
  });
});
