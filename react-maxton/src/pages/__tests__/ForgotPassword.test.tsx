import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../ForgotPassword';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ForgotPassword', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('shows success message when reset request succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: 'If an account exists for that email, a reset link has been sent.',
      }),
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText('example@user.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/forgot-password'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'user@example.com' }),
        }),
      );
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /reset link has been sent/i,
    );
  });

  it('shows rate limit message when API returns 429', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'too_many_requests',
        error_description: 'Too many password reset requests. Please try again later.',
      }),
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText('example@user.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/try again later/i);
    expect(alert).toHaveClass('alert-danger');
  });

  it('shows server error message on other failed responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: 'server_error',
        error_description: 'Unable to process password reset request',
      }),
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText('example@user.com'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Unable to process password reset request/i,
    );
  });
});
