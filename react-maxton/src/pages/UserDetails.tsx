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
    role: "Developer",
    status: "active",
    created_at: "2024-01-15",
    avatar: "/assets/images/avatars/01.png",
    jobTitle: "Senior Software Engineer",
    location: "New York, United States",
    skills: ["UX Research", "CX Strategy", "Management"],
    dateOfBirth: "1990-05-15",
    country: "United States",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    address: "123 Main Street, Apt 4B\nNew York, NY 10001",
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

  const [accounts] = useState([
    {
      name: "Google",
      description: "Events and Research",
      icon: "/assets/images/apps/05.png",
      connected: true,
    },
    {
      name: "Skype",
      description: "Events and Research",
      icon: "/assets/images/apps/02.png",
      connected: true,
    },
    {
      name: "Slack",
      description: "Communication",
      icon: "/assets/images/apps/03.png",
      connected: false,
    },
    {
      name: "Instagram",
      description: "Social Media",
      icon: "/assets/images/apps/09.png",
      connected: true,
    },
    {
      name: "Facebook",
      description: "Social Media",
      icon: "/assets/images/apps/06.png",
      connected: false,
    },
    {
      name: "PayPal",
      description: "Payment Gateway",
      icon: "/assets/images/apps/07.png",
      connected: true,
    },
  ]);

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

  return (
    <MainLayout>
      <div className="page-content">
        {/* Profile Header Card */}
        <div className="card rounded-4">
          <div className="card-body p-4">
            <div className="position-relative mb-5">
              <img
                src="/assets/images/gallery/profile-cover.png"
                className="img-fluid rounded-4 shadow"
                alt=""
              />
              <div className="profile-avatar position-absolute top-100 start-50 translate-middle">
                <img
                  src={user.avatar || "/assets/images/avatars/01.png"}
                  className="img-fluid rounded-circle p-1 bg-grd-danger shadow"
                  width="170"
                  height="170"
                  alt=""
                />
              </div>
            </div>
            <div className="profile-info pt-5 d-flex align-items-center justify-content-between">
              <div className="">
                <h3>{user.name}</h3>
                <p className="mb-0">
                  {user.jobTitle} at {user.organization}
                  <br />
                  {user.location}
                </p>
              </div>
              <div className="">
                <a
                  href="javascript:;"
                  className="btn btn-grd-primary rounded-5 px-4"
                >
                  <i className="bi bi-chat me-2"></i>Send Message
                </a>
              </div>
            </div>
            <div className="kewords d-flex align-items-center gap-3 mt-4 overflow-x-auto">
              {user.skills.map((skill, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-sm btn-light rounded-5 px-4"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="row">
          {/* Left Column - Edit Profile */}
          <div className="col-12 col-xl-8">
            <div className="card rounded-4 border-top border-4 border-primary border-gradient-1">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Edit Profile</h5>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <form className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="input1" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input1"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
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
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
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
                      DOB
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="input6"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input7" className="form-label">
                      Country
                    </label>
                    <select
                      id="input7"
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
                    <label htmlFor="input8" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input8"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="input9" className="form-label">
                      State
                    </label>
                    <select
                      id="input9"
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
                    <label htmlFor="input10" className="form-label">
                      Zip
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input10"
                      name="zipCode"
                      placeholder="Zip"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="input11" className="form-label">
                      Address
                    </label>
                    <textarea
                      className="form-control"
                      id="input11"
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
                        Update Profile
                      </button>
                      <button
                        type="button"
                        className="btn btn-light px-4"
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
          <div className="col-12 col-xl-4">
            {/* About Card */}
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">About</h5>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="full-info">
                  <div className="info-list d-flex flex-column gap-3">
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">
                        account_circle
                      </span>
                      <p className="mb-0">Full Name: {user.name}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">done</span>
                      <p className="mb-0">Status: {user.status}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">code</span>
                      <p className="mb-0">Role: {user.role}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">flag</span>
                      <p className="mb-0">Country: {user.country}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">language</span>
                      <p className="mb-0">Language: {user.language}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">send</span>
                      <p className="mb-0">Email: {user.email}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">call</span>
                      <p className="mb-0">Phone: {user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Card */}
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Accounts</h5>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="account-list d-flex flex-column gap-4">
                  {accounts.map((account, index) => (
                    <div
                      key={index}
                      className="account-list-item d-flex align-items-center gap-3"
                    >
                      <img src={account.icon} width="35" alt="" />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{account.name}</h6>
                        <p className="mb-0">{account.description}</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked={account.connected}
                        />
                      </div>
                    </div>
                  ))}
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
