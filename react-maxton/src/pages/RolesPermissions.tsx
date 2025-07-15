import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";

const RolesPermissions: React.FC = () => {
  const dispatch = useAppDispatch();
  // Removed unused showNewRoleModal
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetRole, setTargetRole] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [removedPermissions, setRemovedPermissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample roles data - memoized to prevent re-renders
  const roles = [
    {
      id: "1",
      name: "Administrator",
      description: "Full system access",
      created_at: "2023-01-15",
      updated_at: "2023-01-20",
      permissions: [
        { id: "1", name: "users.create", description: "Create users" },
        { id: "2", name: "users.update", description: "Update users" },
        { id: "3", name: "users.delete", description: "Delete users" },
      ],
    },
    {
      id: "2",
      name: "Manager",
      description: "Management access",
      created_at: "2023-02-20",
      updated_at: "2023-02-25",
      permissions: [
        { id: "1", name: "users.create", description: "Create users" },
        { id: "2", name: "users.update", description: "Update users" },
      ],
    },
    {
      id: "3",
      name: "User",
      description: "Standard user access",
      created_at: "2023-03-10",
      updated_at: "2023-03-15",
      permissions: [
        { id: "4", name: "profile.update", description: "Update own profile" },
      ],
    },
    {
      id: "4",
      name: "Guest",
      description: "Limited read access",
      created_at: "2023-04-05",
      updated_at: "2023-04-10",
      permissions: [
        { id: "5", name: "read.only", description: "Read-only access" },
      ],
    },
  ];

  // All available permissions that can be assigned to roles
  const allPermissions = [
    { id: "1", name: "users.create", description: "Create users" },
    { id: "2", name: "users.update", description: "Update users" },
    { id: "3", name: "users.delete", description: "Delete users" },
    { id: "4", name: "profile.update", description: "Update own profile" },
    { id: "5", name: "read.only", description: "Read-only access" },
    { id: "6", name: "roles.create", description: "Create roles" },
    { id: "7", name: "roles.update", description: "Update roles" },
    { id: "8", name: "roles.delete", description: "Delete roles" },
    { id: "9", name: "permissions.manage", description: "Manage permissions" },
    { id: "10", name: "system.admin", description: "System administration" },
    { id: "11", name: "reports.view", description: "View reports" },
    { id: "12", name: "reports.export", description: "Export reports" },
  ];

  // Memoize roles to prevent unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedRoles = useMemo(() => roles, []);

  // Initialize DataTable using custom hook
  useDataTable("roles-datatable", memoizedRoles);

  const handleRoleClick = (role: any) => {
    setSelectedRole(role);
    setRemovedPermissions([]); // Reset removed permissions when selecting new role
  };

  const handleRemovePermission = (permission: any) => {
    setRemovedPermissions((prev) => [...prev, permission]);
  };

  const handleRestorePermission = (permission: any) => {
    setRemovedPermissions((prev) => prev.filter((p) => p.id !== permission.id));
  };

  const getFilteredPermissions = () => {
    if (!searchTerm) return allPermissions;
    return allPermissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const getAvailablePermissions = () => {
    if (!selectedRole) return [];
    const rolePermissionIds = selectedRole.permissions.map((p: any) => p.id);
    return getFilteredPermissions().filter(
      (permission) => !rolePermissionIds.includes(permission.id),
    );
  };

  const getCurrentPermissions = () => {
    if (!selectedRole) return [];
    return selectedRole.permissions.filter(
      (permission: any) =>
        !removedPermissions.find((rp) => rp.id === permission.id),
    );
  };

  const handleApplyChanges = () => {
    if (removedPermissions.length > 0) {
      // Apply permission removals
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `${removedPermissions.length} permission(s) removed from ${selectedRole?.name}.`,
        }),
      );
      setRemovedPermissions([]);
    }
  };

  const handleActionClick = (role: any, action: "disable" | "delete") => {
    setTargetRole(role);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Role "${targetRole?.name}" has been deleted.`,
        }),
      );
    } else {
      const newStatus =
        targetRole?.status === "disabled" ? "active" : "disabled";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Role "${targetRole?.name}" has been ${newStatus}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetRole(null);
  };

  return (
    <MainLayout>
      <div className="main-content">
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
                <li className="breadcrumb-item active" aria-current="page">
                  Roles & Permissions
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <div className="btn-group position-static">
              <div className="btn-group position-static">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  Settings
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="BorderHorizontal"
                        defaultChecked
                      />
                      Horizontal Border
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="BorderVertical"
                      />
                      Vertical Border
                    </label>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="stripedRows"
                      />
                      Striped Rows
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="stripedColumns"
                      />
                      Striped Columns
                    </label>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="hoverableRows"
                      />
                      Hoverable Rows
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        className="me-2"
                        id="responsiveTable"
                      />
                      Responsive Table
                    </label>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
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
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="javascript:;">
                    Separated link
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add New Role Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">
            Roles & Permissions Management
          </h6>
          <button
            type="button"
            className="btn btn-grd-primary px-4"
            onClick={() => {
              /* TODO: Implement new role modal */
            }}
          >
            + | New Role
          </button>
        </div>
        <hr />
        <div className="row">
          {/* Left Half - Roles Table */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="roles-datatable"
                    className="table table-striped table-bordered"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memoizedRoles.map((role) => (
                        <tr key={role.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  fontSize: "14px",
                                }}
                              >
                                {role.name.charAt(0)}
                              </div>
                              <div>
                                <a
                                  href="#"
                                  className="text-decoration-none fw-bold text-dark"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRoleClick(role);
                                  }}
                                >
                                  {role.name}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td>{role.description}</td>
                          <td>
                            {new Date(role.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(role.updated_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm p-1"
                                title="Edit Role"
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <i className="material-icons-outlined text-primary">
                                  edit
                                </i>
                              </button>
                              <button
                                className="btn btn-sm p-1"
                                title="Toggle Role Status"
                                onClick={() =>
                                  handleActionClick(role, "disable")
                                }
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <i className="material-icons-outlined text-warning">
                                  block
                                </i>
                              </button>
                              <button
                                className="btn btn-sm p-1"
                                title="Delete Role"
                                onClick={() =>
                                  handleActionClick(role, "delete")
                                }
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <i className="material-icons-outlined text-danger">
                                  delete
                                </i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Half - Permission Management */}
          <div className="col-md-6">
            {selectedRole ? (
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">
                    Manage Permissions for: {selectedRole.name}
                  </h6>
                </div>
                <div className="card-body">
                  {/* Current Permissions */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Current Permissions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {getCurrentPermissions().map((permission: any) => (
                        <span
                          key={permission.id}
                          className="badge bg-primary d-flex align-items-center gap-2"
                        >
                          {permission.name}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: "0.75em" }}
                            onClick={() => handleRemovePermission(permission)}
                            title="Remove permission"
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Removed Permissions (for undo) */}
                  {removedPermissions.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">
                        Removed Permissions (Click to restore)
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {removedPermissions.map((permission: any) => (
                          <span
                            key={permission.id}
                            className="badge bg-warning text-dark cursor-pointer"
                            onClick={() => handleRestorePermission(permission)}
                            title="Click to restore"
                          >
                            {permission.name}
                            <i
                              className="ms-1 material-icons-outlined"
                              style={{ fontSize: "0.75em" }}
                            >
                              undo
                            </i>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Permissions */}
                  <div className="mb-4">
                    <h6 className="text-success mb-3">Available Permissions</h6>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {getAvailablePermissions().map((permission: any) => (
                        <div
                          key={permission.id}
                          className="border rounded p-2 mb-2 cursor-pointer hover-bg-light"
                          onClick={() => {
                            // TODO: Add permission assignment logic
                            console.log("Assign permission:", permission);
                          }}
                        >
                          <div className="fw-bold">{permission.name}</div>
                          <small className="text-muted">
                            {permission.description}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Changes Button */}
                  {removedPermissions.length > 0 && (
                    <div className="d-grid">
                      <button
                        type="button"
                        className="btn btn-grd-warning"
                        onClick={handleApplyChanges}
                      >
                        Apply Changes ({removedPermissions.length} removals)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="material-icons-outlined display-4 text-muted mb-3">
                    security
                  </i>
                  <h5 className="text-muted">
                    Select a role to manage permissions
                  </h5>
                  <p className="text-muted">
                    Click on a role name from the table to view and manage its
                    permissions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog">
            <div
              className={`card border-top border-3 ${modalAction === "delete" ? "border-danger" : "border-warning"} rounded-0`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header py-3 px-4">
                <h5
                  className={`mb-0 ${modalAction === "delete" ? "text-danger" : "text-warning"}`}
                >
                  Confirm {modalAction === "delete" ? "Delete" : "Disable"} Role
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to {modalAction} role{" "}
                  <strong>{targetRole?.name}</strong>?
                  {modalAction === "delete" && (
                    <span className="text-danger d-block mt-2">
                      This action cannot be undone.
                    </span>
                  )}
                </p>
                <div className="d-md-flex d-grid align-items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-grd-royal px-4 rounded-0"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${modalAction === "delete" ? "btn-grd-danger" : "btn-grd-warning"} px-4 rounded-0`}
                    onClick={handleConfirmAction}
                  >
                    {modalAction === "delete" ? "Delete" : "Disable"} Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default RolesPermissions;
