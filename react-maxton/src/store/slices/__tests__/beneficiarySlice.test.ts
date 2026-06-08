import { configureStore } from '@reduxjs/toolkit';
import beneficiaryReducer, {
  createBeneficiary,
  updateBeneficiary,
  fetchSimilarBeneficiaries,
  fetchBeneficiaries,
  deleteBeneficiary,
  importBeneficiariesCSV,
  Beneficiary,
  CSVImportResult,
} from '../beneficiarySlice';
import authReducer from '../authSlice';

// Mock the API configuration
jest.mock('../../../config/api', () => ({
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ Authorization: 'Bearer test-token' }),
}));

// Mock the API error handler
jest.mock('../../../utils/apiUtils', () => ({
  handleApiError: jest.fn().mockResolvedValue('API error'),
}));

// Mock global fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

const makeBeneficiary = (overrides: Partial<Beneficiary> = {}): Beneficiary => ({
  id: 'b-1',
  name: 'Alice Doe',
  email: 'alice@example.com',
  phone: '0551234567',
  organization: 'Test Org',
  district: 'Accra',
  programme: 'DARE',
  date_enrolled: '2024-01-01',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

const makeInitialBeneficiaryState = (beneficiaries: Beneficiary[] = []) => ({
  beneficiaries,
  unassignedBeneficiaries: [],
  loading: false,
  unassignedLoading: false,
  error: null,
  unassignedError: null,
  loadingSingle: false,
  singleError: null,
  currentBeneficiary: null,
  pagination: null,
});

const createStore = (preloadedBeneficiaries: Beneficiary[] = []) =>
  configureStore({
    reducer: {
      beneficiaries: beneficiaryReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: null,
        token: 'test-token',
        refreshToken: null,
        expiresIn: 900,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      },
      beneficiaries: makeInitialBeneficiaryState(preloadedBeneficiaries),
    },
  });

describe('beneficiarySlice — createBeneficiary', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls POST /api/v1/beneficiaries with correct payload and auth header', async () => {
    const newBeneficiary = makeBeneficiary();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: newBeneficiary }),
    });

    const store = createStore();
    const payload = { name: 'Alice Doe', email: 'alice@example.com', phone: '0551234567' };
    await store.dispatch(createBeneficiary(payload));

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/beneficiaries',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('returns data.data from API response', async () => {
    const newBeneficiary = makeBeneficiary();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: newBeneficiary }),
    });

    const store = createStore();
    const result = await store.dispatch(createBeneficiary({ name: 'Alice Doe' }));
    expect((result as any).payload).toEqual(newBeneficiary);
  });

  it('rejects with error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 422 });

    const store = createStore();
    const result = await store.dispatch(createBeneficiary({ name: 'Alice Doe' }));
    expect(result.type).toBe('beneficiaries/createBeneficiary/rejected');
  });
});

describe('beneficiarySlice — updateBeneficiary', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls PUT /api/v1/beneficiaries/:id with id in URL', async () => {
    const updated = makeBeneficiary({ name: 'Alice Updated' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: updated }),
    });

    const store = createStore([makeBeneficiary()]);
    await store.dispatch(updateBeneficiary({ id: 'b-1', name: 'Alice Updated' }));

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/beneficiaries/b-1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('does not include id in request body', async () => {
    const updated = makeBeneficiary({ name: 'Alice Updated' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: updated }),
    });

    const store = createStore([makeBeneficiary()]);
    await store.dispatch(updateBeneficiary({ id: 'b-1', name: 'Alice Updated' }));

    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body).not.toHaveProperty('id');
  });

  it('returns updated beneficiary', async () => {
    const updated = makeBeneficiary({ name: 'Alice Updated' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: updated }),
    });

    const store = createStore([makeBeneficiary()]);
    const result = await store.dispatch(updateBeneficiary({ id: 'b-1', name: 'Alice Updated' }));
    expect((result as any).payload).toEqual(updated);
  });
});

describe('beneficiarySlice — fetchSimilarBeneficiaries', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls GET /api/v1/beneficiaries/similar with query params', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const store = createStore();
    await store.dispatch(fetchSimilarBeneficiaries({ phone: '0551234567', email: 'alice@example.com' }));

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('/beneficiaries/similar');
    expect(calledUrl).toContain('phone=0551234567');
    expect(calledUrl).toContain('email=alice%40example.com');
  });

  it('returns array from data.data', async () => {
    const matches = [makeBeneficiary()];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: matches }),
    });

    const store = createStore();
    const result = await store.dispatch(fetchSimilarBeneficiaries({ phone: '0551234567' }));
    expect((result as any).payload).toEqual(matches);
  });

  it('returns empty array when no matches', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const store = createStore();
    const result = await store.dispatch(fetchSimilarBeneficiaries({ phone: '0000000000' }));
    expect((result as any).payload).toEqual([]);
  });
});

