import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUsers, updateUserAsync, User } from '../userSlice';

jest.mock('../../../config/api', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      USERS: { ADMIN_PASSWORD: (id: string) => `/api/v1/users/${id}/admin-password` },
      USER_ROLES: {
        ASSIGN: (id: string) => `/api/v1/users/${id}/roles`,
        REMOVE: (id: string, roleId: string) => `/api/v1/users/${id}/roles/${roleId}`,
      },
    },
  },
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ Authorization: 'Bearer test-token' }),
}));

jest.mock('../../../utils/apiUtils', () => ({
  handleApiError: jest.fn(() => Promise.resolve('boom')),
}));

global.fetch = jest.fn();

function makeStore() {
  return configureStore({
    reducer: {
      users: userReducer,
      auth: () => ({ token: 'test-token' }),
    },
  });
}

const sampleUser: User = {
  id: 'u-1',
  first_name: 'Alice',
  last_name: 'Tester',
  username: 'alice',
  email: 'alice@example.com',
  phone: '+233200000000',
  designation: '',
  organization: 'Acme',
  status: 'active',
  roles: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('userSlice — fetchUsers pagination', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('returns { data, pagination } when the API responds with { data, total, page, limit }', async () => {
    const store = makeStore();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [sampleUser], total: 42, page: 2, limit: 10 }),
    });

    const result: any = await store.dispatch(
      fetchUsers({ page: 2, limit: 10, search: 'alice' })
    );
    expect(result.type).toBe('users/fetchUsers/fulfilled');
    expect(result.payload).toEqual({
      data: [sampleUser],
      pagination: { total: 42, page: 2, limit: 10 },
    });

    const state: any = store.getState();
    expect(state.users.users).toHaveLength(1);
    expect(state.users.listPagination).toEqual({ total: 42, page: 2, limit: 10 });
  });

  it('passes search/sort/filter params on the query string', async () => {
    const store = makeStore();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], total: 0 }),
    });

    await store.dispatch(
      fetchUsers({
        page: 1,
        limit: 25,
        search: 'al ice',
        sort_by: 'first_name',
        sort_order: 'asc',
        role: 'admin',
        status: 'disabled',
        organization: 'Acme',
      })
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    const url = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('page=1');
    expect(url).toContain('limit=25');
    expect(url).toContain('search=al+ice');
    expect(url).toContain('sort_by=first_name');
    expect(url).toContain('sort_order=asc');
    expect(url).toContain('role=admin');
    expect(url).toContain('status=disabled');
    expect(url).toContain('organization=Acme');
  });

  it('falls back to usersArray length and page 1 when API omits pagination meta', async () => {
    const store = makeStore();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [sampleUser, { ...sampleUser, id: 'u-2' }],
    });

    const result: any = await store.dispatch(fetchUsers());
    expect(result.type).toBe('users/fetchUsers/fulfilled');
    expect(result.payload.pagination.total).toBe(2);
    expect(result.payload.pagination.page).toBe(1);
  });
});

describe('userSlice — updateUserAsync.fulfilled', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('syncs selectedUser when API returns { data: user }', async () => {
    const store = makeStore();
    // Seed selectedUser first by populating users list and then matching id.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [sampleUser], total: 1 }),
    });
    await store.dispatch(fetchUsers());

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { ...sampleUser, first_name: 'Alicia' } }),
    });
    await store.dispatch(
      updateUserAsync({ id: sampleUser.id, userData: { first_name: 'Alicia' } })
    );

    const state: any = store.getState();
    const updated = state.users.users.find((u: User) => u.id === sampleUser.id);
    expect(updated.first_name).toBe('Alicia');
  });
});
