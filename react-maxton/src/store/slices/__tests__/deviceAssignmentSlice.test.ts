import { configureStore } from '@reduxjs/toolkit';
import deviceAssignmentReducer, {
  fetchAssignmentsPage,
  unassignDevice,
  selectAssignmentsPageData,
  selectBasicStats,
  selectPagePagination,
  selectActivePageAssignments
} from '../deviceAssignmentSlice';
import { RootState } from '../../index';

// Mock the API configuration. ApiService.post (used by unassignDevice
// via deviceAssignmentsAPI) calls buildApiUrl(UNASSIGN(id)) so the
// UNASSIGN endpoint factory must be present here too.
jest.mock('../../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      DEVICE_ASSIGNMENTS: {
        PAGE: '/api/v1/devices/assignments/page',
        UNASSIGN: (id: string) => `/api/v1/devices/assignments/${id}/unassign`,
      }
    }
  },
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ 'Authorization': 'Bearer test-token' })
}));

// Mock the API error handler
jest.mock('../../../utils/apiUtils', () => ({
  handleApiError: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('deviceAssignmentSlice - fetchAssignmentsPage', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        deviceAssignments: deviceAssignmentReducer,
        auth: () => ({ token: 'test-token' })
      }
    });
    (fetch as jest.Mock).mockClear();
  });

  it('should handle fetchAssignmentsPage.pending', () => {
    store.dispatch(fetchAssignmentsPage.pending('', { page: 1, limit: 100 }));
    const state = store.getState() as RootState;
    
    expect(state.deviceAssignments.loading).toBe(true);
    expect(state.deviceAssignments.error).toBeNull();
  });

  it('should handle fetchAssignmentsPage.fulfilled', () => {
    const mockResponse = {
      data: {
        basic_stats: {
          total_assignments: 150,
          active_assignments: 120,
          available_devices: 30,
          unassigned_participants: 25
        },
        assignments: [
          {
            assignment_id: 'test-assignment-1',
            device_id: 'test-device-1',
            beneficiary_id: 'test-beneficiary-1',
            assigned_at: '2024-01-15T10:30:00Z',
            unassigned_at: null,
            assigned_by: 'admin@example.com',
            assignment_notes: 'Test assignment',
            assignment_is_active: true,
            assignment_created_at: '2024-01-15T10:30:00Z',
            assignment_updated_at: '2024-01-15T10:30:00Z',
            device_name: 'Test Device',
            mac_address: '00:11:22:33:44:55',
            android_version: 'Android 12',
            app_version: '1.0.0',
            device_organization: 'Test Org',
            device_programme: 'Test Programme',
            device_date_enrolled: '2024-01-10T00:00:00Z',
            last_synced: '2024-01-15T09:45:00Z',
            current_beneficiary_id: 'test-beneficiary-1',
            device_is_active: true,
            fingerprint: 'test-fingerprint',
            imei: '123456789012345',
            serial_number: 'ABC123DEF456',
            device_details: {
              manufacturer: 'Test Manufacturer',
              model: 'Test Model',
              screen_size: '6.2 inches'
            },
            device_created_at: '2024-01-10T08:00:00Z',
            device_updated_at: '2024-01-15T10:30:00Z',
            beneficiary_name: 'Test Beneficiary',
            beneficiary_email: 'test@example.com',
            beneficiary_phone: '+1234567890',
            beneficiary_photo: 'https://example.com/photo.jpg',
            beneficiary_organization: 'Test Org',
            beneficiary_district: 'Test District',
            beneficiary_programme: 'Test Programme',
            beneficiary_date_enrolled: '2024-01-05T00:00:00Z',
            current_device_id: 'test-device-1',
            beneficiary_is_active: true,
            beneficiary_created_at: '2024-01-05T08:00:00Z',
            beneficiary_updated_at: '2024-01-15T10:30:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 100,
          total: 150,
          total_pages: 2,
          has_next: true,
          has_prev: false
        }
      },
      searchParams: { page: 1, limit: 100 }
    };

    store.dispatch(fetchAssignmentsPage.fulfilled(mockResponse, '', { page: 1, limit: 100 }));
    const state = store.getState() as RootState;
    
    expect(state.deviceAssignments.loading).toBe(false);
    expect(state.deviceAssignments.error).toBeNull();
    expect(state.deviceAssignments.pageData).toHaveLength(1);
    expect(state.deviceAssignments.basicStats).toEqual(mockResponse.data.basic_stats);
    expect(state.deviceAssignments.pagePagination).toEqual(mockResponse.data.pagination);
  });

  it('should handle fetchAssignmentsPage.rejected', () => {
    const errorMessage = 'Failed to fetch assignments page data';
    store.dispatch(fetchAssignmentsPage.rejected(new Error(errorMessage), '', { page: 1, limit: 100 }, errorMessage));
    const state = store.getState() as RootState;
    
    expect(state.deviceAssignments.loading).toBe(false);
    expect(state.deviceAssignments.error).toBe(errorMessage);
  });

  it('fetchAssignmentsPage forwards search and filter params in the URL', async () => {
    // Phase 2: the page thunk must thread every filter through to the
    // backend — pre-fix it forwarded only page/limit and made the
    // quick search and Advanced Filters modal look inert.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { basic_stats: {}, assignments: [], pagination: {} },
      }),
    });

    await store.dispatch(
      fetchAssignmentsPage({
        search: 'galaxy',
        organization: 'GCL',
        is_active: true,
        page: 1,
        limit: 100,
      }) as any
    );

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('search=galaxy');
    expect(calledUrl).toContain('organization=GCL');
    expect(calledUrl).toContain('is_active=true');
    expect(calledUrl).toContain('page=1');
  });

  it('unassignDevice posts to /assignments/:id/unassign with the note under unassignment_note', async () => {
    // UAT bug 2: the backend's UnassignDeviceRequest binds JSON tag
    // "unassignment_note". The frontend used to send "note" which
    // was silently dropped — the audit row had no note. Verify the
    // body shape and the assignmentId-in-payload contract the
    // reducer now relies on (it used to dereference .device_id on
    // an undefined payload and crash the table loading state).
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Device unassigned successfully' }),
    });

    const action = await store.dispatch(
      unassignDevice({ assignmentId: 'uuid-1', note: 'returned damaged' }) as any
    );

    expect((action as any).type).toBe('deviceAssignments/unassignDevice/fulfilled');
    expect((action as any).payload).toEqual({ assignmentId: 'uuid-1' });
    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/v1/devices/assignments/uuid-1/unassign');
    const init = (fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(typeof init.body).toBe('string');
    expect(JSON.parse(init.body as string)).toEqual({ unassignment_note: 'returned damaged' });
  });

  it('unassignDevice.fulfilled clears loading and flips the row inactive', async () => {
    // UAT bug 2 regression: prior fulfilled reducer accessed
    // action.payload.device_id on an undefined payload, threw, and
    // Immer rolled back the entire reducer including loading=false —
    // leaving the table stuck on its spinner.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Device unassigned successfully' }),
    });

    // Seed page data so we can prove the row was mutated.
    store.dispatch({
      type: 'deviceAssignments/fetchAssignmentsPage/fulfilled',
      payload: {
        data: {
          basic_stats: {},
          assignments: [
            { assignment_id: 'uuid-1', assignment_is_active: true, device_name: 'A' },
            { assignment_id: 'uuid-2', assignment_is_active: true, device_name: 'B' },
          ],
          pagination: {},
        },
        searchParams: {},
      },
    });

    await store.dispatch(unassignDevice({ assignmentId: 'uuid-1', note: '' }) as any);

    const state = store.getState() as RootState;
    expect(state.deviceAssignments.loading).toBe(false);
    expect(state.deviceAssignments.error).toBeNull();
    const target = state.deviceAssignments.pageData.find((r: any) => r.assignment_id === 'uuid-1');
    expect(target?.assignment_is_active).toBe(false);
    expect(target?.unassigned_at).toBeTruthy();
    // Untouched row stays active.
    const other = state.deviceAssignments.pageData.find((r: any) => r.assignment_id === 'uuid-2');
    expect(other?.assignment_is_active).toBe(true);
  });

  it('should select assignments page data correctly', () => {
    const mockState = {
      deviceAssignments: {
        pageData: [
          {
            assignment_id: 'test-1',
            assignment_is_active: true,
            device_name: 'Test Device 1',
            beneficiary_name: 'Test Beneficiary 1'
          },
          {
            assignment_id: 'test-2',
            assignment_is_active: false,
            device_name: 'Test Device 2',
            beneficiary_name: 'Test Beneficiary 2'
          }
        ],
        basicStats: {
          total_assignments: 2,
          active_assignments: 1,
          available_devices: 5,
          unassigned_participants: 3
        },
        pagePagination: {
          page: 1,
          limit: 100,
          total: 2,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      }
    } as RootState;

    expect(selectAssignmentsPageData(mockState)).toHaveLength(2);
    expect(selectBasicStats(mockState)).toEqual(mockState.deviceAssignments.basicStats);
    expect(selectPagePagination(mockState)).toEqual(mockState.deviceAssignments.pagePagination);
    expect(selectActivePageAssignments(mockState)).toHaveLength(1);
  });
});
