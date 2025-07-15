import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

interface UserDetailsData {
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  status: "active" | "disabled" | "pending";
  created_at: string;
  avatar?: string;
  jobTitle: string;
  location: string;
  skills: string[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  language: string;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Sample user data - in real app, fetch based on ID
  const [user] = useState<UserDetailsData>({
    id: Number(id) || 1,
    name: "John Smith",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 8900",
    organization: "Tech Corp",
    role: "Administrator",
    status: "active",
    created_at: "2024-01-15",
    avatar: "/assets/images/avatars/01.png",
    jobTitle: "Senior Software Engineer",
    location: "New York, United States",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    dateOfBirth: "1990-05-15",
    country: "United States",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    address: "123 Main Street, Apt 4B",
    language: "English",
  });

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    password: "",
    dateOfBirth: user.dateOfBirth,
    country: user.country,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    address: user.address,
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
    // Handle form submission
    console.log("Updated user data:", formData);
  };

  const handleReset = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      password: "",
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      address: user.address,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-success",
      disabled: "bg-danger",
      pending: "bg-warning text-dark",
    };
    return `badge ${statusClasses[status as keyof typeof statusClasses] || "bg-secondary"}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="page-content">
        {/* Profile Header */}
        <div className="row">
          <div className="col-12">
            <div className="card rounded-4">
              <div className="card-body position-relative p-4">
                <div
                  className="position-absolute top-0 start-0 w-100 h-50 rounded-top-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    zIndex: 1,
                  }}
                ></div>
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <div className="d-flex align-items-end gap-3 mt-5 pt-3">
                    <div className="position-relative">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          className="rounded-circle border border-4 border-white shadow"
                          width="120"
                          height="120"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle border border-4 border-white shadow bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "120px",
                            height: "120px",
                            fontSize: "2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1 pb-2">
                      <h3 className="mb-1 text-white">{user.name}</h3>
                      <p className="mb-2 text-white-50">
                        {user.jobTitle} at {user.organization}, {user.location}
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="badge bg-white text-dark"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pb-2">
                      <button className="btn btn-light btn-sm">
                        <i className="material-icons-outlined me-2">send</i>
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Left Column - Edit Profile */}
          <div className="col-12 col-lg-8">
            <div className="card rounded-4">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Edit Profile</h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="material-icons-outlined">more_vert</i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form className="row g-2" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dateOfBirth" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="zipCode" className="form-label">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-flex gap-3">
                      <button type="submit" className="btn btn-primary btn-sm">
                        Update Profile
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
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

          {/* Right Column */}
          <div className="col-12 col-lg-4">
            {/* About Card */}
            <div className="card rounded-4 mb-4">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">About</h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="material-icons-outlined">more_vert</i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary">
                      <i className="material-icons-outlined">person</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Full Name</p>
                      <p className="mb-0 text-secondary">{user.name}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success">
                      <i className="material-icons-outlined">check_circle</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Status</p>
                      <span className={getStatusBadge(user.status)}>
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info">
                      <i className="material-icons-outlined">work</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Role</p>
                      <p className="mb-0 text-secondary">{user.role}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning">
                      <i className="material-icons-outlined">location_on</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Country</p>
                      <p className="mb-0 text-secondary">{user.country}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger">
                      <i className="material-icons-outlined">language</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Language</p>
                      <p className="mb-0 text-secondary">{user.language}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-purple bg-opacity-10 text-purple">
                      <i className="material-icons-outlined">email</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Email</p>
                      <p className="mb-0 text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-dark bg-opacity-10 text-dark">
                      <i className="material-icons-outlined">phone</i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold">Phone</p>
                      <p className="mb-0 text-secondary">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Info Card */}
            <div className="card rounded-4">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Organization</h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="material-icons-outlined">more_vert</i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          View Organization
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Change Organization
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white">
                    <i className="material-icons-outlined">business</i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{user.organization}</h6>
                    <p className="mb-0 text-secondary small">Organization</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-info text-white">
                    <i className="material-icons-outlined">badge</i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{user.jobTitle}</h6>
                    <p className="mb-0 text-secondary small">Job Title</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetails;
