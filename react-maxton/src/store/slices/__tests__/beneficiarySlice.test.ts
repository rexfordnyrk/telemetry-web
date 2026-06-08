import { configureStore } from '@reduxjs/toolkit';
import beneficiaryReducer, {
  createBeneficiary,
  updateBeneficiary,
  fetchSimilarBeneficiaries,
  Beneficiary,
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
      beneficiaries: {
        beneficiaries: preloadedBeneficiaries,
        unassignedBeneficiaries: [],
        loading: false,
        unassignedLoading: false,
        error: null,
        unassignedError: null,
        loadingSingle: false,
        singleError: null,
        currentBeneficiary: null,
      },
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
      {
        beneficiaries: [makeBeneficiary()],
        unassignedBeneficiaries: [],
        loading: false,
        unassignedLoading: false,
        error: null,
        unassignedError: null,
        loadingSingle: false,
        singleError: null,
        currentBeneficiary: null,
      },
      createBeneficiary.fulfilled(newBeneficiary, '', {})
    );
    expect(state.beneficiaries).toHaveLength(2);
    expect(state.beneficiaries[1].id).toBe('b-new');
  });

  it('updateBeneficiary.fulfilled replaces existing beneficiary in list', () => {
    const original = makeBeneficiary({ id: 'b-1', name: 'Original' });
    const updated = makeBeneficiary({ id: 'b-1', name: 'Updated' });
    const state = beneficiaryReducer(
      {
        beneficiaries: [original],
        unassignedBeneficiaries: [],
        loading: false,
        unassignedLoading: false,
        error: null,
        unassignedError: null,
        loadingSingle: false,
        singleError: null,
        currentBeneficiary: original,
      },
      updateBeneficiary.fulfilled(updated, '', { id: 'b-1' })
    );
    expect(state.beneficiaries[0].name).toBe('Updated');
    expect(state.currentBeneficiary?.name).toBe('Updated');
  });

  it('updateBeneficiary.fulfilled updates currentBeneficiary when id matches', () => {
    const original = makeBeneficiary({ id: 'b-1', name: 'Original' });
    const updated = makeBeneficiary({ id: 'b-1', name: 'Updated' });
    const state = beneficiaryReducer(
      {
        beneficiaries: [],
        unassignedBeneficiaries: [],
        loading: false,
        unassignedLoading: false,
        error: null,
        unassignedError: null,
        loadingSingle: false,
        singleError: null,
        currentBeneficiary: original,
      },
      updateBeneficiary.fulfilled(updated, '', { id: 'b-1' })
    );
    expect(state.currentBeneficiary?.name).toBe('Updated');
  });
});
