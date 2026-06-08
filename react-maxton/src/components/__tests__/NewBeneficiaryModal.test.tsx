import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NewBeneficiaryModal from '../NewBeneficiaryModal';
import beneficiaryReducer from '../../store/slices/beneficiarySlice';
import alertReducer from '../../store/slices/alertSlice';
import authReducer from '../../store/slices/authSlice';

// Mock the API configuration
jest.mock('../../config/api', () => ({
  buildApiUrl: (endpoint: string) => `http://localhost:8080${endpoint}`,
  getAuthHeaders: () => ({ Authorization: 'Bearer test-token' }),
}));

// Mock the API error handler
jest.mock('../../utils/apiUtils', () => ({
  handleApiError: jest.fn().mockResolvedValue('API error'),
}));

// Mock thunks so we can control return values
jest.mock('../../store/slices/beneficiarySlice', () => {
  const actual = jest.requireActual('../../store/slices/beneficiarySlice');
  return {
    __esModule: true,
    ...actual,
    fetchSimilarBeneficiaries: jest.fn(),
    createBeneficiary: jest.fn(),
    fetchBeneficiaryLookups: jest.fn(),
  };
});

import {
  fetchSimilarBeneficiaries,
  createBeneficiary,
  fetchBeneficiaryLookups,
} from '../../store/slices/beneficiarySlice';

global.fetch = jest.fn();

const createStore = (lookups: any = null) =>
  configureStore({
    reducer: {
      auth: authReducer,
      beneficiaries: beneficiaryReducer,
      alerts: alertReducer,
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
        beneficiaries: [],
        unassignedBeneficiaries: [],
        loading: false,
        unassignedLoading: false,
        error: null,
        unassignedError: null,
        loadingSingle: false,
        singleError: null,
        currentBeneficiary: null,
        pagination: null,
        lookups,
        lookupsLoading: false,
      },
    } as any,
  });

const MOCK_LOOKUPS = {
  districts: ['Accra', 'Kumasi'],
  organizations: ['Test Org', 'Org B'],
  programmes: ['DARE', 'Other'],
};

const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
    target: { name: 'name', value: 'Alice Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
    target: { name: 'email', value: 'alice@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter phone number'), {
    target: { name: 'phone', value: '0551234567' },
  });
  // district, organization, programme are now <select> elements; query by name attribute
  const dSel = document.querySelector('select[name="district"]') as HTMLSelectElement;
  const oSel = document.querySelector('select[name="organization"]') as HTMLSelectElement;
  const pSel = document.querySelector('select[name="programme"]') as HTMLSelectElement;
  if (dSel) fireEvent.change(dSel, { target: { value: 'Accra' } });
  if (oSel) fireEvent.change(oSel, { target: { value: 'Test Org' } });
  if (pSel) fireEvent.change(pSel, { target: { value: 'DARE' } });
};

describe('NewBeneficiaryModal', () => {
  beforeEach(() => {
    (fetchSimilarBeneficiaries as jest.Mock).mockReset();
    (createBeneficiary as jest.Mock).mockReset();
    (fetchBeneficiaryLookups as jest.Mock).mockReset();
    // Provide a default no-op so useEffect dispatch doesn't throw
    (fetchBeneficiaryLookups as jest.Mock).mockReturnValue({
      type: 'beneficiaries/fetchBeneficiaryLookups',
      unwrap: async () => ({ districts: [], organizations: [], programmes: [] }),
    });
  });

  it('renders the modal when show is true', () => {
    render(
      <Provider store={createStore()}>
        <NewBeneficiaryModal show={true} onHide={jest.fn()} />
      </Provider>
    );
    expect(screen.getByText('New Beneficiary Registration')).toBeInTheDocument();
  });

  it('shows confirm modal when similar beneficiaries are found', async () => {
    const mockMatches = [
      {
        id: 'b-existing',
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '0551234567',
        organization: 'Org A',
        district: 'Accra',
        programme: 'DARE',
        date_enrolled: '2024-01-01',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    // Make fetchSimilarBeneficiaries return matches
    (fetchSimilarBeneficiaries as jest.Mock).mockImplementation(() => ({
      type: 'beneficiaries/fetchSimilarBeneficiaries',
      unwrap: async () => mockMatches,
    }));

    render(
      <Provider store={createStore(MOCK_LOOKUPS)}>
        <NewBeneficiaryModal show={true} onHide={jest.fn()} />
      </Provider>
    );

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Register Beneficiary/i }));

    await waitFor(() => {
      expect(screen.getByText('Similar records found')).toBeInTheDocument();
    });

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('calls createBeneficiary when no similar beneficiaries found', async () => {
    // Make fetchSimilarBeneficiaries return empty
    (fetchSimilarBeneficiaries as jest.Mock).mockImplementation(() => ({
      type: 'beneficiaries/fetchSimilarBeneficiaries',
      unwrap: async () => [],
    }));

    (createBeneficiary as jest.Mock).mockImplementation(() => ({
      type: 'beneficiaries/createBeneficiary',
      unwrap: async () => ({
        id: 'new-b',
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
      }),
    }));

    render(
      <Provider store={createStore(MOCK_LOOKUPS)}>
        <NewBeneficiaryModal show={true} onHide={jest.fn()} />
      </Provider>
    );

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Register Beneficiary/i }));

    await waitFor(() => {
      expect(createBeneficiary).toHaveBeenCalled();
    });
  });

  it('shows validation errors when form fields are empty', async () => {
    render(
      <Provider store={createStore()}>
        <NewBeneficiaryModal show={true} onHide={jest.fn()} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Register Beneficiary/i }));

    await waitFor(() => {
      expect(fetchSimilarBeneficiaries).not.toHaveBeenCalled();
    });
  });

  it('renders date_enrolled field with default value', () => {
    render(
      <Provider store={createStore()}>
        <NewBeneficiaryModal show={true} onHide={jest.fn()} />
      </Provider>
    );

    const dateInput = screen.getByDisplayValue(new Date().toISOString().slice(0, 10));
    expect(dateInput).toBeInTheDocument();
  });
});
