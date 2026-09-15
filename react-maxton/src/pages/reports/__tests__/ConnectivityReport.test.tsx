import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalFilters from '../../../store/slices/globalFiltersSlice';
import ConnectivityReport from '../ConnectivityReport';
import * as downloadCsvModule from '../../../utils/downloadCsv';

jest.mock('../../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mkStore = () => configureStore({
  reducer: {
    globalFilters,
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

const mockJson = {
  data: {
    rows: [{
      device_mac: 'AA:BB',
      programme: 'DARE',
      organisation: 'GCL',
      district: 'Ashanti',
      beneficiary_name: 'Alice',
      rx_bytes: 10485760,
      tx_bytes: 5242880,
      sync_count: 4,
      failed_sync_count: 1,
      last_sync_at: '2026-09-14T12:34:56Z',
    }],
    total: 1, limit: 25, offset: 0,
  },
};

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockJson),
  } as any);
});
afterEach(() => jest.restoreAllMocks());

test('renders rows with serialized period query', async () => {
  render(<Provider store={mkStore()}><ConnectivityReport /></Provider>);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  const call = (global.fetch as jest.Mock).mock.calls[0][0] as string;
  expect(call).toContain('period=today');
  expect(call).toContain('/api/v1/analytics/connectivity');
});

test('renders MB-formatted rx/tx totals', async () => {
  render(<Provider store={mkStore()}><ConnectivityReport /></Provider>);
  await screen.findByText('Alice');
  expect(screen.getByText(/10\.00 MB/)).toBeInTheDocument();
  expect(screen.getByText(/5\.00 MB/)).toBeInTheDocument();
});

test('export button calls downloadCsv with the CSV endpoint + current filters', async () => {
  const spy = jest.spyOn(downloadCsvModule, 'downloadCsv').mockResolvedValue(undefined);
  render(<Provider store={mkStore()}><ConnectivityReport /></Provider>);
  await screen.findByText('Alice');
  fireEvent.click(screen.getByRole('button', { name: /export csv/i }));
  expect(spy).toHaveBeenCalledWith(
    '/api/v1/analytics/export/connectivity.csv',
    expect.any(URLSearchParams),
    'tk',
  );
});

test('shows empty message when data.rows is empty', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true, json: () => Promise.resolve({ data: { rows: [], total: 0, limit: 25, offset: 0 } }),
  });
  render(<Provider store={mkStore()}><ConnectivityReport /></Provider>);
  expect(await screen.findByText(/no connectivity data/i)).toBeInTheDocument();
});
