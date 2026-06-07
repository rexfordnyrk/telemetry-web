import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginUser,
  logoutUser,
  refreshSession,
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

describe('authSlice session management', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });

  it('loginUser.fulfilled stores refreshToken in state and localStorage', async () => {
    const mockToken = createMockJWT();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
        refresh_token: 'refresh-abc',
        expires_in: 900,
      }),
    });

    await store.dispatch(
      loginUser({ username: 'test@example.com', password: 'secret' })
    );

    const state = store.getState() as { auth: AuthState };
    expect(state.auth.refreshToken).toBe('refresh-abc');
    expect(state.auth.expiresIn).toBe(900);

    const stored = JSON.parse(localStorage.getItem('auth_state') || '{}');
    expect(stored.refreshToken).toBe('refresh-abc');
  });

  it('refreshSession updates access token on 200', async () => {
    const oldToken = createMockJWT();
    const newToken = createMockJWT();

    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: oldToken,
          refreshToken: 'refresh-old',
          expiresIn: 900,
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
        token: newToken,
        refresh_token: 'refresh-new',
        expires_in: 900,
      }),
    });

    await store.dispatch(refreshSession());

    const state = store.getState() as { auth: AuthState };
    expect(state.auth.token).toBe(newToken);
    expect(state.auth.refreshToken).toBe('refresh-new');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refresh_token: 'refresh-old' }),
      })
    );
  });

  it('logoutUser clears access and refresh tokens from localStorage', async () => {
    const mockToken = createMockJWT();
    localStorage.setItem(
      'auth_state',
      JSON.stringify({
        token: mockToken,
        refreshToken: 'refresh-abc',
        isAuthenticated: true,
        initialized: true,
      })
    );

    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: mockToken,
          refreshToken: 'refresh-abc',
          expiresIn: 900,
          loading: false,
          error: null,
          initialized: true,
          formData: { email: '', password: '', rememberMe: false },
        },
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await store.dispatch(logoutUser());

    const state = store.getState() as { auth: AuthState };
    expect(state.auth.token).toBeNull();
    expect(state.auth.refreshToken).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_state')).toBeNull();
  });
});
