import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ScheduleReportModal, { ExistingDefinition } from '../ScheduleReportModal';

const mkStore = () => configureStore({
  reducer: {
    auth: (s = { token: 'tk' }) => s,
  } as any,
});

const mockDef: ExistingDefinition = {
  id: 'sched-1',
  name: 'Weekly Stats',
  report_type: 'connectivity',
  format: 'csv',
  cadence: {
    kind: 'weekly',
    time: '09:00',
    timezone: 'UTC',
    weekday: 1,
  },
  recipients: [{ kind: 'email', address: 'test@example.com' }],
  columns: ['device_mac', 'beneficiary_name'],
  filters: { period: 'week', programme: 'All', organisation: 'All', district: 'All' },
  is_enabled: true,
};

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  } as any);
});
afterEach(() => jest.restoreAllMocks());

test('Create mode: fields start blank/defaults', async () => {
  render(
    <Provider store={mkStore()}>
      <ScheduleReportModal
        show={true}
        onHide={() => {}}
        initial={undefined}
        onSaved={() => {}}
      />
    </Provider>
  );

  // Name field should be empty
  const nameInput = screen.getByLabelText('Report name') as HTMLInputElement;
  expect(nameInput.value).toBe('');

  // Report type should be beneficiary_activity
  const typeSelect = screen.getByLabelText('Report type') as HTMLSelectElement;
  expect(typeSelect.value).toBe('beneficiary_activity');

  // Format should be csv
  const formatSelect = screen.getByLabelText('Report format') as HTMLSelectElement;
  expect(formatSelect.value).toBe('csv');

  // Cadence kind should be daily (checked via the Frequency select)
  const frequencySelect = screen.getByLabelText('Cadence kind') as HTMLSelectElement;
  expect(frequencySelect.value).toBe('daily');
});

test('Switch to weekly reveals weekday selector', async () => {
  render(
    <Provider store={mkStore()}>
      <ScheduleReportModal
        show={true}
        onHide={() => {}}
        initial={undefined}
        onSaved={() => {}}
      />
    </Provider>
  );

  // Weekday select should NOT be visible initially (daily mode)
  let weekdaySelect = screen.queryByDisplayValue('1');
  // In daily mode, there's no weekday selector

  // Change frequency to weekly
  const frequencySelect = screen.getByLabelText('Cadence kind') as HTMLSelectElement;
  fireEvent.change(frequencySelect, { target: { value: 'weekly' } });

  // Now weekday select should appear
  await waitFor(() => {
    weekdaySelect = screen.getByLabelText('Cadence weekday') as HTMLSelectElement;
    expect(weekdaySelect).toBeInTheDocument();
  });
});

test('Save calls POST with expected body', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: { ...mockDef, id: 'new-id' } }),
  } as any);

  const onSavedMock = jest.fn();
  render(
    <Provider store={mkStore()}>
      <ScheduleReportModal
        show={true}
        onHide={() => {}}
        initial={undefined}
        onSaved={onSavedMock}
      />
    </Provider>
  );

  // Type a name
  const nameInput = screen.getByLabelText('Report name') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: 'My Report' } });

  // Add a recipient (via email)
  const recipientInput = screen.getByLabelText('Add recipient') as HTMLInputElement;
  fireEvent.change(recipientInput, { target: { value: 'test@example.com' } });
  const addBtn = screen.getByRole('button', { name: 'Add' });
  fireEvent.click(addBtn);

  // Wait for recipient to be added
  await waitFor(() => {
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  // Click Create button
  const createBtn = screen.getByRole('button', { name: 'Create' });
  fireEvent.click(createBtn);

  // Verify POST was called
  await waitFor(() => {
    const postCall = fetchMock.mock.calls.find(
      (call) => typeof call[0] === 'string' &&
                call[0].includes('/api/v1/reports/schedules') &&
                typeof call[1] === 'object' &&
                (call[1] as any)?.method === 'POST'
    );
    expect(postCall).toBeDefined();
    if (postCall) {
      const body = JSON.parse((postCall[1] as any)?.body ?? '{}');
      expect(body.name).toBe('My Report');
      expect(body.format).toBe('csv');
      expect(body.cadence.kind).toBe('daily');
      expect(body.recipients.length).toBeGreaterThan(0);
    }
  });
});

test('Server error renders inline', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    status: 400,
    json: () => Promise.resolve({ error: 'invalid report definition' }),
  } as any);

  const onSavedMock = jest.fn();
  render(
    <Provider store={mkStore()}>
      <ScheduleReportModal
        show={true}
        onHide={() => {}}
        initial={undefined}
        onSaved={onSavedMock}
      />
    </Provider>
  );

  // Type a name and add recipient
  const nameInput = screen.getByLabelText('Report name') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: 'My Report' } });

  const recipientInput = screen.getByLabelText('Add recipient') as HTMLInputElement;
  fireEvent.change(recipientInput, { target: { value: 'test@example.com' } });
  const addBtn = screen.getByRole('button', { name: 'Add' });
  fireEvent.click(addBtn);

  await waitFor(() => {
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  // Click Create to trigger the error
  const createBtn = screen.getByRole('button', { name: 'Create' });
  fireEvent.click(createBtn);

  // Error message should appear
  await waitFor(() => {
    expect(screen.getByText('invalid report definition')).toBeInTheDocument();
  });
});

test('Edit mode hydrates fields from initial', async () => {
  render(
    <Provider store={mkStore()}>
      <ScheduleReportModal
        show={true}
        onHide={() => {}}
        initial={mockDef}
        onSaved={() => {}}
      />
    </Provider>
  );

  // Wait for component to hydrate
  await waitFor(() => {
    // Name should be populated
    const nameInput = screen.getByDisplayValue('Weekly Stats') as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
  });

  // Type should be connectivity (check via the form select value)
  const typeSelect = screen.getByLabelText('Report type') as HTMLSelectElement;
  expect(typeSelect.value).toBe('connectivity');

  // Format should be csv
  const formatSelect = screen.getByLabelText('Report format') as HTMLSelectElement;
  expect(formatSelect.value).toBe('csv');

  // Cadence kind should be weekly
  const frequencySelect = screen.getByLabelText('Cadence kind') as HTMLSelectElement;
  expect(frequencySelect.value).toBe('weekly');

  // Recipients should be shown
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
});
