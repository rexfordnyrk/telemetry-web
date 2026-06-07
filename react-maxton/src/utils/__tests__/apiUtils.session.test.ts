import { configureStore } from '@reduxjs/toolkit';
import {
  handleApiError,
  apiFetch,
  handleSessionExpired,
  attemptTokenRefresh,
} from '../apiUtils';

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

const mockRefreshSession = jest.fn();

jest.mock('../../store/slices/authSlice', () => {
  const actual = jest.requireActual('../../store/slices/authSlice');
  const refreshSessionThunk = Object.assign(
    (...args: unknown[]) => mockRefreshSession(...args),
    {
      fulfilled: actual.refreshSession.fulfilled,
      rejected: actual.refreshSession.rejected,
      pending: actual.refreshSession.pending,
      typePrefix: 'auth/refreshSession',
    }
  );
  return {
    __esModule: true,
    ...actual,
    default: actual.default,
    refreshSession: refreshSessionThunk,
  };
});

// eslint-disable-next-line import/first
import authReducer from '../../store/slices/authSlice';

const { toast } = jest.requireMock('react-toastify');

global.fetch = jest.fn();
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('apiUtils session handling', () => {
  let store: ReturnType<typeof configureStore>;
  const originalLocation = window.location;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
    (fetch as jest.Mock).mockClear();
    mockRefreshSession.mockClear();
    mockAlert.mockClear();
    (toast.warning as jest.Mock).mockClear();
    delete (window as { location?: Location }).location;
    window.location = { href: '' } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('on 401 with refresh token, attempts refresh before logout', async () => {
    mockRefreshSession.mockReturnValue({
      type: 'auth/refreshSession/fulfilled',
      payload: {
        token: 'new-token',
        refresh_token: 'new-refresh',
        expires_in: 900,
      },
    });

    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: 'old-token',
          refreshToken: 'refresh-abc',
          expiresIn: 900,
          loading: false,
          error: null,
          initialized: true,
          formData: { email: '', password: '', rememberMe: false },
        },
      },
    });

    const refreshed = await attemptTokenRefresh(
      store.dispatch,
      store.getState
    );

    expect(refreshed).toBe(true);
    expect(mockRefreshSession).toHaveBeenCalled();
  });

  it('never returns raw JWT parse error text to caller', async () => {
    const response = {
      status: 401,
      json: async () => ({
        error: 'Invalid token claims',
        error_description: 'token contains an invalid number of segments',
      }),
    } as Response;

    const message = await handleApiError(
      response,
      'API request failed',
      store.dispatch
    );

    expect(message).toBe('Your session has expired. Please log in again.');
    expect(message).not.toContain('invalid number of segments');
    expect(message).not.toContain('JWT');
  });

  it('redirects to /login?reason=session_expired on auth failure', async () => {
    handleSessionExpired(store.dispatch);

    expect(window.location.href).toBe('/login?reason=session_expired');
  });

  it('does not call window.alert for session expiry', async () => {
    const response = {
      status: 401,
      json: async () => ({
        error: 'Token has expired',
      }),
    } as Response;

    await handleApiError(response, 'API request failed', store.dispatch);

    expect(mockAlert).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(
      'Your session has expired. Please log in again.'
    );
  });

  it('apiFetch retries request after successful refresh on 401', async () => {
    mockRefreshSession.mockReturnValue({
      type: 'auth/refreshSession/fulfilled',
      payload: {
        token: 'new-token',
        refresh_token: 'new-refresh',
        expires_in: 900,
      },
    });

    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: null,
          token: 'old-token',
          refreshToken: 'refresh-abc',
          expiresIn: 900,
          loading: false,
          error: null,
          initialized: true,
          formData: { email: '', password: '', rememberMe: false },
        },
      },
    });

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Token has expired' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
      });

    const result = await apiFetch(
      'http://localhost:8080/api/v1/users',
      { method: 'GET' },
      store.dispatch,
      store.getState
    );

    expect(mockRefreshSession).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ data: 'success' });
  });
});
