import { configureStore } from '@reduxjs/toolkit';
import deviceReducer, { fetchDevices } from '../deviceSlice';
import type { RootState } from '../../index';

// Phase 2: fetchDevices must surface server pagination so the
// DataTable shows correct totals and last-page numbers. Pre-fix it
// returned the raw array and the Devices page estimated total from
// page size (DEF-028 / DEF-036–037 pagination tail).
jest.mock('../../../config/api', () => ({
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ Authorization: 'Bearer test-token' }),
}));

jest.mock('../../../utils/apiUtils', () => ({
  handleApiError: jest.fn(async () => 'mocked api error'),
}));

global.fetch = jest.fn();

function makeStore() {
  return configureStore({
    reducer: {
      devices: deviceReducer,
      auth: () => ({ token: 'test-token' }),
    },
  });
}

describe('deviceSlice - fetchDevices', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('passes search and pagination params to the API', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ id: '1', device_name: 'Galaxy A12' }],
        pagination: { total: 1, page: 1, limit: 50 },
      }),
    });

    const store = makeStore();
    await store.dispatch(
      fetchDevices({ page: 1, limit: 50, search: 'galaxy', organization: 'GCL' }) as any
    );

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('limit=50');
    expect(calledUrl).toContain('search=galaxy');
    expect(calledUrl).toContain('organization=GCL');
  });

  it('stores server pagination metadata on fulfilled', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ id: '1', device_name: 'A' }, { id: '2', device_name: 'B' }],
        pagination: { total: 142, page: 1, limit: 50 },
      }),
    });

    const store = makeStore();
    await store.dispatch(fetchDevices({ page: 1, limit: 50 }) as any);

    const state = store.getState() as RootState;
    expect(state.devices.devices).toHaveLength(2);
    expect(state.devices.listPagination).toEqual({ total: 142, page: 1, limit: 50 });
  });

  it('falls back to local total when API omits pagination', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: '1', device_name: 'A' }] }),
    });

    const store = makeStore();
    await store.dispatch(fetchDevices({ page: 1, limit: 50 }) as any);

    const state = store.getState() as RootState;
    expect(state.devices.listPagination?.total).toBe(1);
    expect(state.devices.listPagination?.page).toBe(1);
    expect(state.devices.listPagination?.limit).toBe(50);
  });
});
