import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RunsHistory from '../RunsHistory';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'abc' }),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

jest.mock('../../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mkStore = () => configureStore({
  reducer: {
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

const mockFetchDefinition = (name: string) => ({
  ok: true,
  json: () => Promise.resolve({ data: { id: 'abc', name } }),
} as any);

const mockFetchRuns = (data: any[]) => ({
  ok: true,
  json: () => Promise.resolve({ data }),
} as any);

const setupFetchMock = (defName: string, runs: any[]) => {
  (global.fetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes('/schedules/abc/runs?')) {
      return Promise.resolve(mockFetchRuns(runs));
    } else if (url.includes('/schedules/abc')) {
      return Promise.resolve(mockFetchDefinition(defName));
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as any);
  });
};

const renderRunsHistory = () => {
  render(
    <Provider store={mkStore()}>
      <RunsHistory />
    </Provider>,
  );
};

beforeEach(() => {
  jest.spyOn(global, 'fetch' as any).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
  } as any);
});

afterEach(() => jest.restoreAllMocks());

test('header shows definition name after fetch', async () => {
  setupFetchMock('Foo', []);
  renderRunsHistory();
  expect(await screen.findByRole('heading', { name: /Runs — Foo/ })).toBeInTheDocument();
});

test('delivered row shows Delivered, failed row shows Failed', async () => {
  const runs = [
    {
      id: '1',
      definition_id: 'abc',
      fired_at: '2026-09-14T10:00:00Z',
      delivered_at: '2026-09-14T10:05:00Z',
      delivery_error: null,
      artifact_key: 'report-123.pdf',
      artifact_url_expires_at: '2026-09-21T10:00:00Z',
      recipient_snapshot: ['alice@example.com'],
      created_at: '2026-09-14T10:00:00Z',
    },
    {
      id: '2',
      definition_id: 'abc',
      fired_at: '2026-09-13T10:00:00Z',
      delivered_at: null,
      delivery_error: 'SMTP failed',
      artifact_key: null,
      artifact_url_expires_at: null,
      recipient_snapshot: ['bob@example.com'],
      created_at: '2026-09-13T10:00:00Z',
    },
  ];
  setupFetchMock('Test Report', runs);
  renderRunsHistory();
  expect(await screen.findByText('Delivered')).toBeInTheDocument();
  expect(screen.getByText('Failed')).toBeInTheDocument();
});

test('expired artifact renders Download expired', async () => {
  const now = Date.now();
  const pastDate = new Date(now - 86400000).toISOString();
  const runs = [
    {
      id: '1',
      definition_id: 'abc',
      fired_at: '2026-09-14T10:00:00Z',
      delivered_at: '2026-09-14T10:05:00Z',
      delivery_error: null,
      artifact_key: 'report-123.pdf',
      artifact_url_expires_at: pastDate,
      recipient_snapshot: ['alice@example.com'],
      created_at: '2026-09-14T10:00:00Z',
    },
  ];
  setupFetchMock('Test Report', runs);
  renderRunsHistory();
  expect(await screen.findByText('Download expired')).toBeInTheDocument();
});

test('recipients count matches array length', async () => {
  const runs = [
    {
      id: '1',
      definition_id: 'abc',
      fired_at: '2026-09-14T10:00:00Z',
      delivered_at: '2026-09-14T10:05:00Z',
      delivery_error: null,
      artifact_key: 'report-123.pdf',
      artifact_url_expires_at: '2026-09-21T10:00:00Z',
      recipient_snapshot: ['alice@example.com', 'bob@example.com', 'charlie@example.com'],
      created_at: '2026-09-14T10:00:00Z',
    },
  ];
  setupFetchMock('Test Report', runs);
  renderRunsHistory();
  expect(await screen.findByText('3')).toBeInTheDocument();
});

test('empty runs shows empty state', async () => {
  setupFetchMock('Empty Report', []);
  renderRunsHistory();
  expect(await screen.findByText('No runs.')).toBeInTheDocument();
});