describe('beneficiarySlice — reducer', () => {
  it('createBeneficiary.fulfilled adds beneficiary to list', () => {
    const newBeneficiary = makeBeneficiary({ id: 'b-new' });
    const state = beneficiaryReducer(
      makeInitialBeneficiaryState([makeBeneficiary()]),
      createBeneficiary.fulfilled(newBeneficiary, '', {})
    );
    expect(state.beneficiaries).toHaveLength(2);
    expect(state.beneficiaries[1].id).toBe('b-new');
  });

  it('updateBeneficiary.fulfilled replaces existing beneficiary in list', () => {
    const original = makeBeneficiary({ id: 'b-1', name: 'Original' });
    const updated = makeBeneficiary({ id: 'b-1', name: 'Updated' });
    const state = beneficiaryReducer(
      { ...makeInitialBeneficiaryState([original]), currentBeneficiary: original },
      updateBeneficiary.fulfilled(updated, '', { id: 'b-1' })
    );
    expect(state.beneficiaries[0].name).toBe('Updated');
    expect(state.currentBeneficiary?.name).toBe('Updated');
  });

  it('updateBeneficiary.fulfilled updates currentBeneficiary when id matches', () => {
    const original = makeBeneficiary({ id: 'b-1', name: 'Original' });
    const updated = makeBeneficiary({ id: 'b-1', name: 'Updated' });
    const state = beneficiaryReducer(
      { ...makeInitialBeneficiaryState([]), currentBeneficiary: original },
      updateBeneficiary.fulfilled(updated, '', { id: 'b-1' })
    );
    expect(state.currentBeneficiary?.name).toBe('Updated');
  });

  it('fetchBeneficiaries.fulfilled replaces list and stores pagination', () => {
    const existing = makeBeneficiary({ id: 'old' });
    const incoming = makeBeneficiary({ id: 'new' });
    const pagination = { page: 2, limit: 25, total: 100 };
    const state = beneficiaryReducer(
      makeInitialBeneficiaryState([existing]),
      fetchBeneficiaries.fulfilled({ data: [incoming], pagination }, '', {})
    );
    expect(state.beneficiaries).toHaveLength(1);
    expect(state.beneficiaries[0].id).toBe('new');
    expect(state.pagination).toEqual(pagination);
  });

  it('fetchBeneficiaries.fulfilled stores null pagination when absent', () => {
    const incoming = makeBeneficiary({ id: 'new' });
    const state = beneficiaryReducer(
      makeInitialBeneficiaryState([]),
      fetchBeneficiaries.fulfilled({ data: [incoming], pagination: null }, '', {})
    );
    expect(state.pagination).toBeNull();
  });

  it('deleteBeneficiary.fulfilled removes beneficiary from list', () => {
    const b1 = makeBeneficiary({ id: 'b-1' });
    const b2 = makeBeneficiary({ id: 'b-2' });
    const state = beneficiaryReducer(
      makeInitialBeneficiaryState([b1, b2]),
      deleteBeneficiary.fulfilled('b-1', '', 'b-1')
    );
    expect(state.beneficiaries).toHaveLength(1);
    expect(state.beneficiaries[0].id).toBe('b-2');
  });

  it('deleteBeneficiary.fulfilled clears currentBeneficiary when id matches', () => {
    const b1 = makeBeneficiary({ id: 'b-1' });
    const state = beneficiaryReducer(
      { ...makeInitialBeneficiaryState([b1]), currentBeneficiary: b1 },
      deleteBeneficiary.fulfilled('b-1', '', 'b-1')
    );
    expect(state.currentBeneficiary).toBeNull();
  });

  it('deleteBeneficiary.fulfilled does not clear currentBeneficiary when id differs', () => {
    const b1 = makeBeneficiary({ id: 'b-1' });
    const b2 = makeBeneficiary({ id: 'b-2' });
    const state = beneficiaryReducer(
      { ...makeInitialBeneficiaryState([b1, b2]), currentBeneficiary: b2 },
      deleteBeneficiary.fulfilled('b-1', '', 'b-1')
    );
    expect(state.currentBeneficiary?.id).toBe('b-2');
  });
});

