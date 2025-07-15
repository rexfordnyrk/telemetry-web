import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface UserDetailsData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  organization: string;
  photo?: string;
  status: "active" | "disabled" | "pending";
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Sample user data with new structure
  const [user] = useState<UserDetailsData>({
    id: id || "550e8400-e29b-41d4-a716-446655440001",
    first_name: "John",
    last_name: "Smith",
    username: "john_smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    designation: "Software Engineer",
    organization: "Tech Corp",
    photo: "/assets/images/avatars/01.png",
    status: "active",
    roles: [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "admin",
        description: "Administrator role with full permissions",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "manager",
        description: "Manager role with team permissions",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      },
    ],
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  });

  // Available roles for assignment
  const [availableRoles] = useState<Role[]>([
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "admin",
      description: "Administrator role with full permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "manager",
      description: "Manager role with team permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "user",
      description: "Basic user role",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "developer",
      description: "Developer role with coding permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
  ]);

  const [userRoles, setUserRoles] = useState<Role[]>(user.roles);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<Role | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    phone: user.phone,
    email: user.email,
    designation: user.designation,
    organization: user.organization,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      designation: user.designation,
      organization: user.organization,
    });
  };

  const handleAssignRole = () => {
    if (!selectedRole) return;

    const roleToAssign = availableRoles.find(
      (role) => role.id === selectedRole,
    );
    if (
      roleToAssign &&
      !userRoles.find((role) => role.id === roleToAssign.id)
    ) {
      setUserRoles((prev) => [...prev, roleToAssign]);
      setSelectedRole("");
      console.log("Assigned role:", roleToAssign);
    }
  };

  const handleRemoveRole = (role: Role) => {
    if (userRoles.length <= 1) {
      alert("Cannot remove the last role. User must have at least one role.");
      return;
    }
    setRoleToRemove(role);
    setShowRoleModal(true);
  };

  const confirmRemoveRole = () => {
    if (roleToRemove) {
      setUserRoles((prev) =>
        prev.filter((role) => role.id !== roleToRemove.id),
      );
      console.log("Removed role:", roleToRemove);
    }
    setShowRoleModal(false);
    setRoleToRemove(null);
  };

  const handlePasswordReset = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    console.log("Password reset for user:", user.id);
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setShowPasswordModal(false);
    alert("Password updated successfully");
  };

  const getAvailableRolesForAssignment = () => {
    return availableRoles.filter(
      (role) => !userRoles.find((userRole) => userRole.id === role.id),
    );
  };

  return (
    <MainLayout>
      <div className="page-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">User Management</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/user-management/users">Users</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>

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
                  src={user.photo || "/assets/images/avatars/01.png"}
                  className="img-fluid rounded-circle p-1 bg-grd-danger shadow"
                  width="170"
                  height="170"
                  alt=""
                />
              </div>
            </div>
            <div className="profile-info pt-5 d-flex align-items-center justify-content-between">
              <div className="">
                <h3>
                  {user.first_name} {user.last_name}
                </h3>
                <p className="mb-0">
                  {user.designation} at {user.organization}
                  <br />
                  Username: {user.username}
                </p>
              </div>
            </div>
            <div className="kewords d-flex align-items-center gap-3 mt-4 overflow-x-auto">
              {userRoles.map((role, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-sm btn-primary rounded-5 px-4"
                >
                  {role.name}
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
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
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
                      placeholder="Designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="organization" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      placeholder="Organization"
                      value={formData.organization}
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
                      <p className="mb-0">
                        Full Name: {user.first_name} {user.last_name}
                      </p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">done</span>
                      <p className="mb-0">Status: {user.status}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">badge</span>
                      <p className="mb-0">Designation: {user.designation}</p>
                    </div>
                    <div className="info-list-item d-flex align-items-center gap-3">
                      <span className="material-icons-outlined">business</span>
                      <p className="mb-0">Organization: {user.organization}</p>
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

            {/* Manage Roles Card */}
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Manage Roles</h5>
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

                {/* Current Roles */}
                <div className="mb-4">
                  <h6 className="mb-3">Current Roles</h6>
                  <div className="role-list d-flex flex-column gap-2">
                    {userRoles.map((role) => (
                      <div
                        key={role.id}
                        className="d-flex align-items-center justify-content-between p-2 border rounded"
                      >
                        <div>
                          <h6 className="mb-0">{role.name}</h6>
                          <small className="text-muted">
                            {role.description}
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveRole(role)}
                          disabled={userRoles.length <= 1}
                          title={
                            userRoles.length <= 1
                              ? "Cannot remove the last role"
                              : "Remove role"
                          }
                        >
                          <i className="material-icons-outlined">remove</i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assign Role */}
                <div>
                  <h6 className="mb-3">Assign Role</h6>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select a role...</option>
                      {getAvailableRolesForAssignment().map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={handleAssignRole}
                      disabled={!selectedRole}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Management Card */}
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Password Management</h5>
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

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <i className="material-icons-outlined me-2">lock_reset</i>
                    Reset Password
                  </button>
                  <small className="text-muted">
                    Click to reset the user's password. The user will need to
                    change it on next login.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Removal Confirmation Modal */}
      {showRoleModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Role Removal</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRoleModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to remove the role{" "}
                  <strong>{roleToRemove?.name}</strong> from this user?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmRemoveRole}
                >
                  Remove Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset User Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      minLength={6}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handlePasswordReset}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UserDetails;
