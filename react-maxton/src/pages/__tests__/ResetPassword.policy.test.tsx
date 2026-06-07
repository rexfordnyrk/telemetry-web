import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../ResetPassword';
import { DEFAULT_PASSWORD_POLICY } from '../../utils/passwordPolicy';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockPolicyFetch() {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ...DEFAULT_PASSWORD_POLICY }),
  });
}

function renderResetPassword() {
  return render(<ResetPassword />);
}

describe('ResetPassword policy validation', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('shows validation errors before submit for weak password', async () => {
    mockPolicyFetch();

    renderResetPassword();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    expect(
      await screen.findByText(/must contain at least one uppercase letter/i),
    ).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('displays server violations array on 400 password_policy response', async () => {
    mockPolicyFetch();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'password_policy',
        description: 'Password does not meet requirements',
        violations: ['must contain at least one special character'],
      }),
    });

    renderResetPassword();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: 'ValidPass1!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'ValidPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    expect(
      await screen.findByText(/must contain at least one special character/i),
    ).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not submit when validatePassword returns errors', async () => {
    mockPolicyFetch();

    renderResetPassword();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await screen.findByRole('list', { name: /password requirements/i });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('shows policy hint text', async () => {
    mockPolicyFetch();

    renderResetPassword();

    expect(
      await screen.findByText(/uppercase/i, undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
  });
});