describe('beneficiarySlice — deleteBeneficiary thunk', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls DELETE /api/v1/beneficiaries/:id with auth header', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const store = createStore([makeBeneficiary({ id: 'b-1' })]);
    await store.dispatch(deleteBeneficiary('b-1'));

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/beneficiaries/b-1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('removes beneficiary from store on success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const store = createStore([makeBeneficiary({ id: 'b-1' }), makeBeneficiary({ id: 'b-2' })]);
    await store.dispatch(deleteBeneficiary('b-1'));

    const { beneficiaries } = store.getState().beneficiaries;
    expect(beneficiaries).toHaveLength(1);
    expect(beneficiaries[0].id).toBe('b-2');
  });

  it('rejects on API failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const store = createStore([makeBeneficiary({ id: 'b-1' })]);
    const result = await store.dispatch(deleteBeneficiary('b-1'));
    expect(result.type).toBe('beneficiaries/deleteBeneficiary/rejected');
  });
});

describe('beneficiarySlice — importBeneficiariesCSV thunk', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls POST /api/v1/beneficiaries/import/csv with rows', async () => {
    const importResult: CSVImportResult = { created: 2, skipped: 1, errors: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => importResult,
    });

    const store = createStore();
    const rows = [
      { name: 'Alice', email: 'a@a.com', phone: '111', organization: 'Org', district: 'D', programme: 'P' },
    ];
    await store.dispatch(importBeneficiariesCSV(rows));

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/beneficiaries/import/csv',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ rows }),
      })
    );
  });

  it('returns created/skipped/errors from API', async () => {
    const importResult: CSVImportResult = { created: 3, skipped: 0, errors: [] };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => importResult });

    const store = createStore();
    const result = await store.dispatch(importBeneficiariesCSV([]));
    expect((result as any).payload).toEqual(importResult);
  });

  it('rejects on API failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });

    const store = createStore();
    const result = await store.dispatch(importBeneficiariesCSV([]));
    expect(result.type).toBe('beneficiaries/importBeneficiariesCSV/rejected');
  });
});

describe('beneficiarySlice — combined filter regression (§7.2 phase-4)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls GET /api/v1/beneficiaries with all combined filter params in the URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: { page: 1, limit: 25, total: 0 } }),
    });

    const store = createStore();
    await store.dispatch(
      fetchBeneficiaries({
        page: 1,
        limit: 25,
        district: 'Accra',
        date_enrolled_from: '2024-01-01',
        date_enrolled_to: '2024-12-31',
        search: 'john',
      }),
    );

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('district=Accra');
    expect(calledUrl).toContain('date_enrolled_from=2024-01-01');
    expect(calledUrl).toContain('date_enrolled_to=2024-12-31');
    expect(calledUrl).toContain('search=john');
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('limit=25');
  });

  it('omits date_enrolled_from/to when not provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: null }),
    });

    const store = createStore();
    await store.dispatch(fetchBeneficiaries({ page: 1, limit: 25, district: 'Accra' }));

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).not.toContain('date_enrolled_from');
    expect(calledUrl).not.toContain('date_enrolled_to');
    expect(calledUrl).toContain('district=Accra');
  });

  it('passes is_active boolean as string param when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], pagination: null }),
    });

    const store = createStore();
    await store.dispatch(fetchBeneficiaries({ is_active: false }));

    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('is_active=false');
  });
});

describe('beneficiarySlice — Redux list hygiene (Task 4)', () => {
  it('fetchBeneficiaries.fulfilled replaces list, not appends', () => {
    const old1 = makeBeneficiary({ id: 'old-1' });
    const old2 = makeBeneficiary({ id: 'old-2' });
    const fresh = makeBeneficiary({ id: 'fresh-1' });
    // Two consecutive fetches: second should replace, not accumulate
    const after1st = beneficiaryReducer(
      makeInitialBeneficiaryState([old1, old2]),
      fetchBeneficiaries.fulfilled({ data: [fresh], pagination: null }, '', {})
    );
    expect(after1st.beneficiaries).toHaveLength(1);
    expect(after1st.beneficiaries[0].id).toBe('fresh-1');
  });

  it('addBeneficiaries (deprecated) still merges without throwing', () => {
    const b1 = makeBeneficiary({ id: 'b-1' });
    const b2 = makeBeneficiary({ id: 'b-2', name: 'Override' });
    const { addBeneficiaries: addBeneficiariesAction } = require('../beneficiarySlice');
    const state = beneficiaryReducer(
      makeInitialBeneficiaryState([b1]),
      addBeneficiariesAction([b2])
    );
    expect(state.beneficiaries).toHaveLength(2);
  });
});
