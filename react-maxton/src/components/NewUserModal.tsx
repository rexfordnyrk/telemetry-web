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
    phone: "",
    email: "",
    password: "",
    dob: "",
    country: "",
    city: "",
    state: "",
    zip: "",
    address: "",
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
      username: `${formData.first_name.toLowerCase()}_${formData.last_name.toLowerCase()}`,
      email: formData.email,
      phone: formData.phone,
      designation: "New Employee",
      organization: "Organization",
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
      phone: "",
      email: "",
      password: "",
      dob: "",
      country: "",
      city: "",
      state: "",
      zip: "",
      address: "",
      agree: false,
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
        <div className="card border-top border-3 border-danger rounded-0">
          <div className="card-header py-3 px-4">
            <h5 className="mb-0 text-danger">New User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="card-body p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
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
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control rounded-0"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
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
                <label className="form-label">DOB</label>
                <input
                  type="date"
                  className="form-control rounded-0"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Country</label>
                <select
                  className="form-select rounded-0"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Choose...</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">State</label>
                <select
                  className="form-select rounded-0"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="">Choose...</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Zip</label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  name="zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control rounded-0"
                  name="address"
                  placeholder="Address ..."
                  rows={3}
                  value={formData.address}
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
                  <label className="form-check-label">Check me out</label>
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
