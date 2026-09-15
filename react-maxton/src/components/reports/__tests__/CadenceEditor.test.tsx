import { render, screen, fireEvent } from '@testing-library/react';
import CadenceEditor, { Cadence } from '../CadenceEditor';

const daily: Cadence = { kind: 'daily', time: '09:00', timezone: 'UTC' };

describe('CadenceEditor', () => {
  test('hides weekday when daily', () => {
    render(<CadenceEditor value={daily} onChange={() => {}} />);
    expect(screen.queryByLabelText('Cadence weekday')).toBeNull();
  });

  test('hides day of month when daily', () => {
    render(<CadenceEditor value={daily} onChange={() => {}} />);
    expect(screen.queryByLabelText('Cadence day of month')).toBeNull();
  });

  test('shows weekday select when weekly with 7 options', () => {
    const weekly: Cadence = { kind: 'weekly', time: '09:00', timezone: 'UTC', weekday: 1 };
    render(<CadenceEditor value={weekly} onChange={() => {}} />);
    const weekdaySelect = screen.getByLabelText('Cadence weekday');
    expect(weekdaySelect).toBeInTheDocument();
    const options = weekdaySelect.querySelectorAll('option');
    expect(options).toHaveLength(7);
  });

  test('hides day of month when weekly', () => {
    const weekly: Cadence = { kind: 'weekly', time: '09:00', timezone: 'UTC', weekday: 1 };
    render(<CadenceEditor value={weekly} onChange={() => {}} />);
    expect(screen.queryByLabelText('Cadence day of month')).toBeNull();
  });

  test('shows day of month select when monthly with 28 options', () => {
    const monthly: Cadence = { kind: 'monthly', time: '09:00', timezone: 'UTC', dayOfMonth: 1 };
    render(<CadenceEditor value={monthly} onChange={() => {}} />);
    const daySelect = screen.getByLabelText('Cadence day of month');
    expect(daySelect).toBeInTheDocument();
    const options = daySelect.querySelectorAll('option');
    expect(options).toHaveLength(28);
  });

  test('hides weekday when monthly', () => {
    const monthly: Cadence = { kind: 'monthly', time: '09:00', timezone: 'UTC', dayOfMonth: 1 };
    render(<CadenceEditor value={monthly} onChange={() => {}} />);
    expect(screen.queryByLabelText('Cadence weekday')).toBeNull();
  });

  test('editing time fires onChange with new time', () => {
    const onChange = jest.fn();
    render(<CadenceEditor value={daily} onChange={onChange} />);
    const timeInput = screen.getByLabelText('Cadence time') as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: '14:30' } });
    expect(onChange).toHaveBeenCalledWith({
      kind: 'daily',
      time: '14:30',
      timezone: 'UTC',
    });
  });

  test('editing timezone fires onChange with new timezone', () => {
    const onChange = jest.fn();
    render(<CadenceEditor value={daily} onChange={onChange} />);
    const tzSelect = screen.getByLabelText('Cadence timezone') as HTMLSelectElement;
    fireEvent.change(tzSelect, { target: { value: 'America/New_York' } });
    expect(onChange).toHaveBeenCalledWith({
      kind: 'daily',
      time: '09:00',
      timezone: 'America/New_York',
    });
  });

  test('switching from daily to weekly shows weekday', () => {
    const onChange = jest.fn();
    const { rerender } = render(<CadenceEditor value={daily} onChange={onChange} />);
    const kindSelect = screen.getByLabelText('Cadence kind') as HTMLSelectElement;
    fireEvent.change(kindSelect, { target: { value: 'weekly' } });

    const weekly: Cadence = { kind: 'weekly', time: '09:00', timezone: 'UTC' };
    rerender(<CadenceEditor value={weekly} onChange={onChange} />);

    expect(screen.getByLabelText('Cadence weekday')).toBeInTheDocument();
  });

  test('switching from daily to monthly shows day of month', () => {
    const onChange = jest.fn();
    const { rerender } = render(<CadenceEditor value={daily} onChange={onChange} />);
    const kindSelect = screen.getByLabelText('Cadence kind') as HTMLSelectElement;
    fireEvent.change(kindSelect, { target: { value: 'monthly' } });

    const monthly: Cadence = { kind: 'monthly', time: '09:00', timezone: 'UTC' };
    rerender(<CadenceEditor value={monthly} onChange={onChange} />);

    expect(screen.getByLabelText('Cadence day of month')).toBeInTheDocument();
  });
});
