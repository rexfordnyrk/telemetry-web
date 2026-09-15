import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetShell } from '../WidgetShell';

test('renders spinner when loading', () => {
  render(<WidgetShell state="loading">child</WidgetShell>);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.queryByText('child')).not.toBeInTheDocument();
});

test('renders retry on error', () => {
  const onRetry = jest.fn();
  render(<WidgetShell state="error" errorMessage="boom" onRetry={onRetry}>child</WidgetShell>);
  expect(screen.getByText('boom')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /retry/i }));
  expect(onRetry).toHaveBeenCalled();
});

test('renders empty message', () => {
  render(<WidgetShell state="empty" emptyMessage="nothing here">child</WidgetShell>);
  expect(screen.getByText('nothing here')).toBeInTheDocument();
});

test('renders children when ok', () => {
  render(<WidgetShell state="ok">child</WidgetShell>);
  expect(screen.getByText('child')).toBeInTheDocument();
});
