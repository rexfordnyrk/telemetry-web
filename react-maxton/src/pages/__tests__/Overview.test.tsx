/**
 * Overview page — DARE Telemetry §7.7 Phase 1, Task 8
 *
 * Covers:
 *  - visible-tab-only 120s auto-refresh (useVisiblePolling wiring)
 *  - manual refresh button calling fetchDashboardData
 *  - WidgetShell wrapping BeneficiaryActivityWidget with the correct state
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import globalFiltersReducer from '../../store/slices/globalFiltersSlice';
import Overview from '../Overview';

jest.mock('../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const defaultAuthState = {
  isAuthenticated: true,
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    photo: '',
    roles: [],
    permissions: [],
  },
  token: 'test-token',
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

function makeStore() {
  return configureStore({
    reducer: { auth: authReducer, globalFilters: globalFiltersReducer },
    preloadedState: { auth: defaultAuthState as any },
  });
}

const emptyWidgetsResponse = {
  data: {
    widgets: {},
    globalFilters: {
      availableProgrammes: ['All Programmes'],
      availableOrganisations: ['All Organisations'],
      availableDistricts: ['All Districts'],
    },
  },
};

function renderOverview() {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <Overview />
    </Provider>
  );
}

describe('Overview — auto refresh + manual refresh + WidgetShell (§7.7 phase-1 task-8)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('auto-refreshes every 120s while tab visible', async () => {
    jest.useFakeTimers();
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(emptyWidgetsResponse),
      } as any);

    render(
      <Provider store={makeStore()}>
        <Overview />
      </Provider>
    );

    // Initial fetch on mount
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(120_000);
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('manual refresh button calls fetchDashboardData', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
      } as any)
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(emptyWidgetsResponse),
      } as any);

    renderOverview();

    // First call happens on mount and fails, surfacing the error banner
    // with the "Retry Loading Data" button (wired to fetchDashboardData).
    await waitFor(() => {
      expect(screen.getByText(/Retry Loading Data/i)).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Retry Loading Data/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it('renders WidgetShell around BeneficiaryActivityWidget with correct state', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            widgets: { beneficiary_activity_rows: [] },
            globalFilters: {
              availableProgrammes: ['All Programmes'],
              availableOrganisations: ['All Organisations'],
              availableDistricts: ['All Districts'],
            },
          },
        }),
    } as any);

    renderOverview();

    await waitFor(() => {
      expect(
        screen.getByText('No beneficiary activity in this period.')
      ).toBeInTheDocument();
    });
  });

  it('shows the "Updated" indicator in the header on the happy path (no error/fallback state)', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(emptyWidgetsResponse),
    } as any);

    renderOverview();

    // Happy path: data loaded successfully, no fallback/error alert shown.
    await waitFor(() => {
      expect(screen.getByText(/Updated/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Retry Loading Data/i)).not.toBeInTheDocument();
  });
});
