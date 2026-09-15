import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalFilters from '../../../store/slices/globalFiltersSlice';
import BeneficiaryActivityDetailModal from '../BeneficiaryActivityDetailModal';

const mkStore = () => configureStore({
  reducer: {
    globalFilters,
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

const okResponse = {
  data: { widgets: { beneficiary_activity_rows: [
    { name: 'Alice', most_used_app: { name: 'YouTube', package: 'com.google.android.youtube' }, last_synced_at: '2026-09-14T12:34:56Z' },
    { name: 'Bob',   most_used_app: null, last_synced_at: null },
  ]}},
};

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: () => Promise.resolve(okResponse) } as any);
});
afterEach(() => jest.restoreAllMocks());

test('fetches with full=1 when shown and renders rows', async () => {
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show onHide={() => {}} /></Provider>);
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
  const call = (global.fetch as jest.Mock).mock.calls[0][0] as string;
  expect(call).toContain('full=1');
  expect(call).toContain('period=today');
});

test('does not fetch when show=false', async () => {
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show={false} onHide={() => {}} /></Provider>);
  await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.length).toBe(0));
});

test('renders empty message when no rows', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { widgets: { beneficiary_activity_rows: [] } } }) });
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show onHide={() => {}} /></Provider>);
  expect(await screen.findByText(/no beneficiary activity/i)).toBeInTheDocument();
});

test('renders percentile_rank: 72 as "72%"', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({
    data: { widgets: { beneficiary_activity_rows: [
      { name: 'Charlie', most_used_app: null, last_synced_at: null, percentile_rank: 72 },
    ]}}
  }) });
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show onHide={() => {}} /></Provider>);
  expect(await screen.findByText('Charlie')).toBeInTheDocument();
  expect(screen.getByText('72%')).toBeInTheDocument();
});

test('renders percentile_rank: null as "—"', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({
    data: { widgets: { beneficiary_activity_rows: [
      { name: 'David', most_used_app: null, last_synced_at: null, percentile_rank: null },
    ]}}
  }) });
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show onHide={() => {}} /></Provider>);
  expect(await screen.findByText('David')).toBeInTheDocument();
  // Verify percentile column is rendered with "—"
  const cells = screen.getAllByRole('row');
  expect(cells[cells.length - 1].textContent).toContain('—');
});

test('renders missing percentile_rank as "—"', async () => {
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({
    data: { widgets: { beneficiary_activity_rows: [
      { name: 'Eve', most_used_app: null, last_synced_at: null },
    ]}}
  }) });
  render(<Provider store={mkStore()}><BeneficiaryActivityDetailModal show onHide={() => {}} /></Provider>);
  expect(await screen.findByText('Eve')).toBeInTheDocument();
  // Verify percentile column is rendered with "—"
  const cells = screen.getAllByRole('row');
  expect(cells[cells.length - 1].textContent).toContain('—');
});
