import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createUser } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";

interface NewUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback to refresh users list
}

const NewUserModal: React.FC<NewUserModalProps> = ({ show, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    designation: "",
    organization: "",
    password: "",
    agree: false,
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (!formData.organization.trim()) {
      errors.organization = "Organization is required";
    }

    if (!formData.agree) {
      errors.agree = "You must agree to the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    try {
      // Prepare user data for API
      const userData = {
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        first_name: formData.first_name,
        last_name: formData.last_name,
        organization: formData.organization,
        phone: formData.phone,
        username: formData.username,
      };

      // Dispatch the createUser action
      const result = await dispatch(createUser(userData)).unwrap();

      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `User "${formData.first_name} ${formData.last_name}" has been created successfully!`,
        }),
      );

      // Reset form and close modal
      handleReset();
      onClose();
      onSuccess?.(); // Call the onSuccess callback
    } catch (error) {
      // Error is already handled by the Redux slice
      console.error('Error creating user:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      designation: "",
      organization: "",
      password: "",
      agree: false,
    });
    setValidationErrors({});
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-top border-3 border-info"
          style={{ borderRadius: 0 }}
        >
          <div className="modal-header border-bottom-0 py-2">
            <h5 className="modal-title">Create New User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-body">
              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                  <strong>Error:</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => dispatch({ type: 'users/clearError' })}
                  ></button>
                </div>
              )}
              
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                  <label htmlFor="first_name" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.first_name ? 'is-invalid' : ''}`}
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.first_name && (
                    <div className="invalid-feedback">{validationErrors.first_name}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="last_name" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.last_name ? 'is-invalid' : ''}`}
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.last_name && (
                    <div className="invalid-feedback">{validationErrors.last_name}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="username" className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  {validationErrors.username && (
                    <div className="invalid-feedback">{validationErrors.username}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="phone" className="form-label">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {validationErrors.phone && (
                    <div className="invalid-feedback">{validationErrors.phone}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback">{validationErrors.email}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback">{validationErrors.password}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="designation" className="form-label">
                    Designation <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.designation ? 'is-invalid' : ''}`}
                    id="designation"
                    name="designation"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                  {validationErrors.designation && (
                    <div className="invalid-feedback">{validationErrors.designation}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="organization" className="form-label">
                    Organization <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.organization ? 'is-invalid' : ''}`}
                    id="organization"
                    name="organization"
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                  />
                  {validationErrors.organization && (
                    <div className="invalid-feedback">{validationErrors.organization}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <div className="form-check">
                    <input
                      className={`form-check-input ${validationErrors.agree ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="agree"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="agree">
                      I agree to the terms and conditions
                    </label>
                    {validationErrors.agree && (
                      <div className="invalid-feedback">{validationErrors.agree}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="d-md-flex d-grid align-items-center gap-3">
                    <button 
                      type="submit" 
                      className="btn btn-grd-danger px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-grd-info px-4"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserModal;
