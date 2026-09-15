import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalFilters from '../../store/slices/globalFiltersSlice';
import FiltersButton from '../FiltersButton';

const mkStore = () => configureStore({ reducer: { globalFilters, auth: () => ({}) as any } });

test('Custom range option shows DateRangePicker', () => {
  render(<Provider store={mkStore()}><FiltersButton /></Provider>);
  fireEvent.click(screen.getByRole('button', { name: /filters/i }));
  fireEvent.change(screen.getByLabelText(/period/i), { target: { value: 'custom' } });
  expect(screen.getByTestId('custom-range-picker')).toBeInTheDocument();
});

test('Done disabled while range invalid', () => {
  render(<Provider store={mkStore()}><FiltersButton /></Provider>);
  fireEvent.click(screen.getByRole('button', { name: /filters/i }));
  fireEvent.change(screen.getByLabelText(/period/i), { target: { value: 'custom' } });
  expect(screen.getByRole('button', { name: /done/i })).toBeDisabled();
});
