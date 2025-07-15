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
    designation: "",
    organization: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      designation: "",
      organization: "",
      country: "",
      city: "",
      state: "",
      zipCode: "",
      address: "",
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
            {/* Exact copy of Vertical Form widget structure */}
            <div className="card">
              <div className="card-body p-4">
                <h5 className="mb-4">New User</h5>
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="input1" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input1"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="input2" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input2"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input3" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input3"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input4" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="input4"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input5" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="input5"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input6" className="form-label">
                      Designation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input6"
                      name="designation"
                      placeholder="Designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input7" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input7"
                      name="organization"
                      placeholder="Organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input8" className="form-label">
                      Country
                    </label>
                    <select
                      id="input8"
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose...</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="input9" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input9"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="input10" className="form-label">
                      State
                    </label>
                    <select
                      id="input10"
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose...</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="input11" className="form-label">
                      Zip
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input11"
                      name="zipCode"
                      placeholder="Zip"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input12" className="form-label">
                      Address
                    </label>
                    <textarea
                      className="form-control"
                      id="input12"
                      name="address"
                      placeholder="Address ..."
                      rows={4}
                      value={formData.address}
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
