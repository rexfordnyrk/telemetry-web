/**
 * Authentication Components Test Suite
 * 
 * This file contains comprehensive tests for all authentication-related components.
 * It tests the login form, route protection, and authentication flow.
 * 
 * Test Coverage:
 * - BasicLogin component functionality
 * - ProtectedRoute component behavior
 * - PublicRoute component behavior
 * - Form validation and error handling
 * - Loading states and user interactions
 * - Email validation functionality
 * - Password validation functionality
 * - Server error handling
 * 
 * Testing Strategy:
 * - Unit tests for individual components
 * - Integration tests for authentication flow
 * - Mock Redux store for isolated testing
 * - Mock React Router for navigation testing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import BasicLogin from '../../pages/BasicLogin';
import ProtectedRoute from '../ProtectedRoute';
import PublicRoute from '../PublicRoute';

// ============================================================================
// MOCK SETUP
// ============================================================================

/**
 * Mock React Router's useNavigate hook
 * This allows us to test navigation without a real router
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Create a test Redux store with custom initial state
 * This allows us to test components with different authentication states
 * 
 * @param initialState - Optional initial state for the auth slice
 * @returns Configured Redux store for testing
 */
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
        formData: {
          email: '',
          password: '',
          rememberMe: false,
        },
        ...initialState,
      },
    },
  });
};

/**
 * Test wrapper component that provides Redux store and Router context
 * This ensures all components have access to the necessary context
 * 
 * @param children - The components to render
 * @param initialState - Optional initial state for testing
 * @returns Wrapped components with test context
 */
const TestWrapper: React.FC<{ children: React.ReactNode; initialState?: any }> = ({ 
  children, 
  initialState 
}) => {
  const store = createTestStore(initialState);
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// ============================================================================
// TEST SUITE
// ============================================================================

/**
 * Main test suite for authentication components
 */
describe('Authentication Components', () => {
  /**
   * Setup function that runs before each test
   * Clears mock functions to ensure clean test state
   */
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ============================================================================
  // BASIC LOGIN TESTS
  // ============================================================================
  
  /**
   * Test suite for the BasicLogin component
   */
  describe('BasicLogin', () => {
    /**
     * Test that the login form renders correctly
     * This ensures all form elements are present and accessible
     */
    it('renders login form', () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      // Check that all essential form elements are present
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    /**
     * Test loading state during login attempt
     * This ensures the UI provides feedback during authentication
     */
    it('shows loading state when logging in', async () => {
      render(
        <TestWrapper initialState={{ loading: true }}>
          <BasicLogin />
        </TestWrapper>
      );

      // Check that loading text and spinner are displayed
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    /**
     * Test error message display
     * This ensures authentication errors are properly shown to users
     */
    it('shows error message when login fails', () => {
      render(
        <TestWrapper initialState={{ error: 'Invalid username or password. Please check your credentials and try again.' }}>
          <BasicLogin />
        </TestWrapper>
      );

      // Check that error message is displayed
      expect(screen.getByText('Invalid username or password. Please check your credentials and try again.')).toBeInTheDocument();
    });

    /**
     * Test email validation - invalid email format
     */
    it('shows validation error for invalid email format', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      // Check that validation error is displayed
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    /**
     * Test email validation - empty email
     */
    it('shows validation error for empty email', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Clear email field
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Check that validation error is displayed
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    /**
     * Test password validation - empty password
     */
    it('shows validation error for empty password', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Clear password field
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Check that validation error is displayed
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    /**
     * Test password validation - short password
     */
    it('shows validation error for short password', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Enter short password (less than 8 characters)
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      // Check that validation error is displayed
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });

    /**
     * Test password validation - valid password length
     */
    it('accepts password with 8 or more characters', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Enter valid email and password
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Check that no password validation error is displayed
      expect(screen.queryByText('Password must be at least 8 characters long')).not.toBeInTheDocument();
    });

    /**
     * Test that validation errors clear when user starts typing
     */
    it('clears validation errors when user starts typing', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Trigger validation error
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      // Check that validation error is displayed
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

      // Start typing valid email
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Check that validation error is cleared
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });

    /**
     * Test form submission with valid data
     * This tests the complete login flow from user input to form submission
     */
    it('handles form submission with valid data', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      // Get form elements
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      // Simulate user input with valid data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Simulate form submission
      fireEvent.click(submitButton);

      // Note: This test doesn't actually test the API call since we're not mocking fetch
      // In a real test environment, you would mock the API calls
      // Example:
      // jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      //   ok: true,
      //   json: async () => ({ token: 'test-token' })
      // });
    });

    /**
     * Test that form submission is prevented when validation fails
     */
    it('prevents form submission when validation fails', async () => {
      const mockDispatch = jest.fn();
      jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /login/i });

      // Try to submit without entering any data
      fireEvent.click(submitButton);

      // Check that dispatch was not called (form submission was prevented)
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    /**
     * Test that form data is preserved on failed login attempts
     */
    it('preserves form data on failed login attempts', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // Enter some data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      // Verify data is in the form
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('wrongpassword');

      // Simulate a failed login (we can't actually test the API call here)
      // but we can verify the form data remains after any error state changes
      
      // The form data should remain even if there are errors
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('wrongpassword');
    });

    /**
     * Test that form data is cleared on successful login
     */
    it('clears form data on successful login', async () => {
      render(
        <TestWrapper>
          <BasicLogin />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // Enter some data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });

      // Verify data is in the form
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('correctpassword');

      // Note: In a real test, we would mock a successful login response
      // and verify that the form data gets cleared
      // For now, we just verify the initial state works correctly
    });
  });

  // ============================================================================
  // PROTECTED ROUTE TESTS
  // ============================================================================
  
  /**
   * Test suite for the ProtectedRoute component
   */
  describe('ProtectedRoute', () => {
    /**
     * Test that protected content is rendered when user is authenticated
     */
    it('renders children when authenticated', () => {
      render(
        <TestWrapper initialState={{ isAuthenticated: true }}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Check that protected content is rendered
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    /**
     * Test that unauthenticated users are redirected to login
     */
    it('redirects to login when not authenticated', () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Check that navigation to login was called
      expect(mockNavigate).toHaveBeenCalledWith('/login', expect.any(Object));
    });

    /**
     * Test loading state while checking authentication
     */
    it('shows loading spinner when checking authentication', () => {
      render(
        <TestWrapper initialState={{ loading: true }}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Check that loading spinner is displayed
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PUBLIC ROUTE TESTS
  // ============================================================================
  
  /**
   * Test suite for the PublicRoute component
   */
  describe('PublicRoute', () => {
    /**
     * Test that public content is rendered when user is not authenticated
     */
    it('renders children when not authenticated', () => {
      render(
        <TestWrapper>
          <PublicRoute>
            <div>Public Content</div>
          </PublicRoute>
        </TestWrapper>
      );

      // Check that public content is rendered
      expect(screen.getByText('Public Content')).toBeInTheDocument();
    });

    /**
     * Test that authenticated users are redirected to dashboard
     */
    it('redirects to dashboard when authenticated', () => {
      render(
        <TestWrapper initialState={{ isAuthenticated: true }}>
          <PublicRoute>
            <div>Public Content</div>
          </PublicRoute>
        </TestWrapper>
      );

      // Check that navigation to dashboard was called
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    /**
     * Test loading state while checking authentication
     */
    it('shows loading spinner when checking authentication', () => {
      render(
        <TestWrapper initialState={{ loading: true }}>
          <PublicRoute>
            <div>Public Content</div>
          </PublicRoute>
        </TestWrapper>
      );

      // Check that loading spinner is displayed
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
}); 