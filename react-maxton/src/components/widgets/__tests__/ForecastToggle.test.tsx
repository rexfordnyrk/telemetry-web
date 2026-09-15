import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForecastToggle from '../ForecastToggle';

test('renders with default label "Forecast (14d)"', () => {
  const onChange = jest.fn();
  render(<ForecastToggle value={false} onChange={onChange} />);
  expect(screen.getByText('Forecast (14d)')).toBeInTheDocument();
});

test('custom horizonDays reflects in label', () => {
  const onChange = jest.fn();
  render(<ForecastToggle value={false} onChange={onChange} horizonDays={30} />);
  expect(screen.getByText('Forecast (30d)')).toBeInTheDocument();
});

test('custom label overrides default', () => {
  const onChange = jest.fn();
  render(<ForecastToggle value={false} onChange={onChange} horizonDays={30} label="Custom Forecast" />);
  expect(screen.queryByText('Forecast (30d)')).not.toBeInTheDocument();
  expect(screen.getByText('Custom Forecast')).toBeInTheDocument();
});

test('toggling fires onChange with negated value', () => {
  const onChange = jest.fn();
  render(<ForecastToggle value={false} onChange={onChange} />);
  const toggle = screen.getByRole('checkbox') as HTMLInputElement;
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith(true);
});

test('reflects checked state from value prop', () => {
  const onChange = jest.fn();
  const { rerender } = render(<ForecastToggle value={false} onChange={onChange} />);
  let toggle = screen.getByRole('checkbox') as HTMLInputElement;
  expect(toggle.checked).toBe(false);
  rerender(<ForecastToggle value={true} onChange={onChange} />);
  toggle = screen.getByRole('checkbox') as HTMLInputElement;
  expect(toggle.checked).toBe(true);
});
