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
    email: "",
    phone: "",
    organization: "",
    designation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      username: `${formData.first_name.toLowerCase()}_${formData.last_name.toLowerCase()}`,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      organization: formData.organization,
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
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      organization: "",
      designation: "",
    });
    onClose();
  };

  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      organization: "",
      designation: "",
    });
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="card-body p-4">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="organization" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="designation" className="form-label">
                      Designation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="d-md-flex d-grid align-items-center gap-3">
                      <button
                        type="submit"
                        className="btn btn-grd-primary px-4"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-grd-royal px-4"
                        onClick={handleReset}
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
    </div>
  );
};

export default NewUserModal;
