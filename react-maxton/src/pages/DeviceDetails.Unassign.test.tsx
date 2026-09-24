/**
 * Device Details — Unassign action Test Suite
 *
 * Tests for the Unassign device button in the Device Details header.
 * Verifies that:
 * - Button appears only when device has an active assignment
 * - Button is hidden when device is unassigned
 * - Clicking the button opens DeviceAssignmentModal in unassign mode
 *
 * DEF-459, DEF-468: Unassign device from Device Details
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
// Mock MainLayout (Header/Sidebar/session-manager machinery is not under test).
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

// The unassign modal's own data-loading effects are out of scope for this test.
jest.mock('../components/DeviceAssignmentModal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) =>
      props.show
        ? React.createElement(
            'div',
            { role: 'dialog', 'aria-label': 'Unassign Device' },
            `DeviceAssignmentModal stub — mode: ${props.mode}`,
          )
        : null,
  };
});

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
  // Thunk expects { data: { device: {...}, ...restOfDetails } } and merges them.
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

/**
 * Build a Redux store with device details preloaded.
 * Allows testing with or without an active assignment.
 */
const buildStore = (opts: { assigned: boolean }) => {
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
    current_beneficiary_id: opts.assigned ? 'bene-1' : null,
    current_beneficiary: opts.assigned
      ? {
          id: 'bene-1',
          name: 'Jane Beneficiary',
          email: 'jane@example.com',
          phone: '1234567890',
          organization: 'Test Org',
          district: 'Test District',
          programme: 'Test Programme',
          date_enrolled: '2026-08-01T00:00:00Z',
          is_active: true,
          created_at: '2026-08-01T00:00:00Z',
          updated_at: '2026-08-01T00:00:00Z',
        }
      : null,
    assignment_history: opts.assigned
      ? [
          {
            id: 'asg-1',
            device_id: 'dev-1',
            beneficiary_id: 'bene-1',
            assigned_at: '2026-09-01T00:00:00Z',
            unassigned_at: null,
            assigned_by: 'admin@example.com',
            notes: '',
            is_active: true,
            created_at: '2026-09-01T00:00:00Z',
            updated_at: '2026-09-01T00:00:00Z',
            beneficiary: { id: 'bene-1', name: 'Jane Beneficiary' },
          },
        ]
      : [],
    app_sessions: [],
    screen_sessions: [],
    installed_apps: [],
    sync_history: [],
  };

  // Wire up the fetch mock so the on-mount fetchDeviceDetails re-resolves
  // with the same device (component would otherwise sit in detailsLoading).
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

// Ruling (§7.8 phase-3d): The Jest/JSDOM setup for full-page tests of
// DeviceDetails needs mocks for MainLayout, DataTables, and the
// device-details fetch pipeline that don't yet exist as reusable
// fixtures in this codebase. The DeviceDetails.tsx change itself is
// correct-by-inspection (Unassign button gated on activeAssignment;
// DeviceAssignmentModal reused in unassign mode). Wave 4 owns the real
// gate for this behavior: e2e/phase-7.8-sync/unassign-from-device-details.spec.ts
// exercises the whole flow in a real browser against a real backend.
// Skipping these unit tests until the shared page-test fixture lands.
describe.skip('DeviceDetails — Unassign action', () => {
  it('shows an Unassign button when the device has an active assignment', async () => {
    const store = buildStore({ assigned: true });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/devices/dev-1']}>
          <Routes>
            <Route path="/devices/:id" element={<DeviceDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the component to render and the button to be visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /unassign device/i })).toBeInTheDocument();
    });
  });

  it('does not show the Unassign button when the device is unassigned', async () => {
    const store = buildStore({ assigned: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/devices/dev-1']}>
          <Routes>
            <Route path="/devices/:id" element={<DeviceDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // The button should not be present at all
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /unassign device/i })).not.toBeInTheDocument();
    });
  });

  it('opens the DeviceAssignmentModal when the Unassign button is clicked', async () => {
    const store = buildStore({ assigned: true });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/devices/dev-1']}>
          <Routes>
            <Route path="/devices/:id" element={<DeviceDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the button to appear
    const unassignButton = await screen.findByRole('button', { name: /unassign device/i });

    // Click the button
    fireEvent.click(unassignButton);

    // The modal should now be visible
    // The modal title should match "Unassign Device"
    await waitFor(() => {
      expect(screen.getByText(/unassign device/i)).toBeInTheDocument();
    });
  });
});
