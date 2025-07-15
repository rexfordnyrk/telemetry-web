import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUser, assignRole, removeRole } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const availableRoles = useAppSelector((state) => state.users.availableRoles);

  // Find user by ID
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">User not found</div>
        </div>
      </MainLayout>
    );
  }

  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<any>(null);

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    email: user.email,
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

    const updatedUser = {
      ...user,
      ...formData,
      updated_at: new Date().toISOString(),
    };

    dispatch(updateUser(updatedUser));
    dispatch(
      addAlert({
        type: "success",
        title: "Profile Updated",
        message: "User profile has been updated successfully.",
      }),
    );
  };

  const handleReset = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
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
      !user.roles.find((role) => role.id === roleToAssign.id)
    ) {
      dispatch(assignRole({ userId: user.id, role: roleToAssign }));
      dispatch(
        addAlert({
          type: "success",
          title: "Role Assigned",
          message: `Role "${roleToAssign.name}" has been assigned successfully.`,
        }),
      );
      setSelectedRole("");
    }
  };

  const handleRemoveRole = (role: any) => {
    if (user.roles.length <= 1) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Cannot Remove Role",
          message:
            "Cannot remove the last role. User must have at least one role.",
        }),
      );
      return;
    }
    setRoleToRemove(role);
    setShowRoleModal(true);
  };

  const confirmRemoveRole = () => {
    if (roleToRemove) {
      dispatch(removeRole({ userId: user.id, roleId: roleToRemove.id }));
      dispatch(
        addAlert({
          type: "success",
          title: "Role Removed",
          message: `Role "${roleToRemove.name}" has been removed successfully.`,
        }),
      );
    }
    setShowRoleModal(false);
    setRoleToRemove(null);
  };

  const handlePasswordReset = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Password Mismatch",
          message: "Passwords do not match. Please try again.",
        }),
      );
      return;
    }
    if (passwordData.newPassword.length < 6) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Invalid Password",
          message: "Password must be at least 6 characters long.",
        }),
      );
      return;
    }

    dispatch(
      addAlert({
        type: "success",
        title: "Password Reset",
        message: "Password has been reset successfully.",
      }),
    );

    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  const handleSendResetLink = () => {
    dispatch(
      addAlert({
        type: "success",
        title: "Reset Link Sent",
        message: `Password reset link has been sent to ${user.email}.`,
      }),
    );
  };

  const getAvailableRolesForAssignment = () => {
    return availableRoles.filter(
      (role) => !user.roles.find((userRole) => userRole.id === role.id),
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
            <div className="profile-info pt-5 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h3>
                  {user.first_name} {user.last_name}
                </h3>
                <p className="mb-0">
                  {user.designation} at {user.organization}
                </p>
              </div>
            </div>
            <div className="kewords d-flex align-items-center justify-content-center gap-3 mt-4 overflow-x-auto">
              {user.roles.map((role, index) => (
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

          {/* Right Column */}
          <div className="col-12 col-xl-4">
            {/* Manage Roles Card */}
            <div className="card rounded-4 mb-3">
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
                    {user.roles.map((role) => (
                      <div
                        key={role.id}
                        className="d-flex align-items-center justify-content-between p-2 border rounded"
                      >
                        <div>
                          <h6 className="mb-0">{role.name}</h6>
                          <small className="text-dark">
                            {role.description}
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveRole(role)}
                          disabled={user.roles.length <= 1}
                          title={
                            user.roles.length <= 1
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
                      className="btn btn-grd-primary px-4"
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

                {/* Password Reset Form */}
                <div className="mb-4">
                  <h6 className="mb-3">Reset Password</h6>
                  <div className="row g-3">
                    <div className="col-12">
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
                      />
                    </div>
                    <div className="col-12">
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
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-grd-warning px-4 d-flex align-items-center justify-content-center gap-2"
                    onClick={handlePasswordReset}
                  >
                    <i className="material-icons-outlined">lock_reset</i>
                    Reset Password
                  </button>
                  <button
                    className="btn btn-grd-info px-4 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSendResetLink}
                  >
                    <i className="material-icons-outlined">send</i>
                    Send Reset Link
                  </button>
                  <small className="text-muted">
                    Click to reset the user's password or send them a reset link
                    via email.
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
                  className="btn btn-grd-royal px-4"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-grd-danger px-4"
                  onClick={confirmRemoveRole}
                >
                  Remove Role
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
