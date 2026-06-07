import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginUser,
  mfaVerify,
  AuthState,
} from '../authSlice';

jest.mock('../../../utils/jwtUtils', () => ({
  decodeJWT: jest.fn(() => ({
    user_id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    roles: ['admin'],
    permissions: [],
    exp: Math.floor(Date.now() / 1000) + 3600,
  })),
  logJWTClaims: jest.fn(),
}));

jest.mock('../../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/api/v1/auth/login',
        LOGOUT: '/api/v1/auth/logout',
        REFRESH: '/api/v1/auth/refresh',
        MFA_VERIFY: '/api/v1/auth/mfa/verify',
        MFA_SEND_EMAIL_OTP: '/api/v1/auth/mfa/send-email-otp',
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

const createMockJWT = () => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 900,
      user_id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      roles: ['admin'],
    })
  );
  return `${header}.${payload}.signature`;
};

global.fetch = jest.fn();

describe('authSlice MFA', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });

  it('loginUser.fulfilled with mfa_required stores mfaToken and does not set isAuthenticated', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        mfa_required: true,
        mfa_token: 'mfa-challenge-token',
        methods: ['totp', 'email'],
      }),
    });

    await store.dispatch(
      loginUser({ username: 'test@example.com', password: 'secret' })
    );

    const state = store.getState() as { auth: AuthState };
    expect(state.auth.mfaPending).toBe(true);
    expect(state.auth.mfaToken).toBe('mfa-challenge-token');
    expect(state.auth.mfaMethods).toEqual(['totp', 'email']);
    expect(state.auth.mfaEmailOtpSent).toBe(false);
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.token).toBeNull();
    expect(localStorage.getItem('auth_state')).toBeNull();
  });

  it('mfaVerify.fulfilled stores access and refresh tokens', async () => {
    const mockToken = createMockJWT();

    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          expiresIn: null,
          mfaPending: true,
          mfaToken: 'mfa-challenge-token',
          mfaMethods: ['totp', 'email'],
          loading: false,
          error: null,
          initialized: true,
          formData: { email: '', password: '', rememberMe: false },
        },
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
        refresh_token: 'refresh-mfa',
        expires_in: 900,
      }),
    });

    await store.dispatch(
      mfaVerify({
        mfa_token: 'mfa-challenge-token',
        method: 'totp',
        code: '123456',
      })
    );

    const state = store.getState() as { auth: AuthState };
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.token).toBe(mockToken);
    expect(state.auth.refreshToken).toBe('refresh-mfa');
    expect(state.auth.mfaPending).toBe(false);
    expect(state.auth.mfaToken).toBeNull();

    const stored = JSON.parse(localStorage.getItem('auth_state') || '{}');
    expect(stored.token).toBe(mockToken);
    expect(stored.refreshToken).toBe('refresh-mfa');
  });
});
