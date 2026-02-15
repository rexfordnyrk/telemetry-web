import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import NewRoleModal from "../components/NewRoleModal";
import PermissionRoute from "../components/PermissionRoute";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import {
  fetchRoles,
  fetchPermissions,
  fetchRoleById,
  deleteRole,
  assignPermissionsToRole,
  removePermissionsFromRole,
  setSelectedRole,
  Role,
  Permission,
} from "../store/slices/rolesPermissionsSlice";
import { useDataTable } from "../hooks/useDataTable";
import { usePermissions } from "../hooks/usePermissions";

/**
 * Roles & Permissions Management Page
 *
 * This page allows administrators to:
 * - View all roles in a data table
 * - Create new roles
 * - Edit existing roles
 * - Delete roles
 * - Manage permissions for each role (add/remove)
 */
const RolesPermissions: React.FC = () => {
  const dispatch = useAppDispatch();
  const permissions = usePermissions();

  // Redux state
  const {
    roles,
    selectedRole,
    rolesLoading,
    roleDetailLoading,
    rolesError,
    permissions: allPermissions,
    permissionsLoading,
    assignLoading,
    deleteLoading,
  } = useAppSelector((state) => state.rolesPermissions);

  // Local state for UI
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"delete">("delete");
  const [targetRole, setTargetRole] = useState<Role | null>(null);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Track pending permission changes
  const [pendingAdditions, setPendingAdditions] = useState<Permission[]>([]);
  const [pendingRemovals, setPendingRemovals] = useState<Permission[]>([]);

  // Check permissions for creating roles
  const canCreateRoles = permissions.hasPermission("create_roles");
  const canUpdateRoles = permissions.hasPermission("update_roles");
  const canDeleteRoles = permissions.hasPermission("delete_roles");

  // Fetch roles and permissions on component mount
  // Uses a ref to prevent duplicate fetches in StrictMode
  const fetchedRef = React.useRef(false);
  
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    dispatch(fetchRoles({ page: 1, limit: 100 }));
    dispatch(fetchPermissions({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Memoize roles to prevent unnecessary re-renders
  const memoizedRoles = useMemo(() => roles, [roles]);

  // Initialize DataTable using custom hook
  const { isInitialized, destroyDataTable } = useDataTable(
    "roles-datatable",
    memoizedRoles,
    {
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      order: [[0, "asc"]],
      columnDefs: [
        { orderable: false, targets: -1 }, // Disable ordering on actions column
      ],
    },
    !rolesLoading && memoizedRoles.length > 0
  );

  // Generate a key for the table to force re-render when data changes
  const tableKey = useMemo(() => {
    return `roles-table-${memoizedRoles.length}-${rolesLoading}`;
  }, [memoizedRoles.length, rolesLoading]);

  // Cleanup DataTable when component unmounts
  useEffect(() => {
    return () => {
      destroyDataTable();
    };
  }, [destroyDataTable]);

  // Reset pending changes when selected role changes
  useEffect(() => {
    setPendingAdditions([]);
    setPendingRemovals([]);
  }, [selectedRole?.id]);

  // Handle role selection - fetch full role details with permissions
  const handleRoleClick = async (role: Role) => {
    try {
      await dispatch(fetchRoleById(role.id)).unwrap();
    } catch (error) {
      console.error("Failed to fetch role details:", error);
      dispatch(
        addAlert({
          type: "danger",
          title: "Error",
          message: "Failed to load role permissions. Please try again.",
        })
      );
    }
  };

  // Get current permissions (from selected role minus pending removals)
  const getCurrentPermissions = (): Permission[] => {
    if (!selectedRole?.permissions) return [];
    return selectedRole.permissions.filter(
      (permission) => !pendingRemovals.find((pr) => pr.id === permission.id)
    );
  };

  // Get available permissions (all permissions minus current and pending additions)
  const getAvailablePermissions = (): Permission[] => {
    if (!selectedRole) return [];
    const currentPermissionIds = (selectedRole.permissions || []).map((p) => p.id);
    const pendingAdditionIds = pendingAdditions.map((p) => p.id);
    const pendingRemovalIds = pendingRemovals.map((p) => p.id);

    return getFilteredPermissions().filter(
      (permission) =>
        // Not in current permissions (unless it's pending removal)
        (!currentPermissionIds.includes(permission.id) ||
          pendingRemovalIds.includes(permission.id)) &&
        // Not already pending addition
        !pendingAdditionIds.includes(permission.id)
    );
  };

  // Filter permissions by search term
  const getFilteredPermissions = (): Permission[] => {
    if (!searchTerm) return allPermissions;
    return allPermissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle adding a permission to pending additions
  const handleAssignPermission = (permission: Permission) => {
    // Check if this permission was previously in pending removals
    const wasRemoved = pendingRemovals.find((pr) => pr.id === permission.id);
    if (wasRemoved) {
      // Just restore it (remove from pending removals)
      setPendingRemovals((prev) => prev.filter((p) => p.id !== permission.id));
    } else {
      // Add to pending additions
      setPendingAdditions((prev) => [...prev, permission]);
    }
  };

  // Handle removing a permission (add to pending removals)
  const handleRemovePermission = (permission: Permission) => {
    // Check if this permission was in pending additions
    const wasAdded = pendingAdditions.find((pa) => pa.id === permission.id);
    if (wasAdded) {
      // Just remove from pending additions
      setPendingAdditions((prev) => prev.filter((p) => p.id !== permission.id));
    } else {
      // Add to pending removals
      setPendingRemovals((prev) => [...prev, permission]);
    }
  };

  // Handle restoring a removed permission
  const handleRestorePermission = (permission: Permission) => {
    setPendingRemovals((prev) => prev.filter((p) => p.id !== permission.id));
  };

  // Handle removing a pending addition
  const handleRemovePendingAddition = (permission: Permission) => {
    setPendingAdditions((prev) => prev.filter((p) => p.id !== permission.id));
  };

  // Apply pending permission changes
  const handleApplyChanges = async () => {
    if (!selectedRole) return;

    let hasChanges = false;

    try {
      // Apply additions
      if (pendingAdditions.length > 0) {
        const additionIds = pendingAdditions.map((p) => p.id);
        await dispatch(
          assignPermissionsToRole({
            roleId: selectedRole.id,
            permissionIds: additionIds,
          })
        ).unwrap();
        hasChanges = true;
      }

      // Apply removals
      if (pendingRemovals.length > 0) {
        const removalIds = pendingRemovals.map((p) => p.id);
        await dispatch(
          removePermissionsFromRole({
            roleId: selectedRole.id,
            permissionIds: removalIds,
          })
        ).unwrap();
        hasChanges = true;
      }

      if (hasChanges) {
        // Build success message
        let message = "";
        if (pendingRemovals.length > 0) {
          message += `${pendingRemovals.length} permission(s) removed`;
        }
        if (pendingAdditions.length > 0) {
          if (message) message += " and ";
          message += `${pendingAdditions.length} permission(s) added`;
        }

        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: `${message} for role "${selectedRole.name}".`,
          })
        );

        // Clear pending changes
        setPendingAdditions([]);
        setPendingRemovals([]);

        // Refresh role data to get updated permissions
        await dispatch(fetchRoleById(selectedRole.id)).unwrap();
      }
    } catch (error) {
      console.error("Failed to apply permission changes:", error);
      dispatch(
        addAlert({
          type: "danger",
          title: "Error",
          message: "Failed to apply permission changes. Please try again.",
        })
      );
    }
  };

  // Handle edit role
  const handleEditRole = (role: Role) => {
    setEditRole(role);
    setShowNewRoleModal(true);
  };

  // Handle delete role confirmation
  const handleActionClick = (role: Role, action: "delete") => {
    setTargetRole(role);
    setModalAction(action);
    setShowModal(true);
  };

  // Confirm delete action
  const handleConfirmAction = async () => {
    if (!targetRole) return;

    try {
      await dispatch(deleteRole(targetRole.id)).unwrap();

      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Role "${targetRole.name}" has been deleted.`,
        })
      );

      // Clear selected role if it was the deleted one
      if (selectedRole?.id === targetRole.id) {
        dispatch(setSelectedRole(null));
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      dispatch(
        addAlert({
          type: "danger",
          title: "Error",
          message: `Failed to delete role "${targetRole.name}". Please try again.`,
        })
      );
    }

    setShowModal(false);
    setTargetRole(null);
  };

  // Handle successful role creation/update
  const handleRoleSuccess = () => {
    dispatch(fetchRoles({ page: 1, limit: 100 }));
  };

  // Close role modal and clear edit state
  const handleCloseRoleModal = () => {
    setShowNewRoleModal(false);
    setEditRole(null);
  };

  return (
    <PermissionRoute requiredPermissions={["list_roles"]}>
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
            <div className="ms-auto d-flex gap-2">
              {canCreateRoles ? (
                <button
                  type="button"
                  className="btn btn-grd-primary px-4"
                  onClick={() => {
                    setEditRole(null);
                    setShowNewRoleModal(true);
                  }}
                  disabled={rolesLoading}
                >
                  + | New Role
                </button>
              ) : (
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2">
                    <i
                      className="material-icons-outlined me-1"
                      style={{ fontSize: "16px" }}
                    >
                      info
                    </i>
                    Create roles permission required
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Page Title */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-uppercase">Roles & Permissions Management</h6>
            {rolesLoading && (
              <div className="d-flex align-items-center">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-muted">Loading roles...</span>
              </div>
            )}
          </div>
          <hr />

          {/* Error Alert */}
          {rolesError && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <strong>Error:</strong> {rolesError}
              <button
                type="button"
                className="btn-close"
                onClick={() =>
                  dispatch({ type: "rolesPermissions/clearRolesError" })
                }
              ></button>
            </div>
          )}

          <div className="row">
            {/* Left Half - Roles Table */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  {rolesLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading roles...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table
                        id="roles-datatable"
                        className="table table-striped table-bordered"
                        style={{ width: "100%" }}
                        key={tableKey}
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memoizedRoles.map((role) => (
                            <tr
                              key={role.id}
                              className={
                                selectedRole?.id === role.id ? "table-active" : ""
                              }
                            >
                              <td>
                                <a
                                  href="#"
                                  className="text-decoration-none fw-bold"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRoleClick(role);
                                  }}
                                >
                                  {role.name}
                                </a>
                              </td>
                              <td>{role.description || "-"}</td>
                              <td>
                                {new Date(role.updated_at).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {canUpdateRoles && (
                                    <button
                                      className="btn btn-sm p-1"
                                      title="Edit Role"
                                      onClick={() => handleEditRole(role)}
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    >
                                      <i className="material-icons-outlined text-primary">
                                        edit
                                      </i>
                                    </button>
                                  )}
                                  {canDeleteRoles && (
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
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Half - Permission Management */}
            <div className="col-md-6">
              {selectedRole ? (
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      Manage Permissions for: <strong>{selectedRole.name}</strong>
                    </h6>
                    {(assignLoading || permissionsLoading || roleDetailLoading) && (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    {/* Current Permissions */}
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="material-icons-outlined me-1" style={{ fontSize: "18px", verticalAlign: "middle" }}>
                          verified_user
                        </i>
                        Current Permissions ({getCurrentPermissions().length})
                      </h6>
                      {getCurrentPermissions().length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {getCurrentPermissions().map((permission) => (
                            <span
                              key={permission.id}
                              className="badge bg-primary d-flex align-items-center gap-2"
                              title={permission.description}
                            >
                              {permission.name}
                              {canUpdateRoles && (
                                <button
                                  type="button"
                                  className="btn-close btn-close-white"
                                  style={{ fontSize: "0.75em" }}
                                  onClick={() => handleRemovePermission(permission)}
                                  title="Remove permission"
                                ></button>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          No permissions assigned to this role.
                        </p>
                      )}
                    </div>

                    {/* Removed Permissions (for undo) */}
                    {pendingRemovals.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-warning mb-3">
                          <i className="material-icons-outlined me-1" style={{ fontSize: "18px", verticalAlign: "middle" }}>
                            remove_circle
                          </i>
                          Pending Removals (Click to restore)
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {pendingRemovals.map((permission) => (
                            <span
                              key={permission.id}
                              className="badge bg-warning cursor-pointer"
                              onClick={() => handleRestorePermission(permission)}
                              title="Click to restore"
                              style={{ cursor: "pointer" }}
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

                    {/* New Permissions (to be added) */}
                    {pendingAdditions.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-success mb-3">
                          <i className="material-icons-outlined me-1" style={{ fontSize: "18px", verticalAlign: "middle" }}>
                            add_circle
                          </i>
                          Pending Additions ({pendingAdditions.length})
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {pendingAdditions.map((permission) => (
                            <span
                              key={permission.id}
                              className="badge bg-success d-flex align-items-center gap-2"
                              title={permission.description}
                            >
                              {permission.name}
                              <button
                                type="button"
                                className="btn-close btn-close-white"
                                style={{ fontSize: "0.75em" }}
                                onClick={() =>
                                  handleRemovePendingAddition(permission)
                                }
                                title="Remove from assignment"
                              ></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Permissions */}
                    {canUpdateRoles && (
                      <div className="mb-4">
                        <h6 className="text-info mb-3">
                          <i className="material-icons-outlined me-1" style={{ fontSize: "18px", verticalAlign: "middle" }}>
                            playlist_add
                          </i>
                          Available Permissions
                        </h6>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search permissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        {permissionsLoading ? (
                          <div className="text-center py-3">
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="d-flex flex-wrap gap-2"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {getAvailablePermissions().length > 0 ? (
                              getAvailablePermissions().map((permission) => (
                                <span
                                  key={permission.id}
                                  className="badge bg-light text-dark border cursor-pointer"
                                  style={{ cursor: "pointer", fontSize: "0.85em" }}
                                  onClick={() => handleAssignPermission(permission)}
                                  title={permission.description || "Click to add"}
                                >
                                  {permission.name}
                                </span>
                              ))
                            ) : (
                              <p className="text-muted mb-0">
                                {searchTerm
                                  ? "No matching permissions found."
                                  : "All permissions have been assigned."}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Apply Changes Button */}
                    {(pendingRemovals.length > 0 || pendingAdditions.length > 0) && (
                      <div className="d-grid">
                        <button
                          type="button"
                          className="btn btn-grd-primary"
                          onClick={handleApplyChanges}
                          disabled={assignLoading}
                        >
                          {assignLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Applying Changes...
                            </>
                          ) : (
                            <>
                              Apply Changes (
                              {pendingRemovals.length > 0 &&
                                `${pendingRemovals.length} removals`}
                              {pendingRemovals.length > 0 &&
                                pendingAdditions.length > 0 &&
                                ", "}
                              {pendingAdditions.length > 0 &&
                                `${pendingAdditions.length} additions`}
                              )
                            </>
                          )}
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

        {/* New/Edit Role Modal */}
        <NewRoleModal
          show={showNewRoleModal}
          onClose={handleCloseRoleModal}
          onSuccess={handleRoleSuccess}
          editRole={editRole}
        />

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowModal(false)}
          >
            <div className="modal-dialog">
              <div
                className="card border-top border-3 border-danger rounded-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-header py-3 px-4">
                  <h5 className="mb-0 text-danger">Confirm Delete Role</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="card-body p-4">
                  <p>
                    Are you sure you want to delete role{" "}
                    <strong>{targetRole?.name}</strong>?
                  </p>
                  <p className="text-danger d-block mt-2">
                    <i className="material-icons-outlined me-1" style={{ fontSize: "16px", verticalAlign: "middle" }}>
                      warning
                    </i>
                    This action cannot be undone. Users assigned to this role will
                    lose their associated permissions.
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
                      className="btn btn-grd-danger px-4 rounded-0"
                      onClick={handleConfirmAction}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete Role"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </PermissionRoute>
  );
};

export default RolesPermissions;
