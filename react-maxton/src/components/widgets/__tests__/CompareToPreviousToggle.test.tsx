import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompareToPreviousToggle from '../CompareToPreviousToggle';

test('renders as switch with label', () => {
  const onChange = jest.fn();
  render(<CompareToPreviousToggle value={false} onChange={onChange} />);
  const toggle = screen.getByRole('checkbox');
  expect(toggle).toBeInTheDocument();
  expect(screen.getByText('Compare to previous')).toBeInTheDocument();
});

test('uses custom label when provided', () => {
  const onChange = jest.fn();
  render(<CompareToPreviousToggle value={false} onChange={onChange} label="Custom Label" />);
  expect(screen.getByText('Custom Label')).toBeInTheDocument();
});

test('toggling fires onChange with negated value', () => {
  const onChange = jest.fn();
  render(<CompareToPreviousToggle value={false} onChange={onChange} />);
  const toggle = screen.getByRole('checkbox') as HTMLInputElement;
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith(true);
});

test('reflects checked state from value prop', () => {
  const onChange = jest.fn();
  const { rerender } = render(<CompareToPreviousToggle value={false} onChange={onChange} />);
  let toggle = screen.getByRole('checkbox') as HTMLInputElement;
  expect(toggle.checked).toBe(false);
  rerender(<CompareToPreviousToggle value={true} onChange={onChange} />);
  toggle = screen.getByRole('checkbox') as HTMLInputElement;
  expect(toggle.checked).toBe(true);
});
