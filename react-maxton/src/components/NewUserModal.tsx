import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addUser } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";
import { User } from "../store/slices/userSlice";

interface NewUserModalProps {
  show: boolean;
  onClose: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ show, onClose }) => {
  const dispatch = useAppDispatch();

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Validation Error",
          message: "Please fill in all required fields.",
        }),
      );
      return;
    }

    // Create new user
    const newUser: User = {
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      first_name: formData.first_name,
      last_name: formData.last_name,
      username:
        formData.username ||
        `${formData.first_name.toLowerCase()}_${formData.last_name.toLowerCase()}`,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation || "New Employee",
      organization: formData.organization || "Organization",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dispatch(addUser(newUser));
    dispatch(
      addAlert({
        type: "success",
        title: "Success",
        message: "User created successfully!",
      }),
    );

    // Reset form and close modal
    handleReset();
    onClose();
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
  };

  if (!show) return null;

    return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-bottom-0 py-2 bg-grd-info">
            <h5 className="modal-title">New User Registration</h5>
            <a href="javascript:;" className="primaery-menu-close" onClick={onClose}>
              <i className="material-icons-outlined">close</i>
            </a>
          </div>
                    <div className="modal-body">
            <div className="form-body">
              <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label">First Name *</label>
                                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name *</label>
                                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="username"
                  placeholder="Username (auto-generated if empty)"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control rounded-0"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Organization</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="organization"
                  placeholder="Organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control rounded-0"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <div className="form-check">
                  <input
                    className="form-check-input rounded-0"
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="d-md-flex d-grid align-items-center gap-3">
                  <button
                    type="submit"
                    className="btn btn-grd-danger px-4 rounded-0"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-grd-info px-4 rounded-0"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-grd-royal px-4 rounded-0"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserModal;