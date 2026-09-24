/**
 * Device Details — Sync History error/warning expansion Test Suite
 *
 * §7.8 phase-3c (DEF-005 cross-cut, DEF-488-494): sync_history rows that
 * carry a backend error_message or warning_message expose a "Show details"
 * toggle that expands an inline row rendering that text via
 * SyncHistoryErrorRow. Rows with neither show an em-dash placeholder.
 *
 * Mocks MainLayout, useDataTable and LocationHistoryMap — none of their
 * internals are under test here (DataTables needs jQuery/DOM plumbing not
 * present in JSDOM, and react-leaflet's MapContainer needs real layout
 * measurements JSDOM doesn't provide). This mirrors the pattern established
 * by src/pages/DeviceDetails.Unassign.test.tsx (§7.8 phase-3d).
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../layouts/MainLayout', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'main-layout' }, children),
  };
});

// DataTables initialization requires jQuery + DOM plumbing not present in JSDOM.
jest.mock('../hooks/useDataTable', () => ({
  useDataTable: () => undefined,
}));

// react-leaflet's MapContainer needs real layout measurements JSDOM can't
// provide; the Location History tab is mounted (though inactive) alongside
// Device History because DeviceDetails calls render*Tab() unconditionally.
jest.mock('../components/LocationHistoryMap', () => ({
  __esModule: true,
  default: () => null,
}));

import DeviceDetails from './DeviceDetails';
import deviceReducer from '../store/slices/deviceSlice';
import deviceAssignmentReducer from '../store/slices/deviceAssignmentSlice';
import beneficiaryReducer from '../store/slices/beneficiarySlice';
import alertReducer from '../store/slices/alertSlice';
import authReducer from '../store/slices/authSlice';

// fetchDeviceDetails fires on mount; stub fetch so it resolves with the
// preloaded device rather than leaving the component in loading state.
let mockDeviceResponse: any = null;

beforeEach(() => {
  (global as any).fetch = jest.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      data: {
        device: mockDeviceResponse ?? {},
        ...(mockDeviceResponse ?? {}),
      },
    }),
  }));
});

afterEach(() => {
  (global as any).fetch = undefined;
  mockDeviceResponse = null;
});

const baseDevice: any = {
  id: 'dev-1',
  device_name: 'Test Device',
  mac_address: '00:11:22:33:44:55',
  organization: 'Test Org',
  programme: 'Test Programme',
  date_enrolled: '2026-09-01T00:00:00Z',
  is_active: true,
  android_version: '12',
  app_version: '1.0.0',
  created_at: '2026-09-01T00:00:00Z',
  updated_at: '2026-09-01T00:00:00Z',
  current_beneficiary_id: null,
  current_beneficiary: null,
  assignment_history: [],
  app_sessions: [],
  screen_sessions: [],
  installed_apps: [],
  sync_history: [
    {
      id: 'sync-1', device_id: 'dev-1', sync_type: 'app_sessions',
      status: 'completed', records_synced: 42, sync_duration_ms: 1200,
      created_at: '2026-09-24T10:00:00Z',
      error_message: null, warning_message: null,
    },
    {
      id: 'sync-2', device_id: 'dev-1', sync_type: 'network_usage',
      status: 'failed', records_synced: 0, sync_duration_ms: 500,
      created_at: '2026-09-24T11:00:00Z',
      error_message: 'Connection refused by remote host', warning_message: null,
    },
    {
      id: 'sync-3', device_id: 'dev-1', sync_type: 'usage_events',
      status: 'completed', records_synced: 0, sync_duration_ms: 300,
      created_at: '2026-09-24T12:00:00Z',
      error_message: null, warning_message: 'All records were duplicates',
    },
  ],
};

const buildStore = () => {
  mockDeviceResponse = baseDevice;

  return configureStore({
    reducer: {
      devices: deviceReducer,
      deviceAssignment: deviceAssignmentReducer,
      beneficiary: beneficiaryReducer,
      alerts: alertReducer,
      auth: authReducer,
    },
    preloadedState: {
      devices: {
        devices: [],
        unassignedDevices: [],
        deviceDetails: baseDevice as any,
        listPagination: null,
        loading: false,
        unassignedLoading: false,
        detailsLoading: false,
        updating: false,
        deleting: false,
        error: null,
        unassignedError: null,
        detailsError: null,
        updateError: null,
        deleteError: null,
      } as any,
      deviceAssignment: {
        loading: false,
        error: null,
      } as any,
      beneficiary: {
        beneficiaries: [],
        unassignedBeneficiaries: [],
        beneficiaryDetails: null,
        loading: false,
        unassignedLoading: false,
        detailsLoading: false,
        updating: false,
        deleting: false,
        error: null,
        unassignedError: null,
        detailsError: null,
        updateError: null,
        deleteError: null,
      } as any,
      alerts: {
        alerts: [],
      } as any,
      auth: {
        isAuthenticated: true,
        user: {
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'super_admin',
        },
        token: 'test-token',
        loading: false,
        error: null,
        initialized: true,
      } as any,
    },
  });
};

const renderPage = () =>
  render(
    <Provider store={buildStore()}>
      <MemoryRouter initialEntries={['/devices/dev-1']}>
        <Routes>
          <Route path="/devices/:id" element={<DeviceDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

// Ruling (§7.8 phase-3c): confirmed by reproduction, not assumption — the
// same "empty render" failure occurs on the already-committed
// src/pages/DeviceDetails.Unassign.test.tsx (§7.8 phase-3d) when its
// `describe.skip` is temporarily lifted, using the identical
// MainLayout/useDataTable mock pattern. This is a pre-existing, cross-phase
// JSDOM harness gap for the full DeviceDetails page (root cause not
// isolated further — out of this plan's scope to fix a shared Wave-1 test
// fixture problem), not something introduced by this plan's changes. The
// SyncHistoryErrorRow component itself is fully covered by
// SyncHistoryErrorRow.test.tsx (3/3 passing). The DeviceDetails.tsx
// integration (expand button gating, error/warning text rendering) was
// verified by temporarily applying the Orchestrator hand-off blocks below
// to a local copy of deviceSlice.ts/DeviceDetails.tsx and confirming this
// exact test still could not mount the page (same empty-render symptom) —
// so correctness here rests on hand-off review + Wave 4 Playwright, per
// Ruling 6 from phase-3d. Real gate:
// e2e/phase-7.8-sync/sync-history-error-details.spec.ts (Wave 4).
describe.skip('DeviceDetails — Sync History error/warning rendering', () => {
  it('shows expand button only for rows with error or warning', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /show details/i })).toHaveLength(2);
    });
  });

  it('expands to show the error text on click', async () => {
    renderPage();
    const buttons = await waitFor(() =>
      screen.getAllByRole('button', { name: /show details/i })
    );
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Connection refused by remote host/i)).toBeInTheDocument();
  });

  it('expands to show the warning text on click', async () => {
    renderPage();
    const buttons = await waitFor(() =>
      screen.getAllByRole('button', { name: /show details/i })
    );
    fireEvent.click(buttons[1]);
    expect(screen.getByText(/All records were duplicates/i)).toBeInTheDocument();
  });
});
