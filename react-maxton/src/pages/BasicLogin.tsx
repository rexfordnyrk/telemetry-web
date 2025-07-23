/**
 * BasicLogin Component
 * 
 * This is the main login page component that handles user authentication.
 * It integrates with Redux for state management and provides a complete
 * login experience with form validation, loading states, and error handling.
 * 
 * Features:
 * - Form validation and error display
 * - Loading states during authentication
 * - Password visibility toggle
 * - Remember me functionality
 * - Automatic redirection after successful login
 * - Responsive design with Bootstrap styling
 * - Email validation to ensure valid email format
 * - Form data preservation on failed login attempts using Redux state
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { loginUser, clearError, updateFormData, LoginCredentials } from "../store/slices/authSlice";

const BasicLogin: React.FC = () => {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================
  
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get authentication state from Redux store
  const { loading, error, isAuthenticated, formData } = useSelector((state: RootState) => state.auth);

  // Local component state for UI only (not form data)
  const [showPassword, setShowPassword] = useState(false);

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  /**
   * Validate email format using regex pattern
   * This ensures only valid email addresses are accepted
   * 
   * @param email - The email address to validate
   * @returns True if email is valid, false otherwise
   */
  const isValidEmail = (email: string): boolean => {
    // Email regex pattern for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate the entire form before submission
   * This checks all required fields and formats
   * 
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const errors = {
      email: "",
      password: "",
    };

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Update validation errors state
    setValidationErrors(errors);

    // Return true if no errors, false otherwise
    return !errors.email && !errors.password;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Toggle password visibility in the password input field
   * This allows users to see what they're typing
   * Fixed to prevent javascript: URL security error
   */
  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior to avoid javascript: URL error
    setShowPassword(!showPassword);
  };

  /**
   * Handle changes to form inputs
   * Updates the Redux form data state when user types or changes checkboxes
   * Also clears validation errors when user starts typing
   * 
   * @param e - The change event from the input element
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Update Redux form data based on input type
    dispatch(updateFormData({
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handle form submission (login attempt)
   * This function is called when the user clicks the login button
   * It validates the form before attempting to login
   * Form data is preserved on failed login attempts using Redux state
   * 
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Prevent event bubbling
    
    // Validate form before proceeding
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    // Clear any previous errors before attempting login
    // Note: We do NOT clear form data here - it should be preserved for user correction
    dispatch(clearError());

    // Prepare credentials for the API call
    const credentials: LoginCredentials = {
      username: formData.email,    // Use email as username
      password: formData.password,
    };

    try {
      // Dispatch the login action and wait for it to complete
      await dispatch(loginUser(credentials)).unwrap();
      
      // If login is successful, navigate to dashboard
      // Form data will be cleared by Redux on successful login
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the Redux slice and displayed in the UI
      // IMPORTANT: Form data is preserved in Redux state so user can see and correct their input
      // We do NOT clear formData here - let user see what they entered
      console.error("Login failed:", error);
      // Form data remains in Redux state for user to correct and retry
    }
  };

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================

  /**
   * Effect to redirect authenticated users
   * If user is already logged in, redirect them to dashboard
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Effect to set up page theme and language
   * This runs once when the component mounts
   */
  useEffect(() => {
    // Set the theme to match the original HTML design
    document.documentElement.setAttribute("data-bs-theme", "blue-theme");
    document.documentElement.setAttribute("lang", "en");
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="auth-basic-wrapper d-flex align-items-center justify-content-center">
      <div className="container-fluid my-5 my-lg-0">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
            {/* Main login card */}
            <div className="card rounded-4 mb-0 border-top border-4 border-primary border-gradient-1">
              <div className="card-body p-5">
                {/* Logo and header */}
                <img
                  src="/assets/images/logo1.png"
                  className="mb-4"
                  width="145"
                  alt="Company Logo"
                />
                <h4 className="fw-bold">Get Started Now</h4>
                <p className="mb-0">
                  Enter your credentials to login your account
                </p>

                {/* Error Alert - Shows authentication errors */}
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {/* Login form */}
                <div className="form-body my-5">
                  <form className="row g-3" onSubmit={handleSubmit} noValidate>
                    {/* Email input field */}
                    <div className="col-12">
                      <label htmlFor="inputEmailAddress" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                        id="inputEmailAddress"
                        name="email"
                        placeholder="jhon@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}  // Disable during login attempt
                        required
                      />
                      {/* Email validation error */}
                      {validationErrors.email && (
                        <div className="invalid-feedback">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                    
                    {/* Password input field with visibility toggle */}
                    <div className="col-12">
                      <label
                        htmlFor="inputChoosePassword"
                        className="form-label"
                      >
                        Password
                      </label>
                      <div className="input-group" id="show_hide_password">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control border-end-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                          id="inputChoosePassword"
                          name="password"
                          value={formData.password}
                          placeholder="Enter Password"
                          onChange={handleInputChange}
                          disabled={loading}  // Disable during login attempt
                          required
                        />
                        {/* Password visibility toggle button - Fixed to prevent javascript: URL error */}
                        <button
                          type="button"
                          className="input-group-text bg-transparent border-start-0"
                          onClick={togglePasswordVisibility}
                          disabled={loading}  // Disable during login attempt
                        >
                          <i
                            className={`bi ${
                              showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                            }`}
                          ></i>
                        </button>
                      </div>
                      {/* Password validation error */}
                      {validationErrors.password && (
                        <div className="invalid-feedback">
                          {validationErrors.password}
                        </div>
                      )}
                    </div>
                    
                    {/* Remember me checkbox and forgot password link */}
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          disabled={loading}  // Disable during login attempt
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <a href="/forgot-password">Forgot Password ?</a>
                    </div>
                    
                    {/* Login button */}
                    <div className="col-12">
                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-grd-primary"
                          disabled={loading}  // Disable during login attempt
                        >
                          {loading ? (
                            // Show loading spinner and text during login
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Logging in...
                            </>
                          ) : (
                            // Show normal button text when not loading
                            "Login"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicLogin;
