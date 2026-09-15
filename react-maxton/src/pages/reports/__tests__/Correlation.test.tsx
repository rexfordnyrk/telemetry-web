import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';
import globalFilters from '../../../store/slices/globalFiltersSlice';
import Correlation from '../Correlation';

jest.mock('../../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../components/FiltersButton', () => ({
  __esModule: true,
  default: () => <div>FiltersButton</div>,
}));

jest.mock('../../../components/SafeApexChart', () => ({
  __esModule: true,
  default: ({ type, series }: any) => (
    <div data-testid="safe-apex-chart" data-type={type}>
      Chart
    </div>
  ),
}));

const mkStore = () => configureStore({
  reducer: {
    globalFilters,
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('fetches correlate endpoint with correct parameters', async () => {
  const mockJson = {
    data: {
      pairs: [],
      pearson: null,
      spearman: null,
    },
  };

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockJson),
  });

  render(
    <Router>
      <Provider store={mkStore()}>
        <Correlation />
      </Provider>
    </Router>
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  const call = (global.fetch as jest.Mock).mock.calls[0][0] as string;
  expect(call).toContain('/api/v1/analytics/correlate');
  expect(call).toContain('a=avg_screen_time');
  expect(call).toContain('b=data_usage');
});

test('shows empty state when pearson is null', async () => {
  const mockJson = {
    data: {
      pairs: [],
      pearson: null,
      spearman: null,
    },
  };

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockJson),
  });

  render(
    <Router>
      <Provider store={mkStore()}>
        <Correlation />
      </Provider>
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText(/Not enough data for correlation/)).toBeInTheDocument();
  });
});

test('renders Pearson coefficient in header', async () => {
  const mockJson = {
    data: {
      pairs: [
        { x: 10, y: 20, label: 'Beneficiary A' },
        { x: 15, y: 25, label: 'Beneficiary B' },
      ],
      pearson: 0.72,
      spearman: 0.65,
    },
  };

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockJson),
  });

  render(
    <Router>
      <Provider store={mkStore()}>
        <Correlation />
      </Provider>
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText('0.720')).toBeInTheDocument();
  });
});

test('refetches when Metric A changes', async () => {
  const mockJson = {
    data: {
      pairs: [
        { x: 10, y: 20, label: 'Beneficiary A' },
      ],
      pearson: 0.72,
      spearman: 0.65,
    },
  };

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockJson),
  });

  render(
    <Router>
      <Provider store={mkStore()}>
        <Correlation />
      </Provider>
    </Router>
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  const metricASelect = screen.getByLabelText('Metric A');
  fireEvent.change(metricASelect, { target: { value: 'sync_count' } });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  const secondCall = (global.fetch as jest.Mock).mock.calls[1][0] as string;
  expect(secondCall).toContain('a=sync_count');
});
