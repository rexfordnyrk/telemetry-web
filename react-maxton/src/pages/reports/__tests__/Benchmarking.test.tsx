import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalFilters from '../../../store/slices/globalFiltersSlice';
import Benchmarking from '../Benchmarking';

jest.mock('../../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../components/SafeApexChart', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="chart">{JSON.stringify({ y: props.options?.annotations?.yaxis?.[0]?.y })}</div>,
}));

const mkStore = () => configureStore({
  reducer: {
    globalFilters,
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      data: [
        { programme: 'DARE', value: 45, all_programmes_avg: 50 },
        { programme: 'GCL', value: 55, all_programmes_avg: 50 },
      ],
    }),
  } as any);
});
afterEach(() => jest.restoreAllMocks());

test('fetches benchmark endpoint with the default metric (sync_count)', async () => {
  render(<Provider store={mkStore()}><Benchmarking /></Provider>);
  const call = (global.fetch as jest.Mock).mock.calls[0][0] as string;
  expect(call).toContain('metric=sync_count');
  expect(call).toContain('/api/v1/analytics/benchmark');
});

test('shows empty message when data array is empty', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  });
  render(<Provider store={mkStore()}><Benchmarking /></Provider>);
  expect(await screen.findByText(/no programme data for this filter/i)).toBeInTheDocument();
});

test('reference-line annotation contains the returned average', async () => {
  render(<Provider store={mkStore()}><Benchmarking /></Provider>);
  const chartDiv = await screen.findByTestId('chart');
  const data = JSON.parse(chartDiv.textContent || '{}');
  expect(data.y).toBe(50);
});
