import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Schedules, { ReportDefinition } from '../Schedules';

jest.mock('../../../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mkStore = () => configureStore({
  reducer: {
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

const mockDef: ReportDefinition = {
  id: 'sched-1',
  name: 'Weekly Stats',
  report_type: 'connectivity',
  format: 'pdf',
  cadence: {
    kind: 'weekly',
    time: '09:00',
    timezone: 'UTC',
    weekday: 1,
  },
  recipients: ['test@example.com'],
  is_enabled: true,
  next_run_at: '2026-09-22T09:00:00Z',
};

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [mockDef] }),
  } as any);
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('renders empty state with "No scheduled reports" message', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  } as any);
  render(
    <Provider store={mkStore()}>
      <MemoryRouter>
        <Schedules />
      </MemoryRouter>
    </Provider>
  );
  expect(await screen.findByText(/no scheduled reports/i)).toBeInTheDocument();
});

test('renders one row with name and humanized cadence', async () => {
  render(
    <Provider store={mkStore()}>
      <MemoryRouter>
        <Schedules />
      </MemoryRouter>
    </Provider>
  );
  expect(await screen.findByText('Weekly Stats')).toBeInTheDocument();
  expect(screen.getByText(/Weekly Mon 09:00 UTC/)).toBeInTheDocument();
});

test('toggle enabled calls GET then PUT with is_enabled flipped', async () => {
  const getRes = {
    ok: true,
    json: () => Promise.resolve({ data: mockDef }),
  };
  const putRes = {
    ok: true,
    json: () => Promise.resolve({ data: mockDef }),
  };
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url: any) => {
    if (typeof url === 'string' && url.includes('schedules/sched-1')) {
      if ((fetchSpy.mock.lastCall?.[1] as any)?.method === 'PUT') {
        return Promise.resolve(putRes as any);
      }
      return Promise.resolve(getRes as any);
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [mockDef] }) } as any);
  });

  render(
    <Provider store={mkStore()}>
      <MemoryRouter>
        <Schedules />
      </MemoryRouter>
    </Provider>
  );
  await screen.findByText('Weekly Stats');
  const switchEl = screen.getByRole('checkbox', { name: /toggle Weekly Stats/i });
  fireEvent.click(switchEl);

  await waitFor(() => {
    const putCall = fetchSpy.mock.calls.find(
      (call) => typeof call[1] === 'object' && (call[1] as any)?.method === 'PUT'
    );
    expect(putCall).toBeDefined();
    if (putCall) {
      const body = JSON.parse((putCall[1] as any)?.body ?? '{}');
      expect(body.is_enabled).toBe(false);
    }
  });
});

test('delete confirmation shows modal with name, then calls DELETE', async () => {
  const fetchMock = global.fetch as jest.Mock;

  render(
    <Provider store={mkStore()}>
      <MemoryRouter>
        <Schedules />
      </MemoryRouter>
    </Provider>
  );
  await screen.findByText('Weekly Stats');

  // Click Delete button (the one with trash icon, not the modal button)
  const deleteButtons = screen.getAllByRole('button');
  const deleteBtn = deleteButtons.find((btn) => btn.querySelector('i.bx-trash'));
  fireEvent.click(deleteBtn!);

  // Modal should show the name in strong tag
  await waitFor(() => {
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'strong' && content.includes('Weekly Stats');
    })).toBeInTheDocument();
  });

  // Count calls before delete
  const callCountBefore = fetchMock.mock.calls.length;

  // Click Delete in modal (the danger button - find the one that's not Cancel)
  const allButtons = screen.getAllByRole('button', { name: /delete/i });
  const modalDeleteBtn = allButtons[allButtons.length - 1]; // Last Delete button should be in modal
  fireEvent.click(modalDeleteBtn);

  // Wait for DELETE call to be made
  await waitFor(() => {
    const newCalls = fetchMock.mock.calls.slice(callCountBefore);
    const deleteCall = newCalls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('schedules/sched-1') &&
                 typeof call[1] === 'object' && (call[1] as any)?.method === 'DELETE'
    );
    expect(deleteCall).toBeDefined();
  }, { timeout: 3000 });
});

test('Run now button calls POST /:id/run', async () => {
  render(
    <Provider store={mkStore()}>
      <MemoryRouter>
        <Schedules />
      </MemoryRouter>
    </Provider>
  );
  await screen.findByText('Weekly Stats');

  const runBtn = screen.getByRole('button', { name: /run now/i });
  fireEvent.click(runBtn);

  await waitFor(() => {
    const runCall = (global.fetch as jest.Mock).mock.calls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('/run') &&
                 typeof call[1] === 'object' && (call[1] as any)?.method === 'POST'
    );
    expect(runCall).toBeDefined();
  });

  expect(window.alert).toHaveBeenCalled();
});
