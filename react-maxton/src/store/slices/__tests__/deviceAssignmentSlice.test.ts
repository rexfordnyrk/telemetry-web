import { configureStore } from '@reduxjs/toolkit';
import deviceAssignmentReducer, {
  fetchAssignmentsPage,
  selectAssignmentsPageData,
  selectBasicStats,
  selectPagePagination,
  selectActivePageAssignments
} from '../deviceAssignmentSlice';
import { RootState } from '../../index';

// Mock the API configuration
jest.mock('../../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      DEVICE_ASSIGNMENTS: {
        PAGE: '/api/v1/devices/assignments/page'
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
