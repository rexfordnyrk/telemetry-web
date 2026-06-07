import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

const mockLogoutUser = jest.fn();
const mockRefreshSession = jest.fn();

jest.mock('../../store/slices/authSlice', () => {
  const actual = jest.requireActual('../../store/slices/authSlice');
  const logoutThunk = Object.assign(
    (...args: unknown[]) => mockLogoutUser(...args),
    { typePrefix: 'auth/logout' }
  );
  const refreshThunk = Object.assign(
    (...args: unknown[]) => mockRefreshSession(...args),
    { typePrefix: 'auth/refreshSession' }
  );
  return {
    __esModule: true,
    ...actual,
    default: actual.default,
    logoutUser: logoutThunk,
    refreshSession: refreshThunk,
  };
});

// eslint-disable-next-line import/first
import authReducer from '../../store/slices/authSlice';
import { useSessionManager } from '../useSessionManager';

jest.mock('../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      AUTH: {
        SESSION_CONFIG: '/api/v1/auth/session-config',
      },
    },
  },
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
}));

const createMockJWT = (expOffsetSeconds = 900) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expOffsetSeconds,
      user_id: 'user-1',
    })
  );
  return `${header}.${payload}.signature`;
};

const sessionConfig = {
  idle_timeout_minutes: 30,
  idle_warning_minutes: 2,
  access_expiry_minutes: 15,
};

const createWrapper = (authOverrides = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: null,
        token: createMockJWT(),
        refreshToken: 'refresh-token',
        expiresIn: 900,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
        ...authOverrides,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: undefined,
        },
      }),
  });

  // Make mocked thunks return promises when dispatched
  const originalDispatch = store.dispatch;
  store.dispatch = ((action: unknown) => {
    if (typeof action === 'function') {
      return Promise.resolve(action(store.dispatch, store.getState, undefined));
    }
    return originalDispatch(action as never);
  }) as typeof store.dispatch;

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
};

describe('useSessionManager', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.useFakeTimers();
    delete (window as { location?: Location }).location;
    window.location = { href: '' } as Location;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => sessionConfig,
    });
    mockLogoutUser.mockClear();
    mockRefreshSession.mockClear();
    mockLogoutUser.mockReturnValue(async () => ({ type: 'auth/logout/fulfilled' }));
    mockRefreshSession.mockReturnValue(async () => ({
      type: 'auth/refreshSession/fulfilled',
      payload: { token: 'new-token', refresh_token: 'new-refresh', expires_in: 900 },
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  it('shows warning modal after idle_timeout minus idle_warning', async () => {
    const { result } = renderHook(() => useSessionManager(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.showWarning).toBe(false);

    act(() => {
      jest.advanceTimersByTime(28 * 60 * 1000);
    });

    expect(result.current.showWarning).toBe(true);
  });

  it('dispatches logout after full idle_timeout', async () => {
    renderHook(() => useSessionManager(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
      await Promise.resolve();
    });

    expect(mockLogoutUser).toHaveBeenCalled();
  });

  it('resets idle timer on user activity event', async () => {
    const { result } = renderHook(() => useSessionManager(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });

    act(() => {
      window.dispatchEvent(new Event('mousedown'));
    });

    // Only 2 more minutes — still before the 28-minute warning threshold after reset
    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });

    expect(result.current.showWarning).toBe(false);
  });

  it('schedules token refresh before access expiry when active', async () => {
    renderHook(() => useSessionManager(), {
      wrapper: createWrapper({ expiresIn: 900 }),
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(840 * 1000);
      await Promise.resolve();
    });

    expect(mockRefreshSession).toHaveBeenCalled();
  });
});
