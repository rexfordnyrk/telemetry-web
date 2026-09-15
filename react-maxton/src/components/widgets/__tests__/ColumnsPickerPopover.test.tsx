import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColumnsPickerPopover, { ColumnDef } from '../ColumnsPickerPopover';

const cols: ColumnDef[] = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];

beforeEach(() => localStorage.clear());

test('toggling a column persists and emits change', () => {
  const onChange = jest.fn();
  render(<ColumnsPickerPopover widgetId="w1" allColumns={cols}
    defaults={{ visibleColumns: ['a', 'b'], rowsPerPage: 10 }}
    onChange={onChange}
    trigger={<button>open</button>} />);
  fireEvent.click(screen.getByText('open'));
  fireEvent.click(screen.getByLabelText('A'));
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ visibleColumns: ['b'] }));
  const stored = JSON.parse(localStorage.getItem('widget:w1:columns')!);
  expect(stored).toEqual(['b']);
});

test('changing rows-per-page persists and emits change', () => {
  const onChange = jest.fn();
  render(<ColumnsPickerPopover widgetId="w1" allColumns={cols}
    defaults={{ visibleColumns: ['a', 'b'], rowsPerPage: 10 }}
    onChange={onChange}
    trigger={<button>open</button>} />);
  fireEvent.click(screen.getByText('open'));
  fireEvent.change(screen.getByLabelText(/rows per page/i), { target: { value: '25' } });
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ rowsPerPage: 25 }));
  expect(localStorage.getItem('widget:w1:rowsPerPage')).toBe('25');
});
