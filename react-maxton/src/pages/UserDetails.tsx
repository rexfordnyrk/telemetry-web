import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateUser,
  assignRoleToUser,
  removeRoleFromUser,
  type Role,
} from "../store/slices/userSlice";
import { fetchRoles } from "../store/slices/rolesPermissionsSlice";
import { addAlert } from "../store/slices/alertSlice";
import { usePermissions } from "../hooks/usePermissions";

/** Confirmation dialog for removing a role. Rendered with portal; uses inline styles only. */
function RemoveRoleConfirmDialog({
  roleName,
  loading,
  onConfirm,
  onCancel,
}: {
  roleName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {/* Backdrop – only this layer closes on click */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        }}
        onClick={onCancel}
      />
      {/* Dialog panel – above backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-role-dialog-title"
        className="card border-top border-3 border-warning rounded-0"
        style={{
          position: "relative",
          zIndex: 10001,
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 id="remove-role-dialog-title" className="mb-0 text-warning">
            Confirm Role Removal
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onCancel}
            aria-label="Close"
          />
        </div>
        <div className="card-body p-4">
          <p>
            Are you sure you want to remove the role <strong>{roleName}</strong> from this user?
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-grd-royal px-4 rounded-0"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-grd-danger px-4 rounded-0"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Removing...
                </>
              ) : (
                "Remove Role"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const rolesFromApi = useAppSelector((state) => state.rolesPermissions.roles);
  const fallbackRoles = useAppSelector((state) => state.users.availableRoles);
  const availableRoles: Role[] =
    rolesFromApi.length > 0 ? (rolesFromApi as Role[]) : fallbackRoles;
  const assignRoleLoading = useAppSelector((state) => state.users.assignRoleLoading);
  const removeRoleLoading = useAppSelector((state) => state.users.removeRoleLoading);
  const { hasPermission } = usePermissions();

  // Load roles from API when viewing user details (for role assignment dropdown)
  useEffect(() => {
    if (hasPermission("view_user_roles") && rolesFromApi.length === 0) {
      dispatch(fetchRoles({ page: 1, limit: 100 }));
    }
  }, [dispatch, hasPermission, rolesFromApi.length]);

  // All hooks must be called at the top level
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<any>(null);
  const roleToRemoveRef = useRef<Role | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Find user by ID
  const user = users.find((u) => u.id === id);

  // Initialize form data with user data or empty values
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    username: user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
    designation: user?.designation || "",
    organization: user?.organization || "",
    photo: null as File | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user?.photo || null,
  );

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        designation: user.designation,
        organization: user.organization,
        photo: null,
      });
      setPhotoPreview(user.photo || null);
    }
  }, [user]);

  // Check permissions after all hooks are called
  const canReadUsers = hasPermission('read_users');
  const canUpdateUsers = hasPermission('update_users');
  const canViewUserRoles = hasPermission('view_user_roles');
  const canManageUserRoles = hasPermission('manage_user_roles');

  // If user doesn't have read_users permission, don't show the page
  if (!canReadUsers) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">
            You don't have permission to view user profiles.
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">User not found</div>
        </div>
      </MainLayout>
    );
  }

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    // Create updated user object, omitting photo if not provided
    const updatedUserData = { ...formData };
    delete (updatedUserData as any).photo; // Remove photo from form data

    const updatedUser = {
      ...user,
      ...updatedUserData,
      ...(photoPreview && photoPreview !== user?.photo
        ? { photo: photoPreview }
        : {}),
      updated_at: new Date().toISOString(),
    } as any;

    // @ts-ignore - Photo type issue
    dispatch(updateUser(updatedUser));
    dispatch(
      addAlert({
        type: "success",
        title: "Profile Updated",
        message: "User profile has been updated successfully.",
      }),
    );
    setIsEditing(false);
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
      photo: null,
    });
    setPhotoPreview(user.photo || null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      designation: user.designation,
      organization: user.organization,
      photo: null,
    });
    setPhotoPreview(user.photo || null);
    setIsEditing(false);
  };

  const handleAssignRole = async () => {
    if (!selectedRole) return;

    const roleToAssign = availableRoles.find(
      (role) => role.id === selectedRole,
    ) as Role | undefined;
    if (
      !roleToAssign ||
      user.roles.find((role) => role.id === roleToAssign.id)
    ) {
      return;
    }
    try {
      await dispatch(
        assignRoleToUser({ userId: user.id, role: roleToAssign }),
      ).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Role Assigned",
          message: `Role "${roleToAssign.name}" has been assigned successfully.`,
        }),
      );
      setSelectedRole("");
    } catch (err) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Assign Role Failed",
          message: err instanceof Error ? err.message : "Failed to assign role to user.",
        }),
      );
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
    roleToRemoveRef.current = role;
    setRoleToRemove(role);
    setShowRoleModal(true);
  };

  const confirmRemoveRole = () => {
    const role = roleToRemoveRef.current;
    if (!role) {
      setShowRoleModal(false);
      setRoleToRemove(null);
      return;
    }
    const roleName = role.name;
    const roleIdToRemove = role.id;
    setShowRoleModal(false);
    setRoleToRemove(null);
    roleToRemoveRef.current = null;
    dispatch(
      removeRoleFromUser({ userId: user.id, roleId: roleIdToRemove }),
    )
      .unwrap()
      .then(() => {
        dispatch(
          addAlert({
            type: "success",
            title: "Role Removed",
            message: `Role "${roleName}" has been removed successfully.`,
          }),
        );
      })
      .catch((err: unknown) => {
        dispatch(
          addAlert({
            type: "danger",
            title: "Remove Role Failed",
            message: err instanceof Error ? err.message : "Failed to remove role from user.",
          }),
        );
      });
  };

  const handlePasswordReset = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Password Mismatch",
          message: "New password and confirm password do not match.",
        }),
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Password Too Short",
          message: "Password must be at least 6 characters long.",
        }),
      );
      return;
    }

    // TODO: Implement password reset API call
    dispatch(
      addAlert({
        type: "success",
        title: "Password Reset",
        message: "Password has been reset successfully.",
      }),
    );

    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSendResetLink = () => {
    // TODO: Implement send reset link API call
    dispatch(
      addAlert({
        type: "success",
        title: "Reset Link Sent",
        message: "Password reset link has been sent to the user's email.",
      }),
    );
  };

  const getAvailableRolesForAssignment = () => {
    return availableRoles.filter(
      (role) => !user.roles.find((userRole) => userRole.id === role.id),
    );
  };

  // Generate user initials for avatar
  const getUserInitials = () => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
                {user.photo ? (
                  <img
                    src={user.photo}
                    className="img-fluid rounded-circle p-1 bg-grd-danger shadow"
                    width="170"
                    height="170"
                    alt="User Profile"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="img-fluid rounded-circle p-1 bg-grd-danger shadow d-flex align-items-center justify-content-center"
                    style={{
                      width: "170px",
                      height: "170px",
                      fontSize: "48px",
                      fontWeight: "bold",
                      color: "white"
                    }}
                  >
                    {getUserInitials()}
                  </div>
                )}
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
                  <div>
                    {!isEditing && canUpdateUsers ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bx bx-edit me-2"></i>Edit Profile
                      </button>
                    ) : isEditing ? (
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          form="user-form"
                          className="btn btn-primary btn-sm"
                        >
                          <i className="bx bx-save me-2"></i>Save
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <form id="user-form" className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-12">
                    <label htmlFor="photo" className="form-label">
                      Profile Photo
                    </label>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="rounded-circle"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                          style={{
                            width: "80px",
                            height: "80px",
                            fontSize: "24px",
                          }}
                        >
                          {getUserInitials()}
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          id="photo"
                          name="photo"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          disabled={!isEditing}
                        />
                        <small className="text-muted">
                          Upload a profile photo (optional)
                        </small>
                      </div>
                    </div>
                  </div>

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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-xl-4">
            {/* Manage Roles Card - Only show if user has view_user_roles permission */}
            {canViewUserRoles && (
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
                    <div className="role-list d-flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <div
                          key={role.id}
                          className="badge bg-primary text-white d-flex align-items-center gap-2 p-2"
                          style={{ borderRadius: 0, fontSize: "0.875rem" }}
                        >
                          <span>{role.name}</span>
                          {canManageUserRoles && (
                            <button
                              type="button"
                              className="btn-close btn-close-white"
                              style={{ fontSize: "0.75em" }}
                              onClick={() => handleRemoveRole(role)}
                              disabled={user.roles.length <= 1 || removeRoleLoading}
                              title={
                                user.roles.length <= 1
                                  ? "Cannot remove the last role"
                                  : "Remove role"
                              }
                            ></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assign Role - Only show if user has manage_user_roles permission */}
                  {canManageUserRoles && (
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
                          disabled={!selectedRole || assignRoleLoading}
                        >
                          {assignRoleLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Applying...
                            </>
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Management Card */}
            {canUpdateUsers && (
              <div className="card rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="">
                      <h5 className="mb-0 fw-bold">Password Reset</h5>
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
            )}
          </div>
        </div>
      </div>

      {/* Role removal confirmation: rendered in a portal to avoid layout/stacking issues */}
      {showRoleModal &&
        createPortal(
          <RemoveRoleConfirmDialog
            roleName={roleToRemove?.name ?? ""}
            loading={removeRoleLoading}
            onConfirm={confirmRemoveRole}
            onCancel={() => {
              setShowRoleModal(false);
              setRoleToRemove(null);
              roleToRemoveRef.current = null;
            }}
          />,
          document.body,
        )}
    </MainLayout>
  );
};

export default UserDetails;
