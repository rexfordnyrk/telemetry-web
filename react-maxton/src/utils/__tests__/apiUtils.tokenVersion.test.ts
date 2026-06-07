import { configureStore } from '@reduxjs/toolkit';
import { handleApiError, handlePermissionsStale } from '../apiUtils';

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

import authReducer, { sessionExpired } from '../../store/slices/authSlice';

const { toast } = jest.requireMock('react-toastify');

describe('apiUtils token version handling', () => {
  let store: ReturnType<typeof configureStore>;
  const originalLocation = window.location;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', username: 'user', email: 'user@example.com' } as any,
          token: 'token',
          refreshToken: 'refresh',
          expiresIn: 900,
          loading: false,
          error: null,
          initialized: true,
          formData: { email: '', password: '', rememberMe: false },
        },
      },
    });
    delete (window as { location?: Location }).location;
    window.location = { href: '' } as Location;
    (toast.warning as jest.Mock).mockClear();
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('on 401 token_version_stale clears auth and redirects with permissions message', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const response = {
      status: 401,
      json: async () => ({ error: 'token_version_stale' }),
    } as Response;

    const message = await handleApiError(
      response,
      'API request failed',
      store.dispatch
    );

    expect(message).toBe('Your permissions have changed. Please log in again.');
    expect(dispatchSpy).toHaveBeenCalledWith(sessionExpired());
    expect(toast.warning).toHaveBeenCalledWith(
      'Your permissions have changed. Please log in again.'
    );
    expect(window.location.href).toBe('/login?reason=permissions_changed');
  });

  it('handlePermissionsStale redirects with permissions_changed reason', () => {
    handlePermissionsStale(store.dispatch);

    expect(window.location.href).toBe('/login?reason=permissions_changed');
    expect(toast.warning).toHaveBeenCalledWith(
      'Your permissions have changed. Please log in again.'
    );
  });
});
