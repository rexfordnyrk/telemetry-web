import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import MainLayout from "../layouts/MainLayout";
import NewUserModal from "../components/NewUserModal";
import FilterModal from "../components/FilterModal";
import PermissionRoute from "../components/PermissionRoute";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteUserAsync, fetchUsers } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../hooks/useDataTable";
import { usePermissions } from "../hooks/usePermissions";

/** Confirmation dialog for delete/disable user. Rendered with portal; matches RemoveRoleConfirmDialog pattern. */
function ConfirmUserActionDialog({
  action,
  userName,
  loading,
  onConfirm,
  onCancel,
}: {
  action: "disable" | "delete";
  userName: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isDelete = action === "delete";
  const title = isDelete ? "Confirm Delete User" : "Confirm Disable User";
  const confirmLabel = isDelete ? "Delete User" : "Disable User";
  const borderClass = isDelete ? "border-danger" : "border-warning";
  const titleClass = isDelete ? "text-danger" : "text-warning";
  const btnClass = isDelete ? "btn-grd-danger" : "btn-grd-warning";

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
        aria-labelledby="confirm-user-action-dialog-title"
        className={`card border-top border-3 ${borderClass} rounded-0`}
        style={{
          position: "relative",
          zIndex: 10001,
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <h5 id="confirm-user-action-dialog-title" className={`mb-0 ${titleClass}`}>
            {title}
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
            Are you sure you want to {action} user <strong>{userName}</strong>?
            {isDelete && (
              <span className="text-danger d-block mt-2">This action cannot be undone.</span>
            )}
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
              className={`btn ${btnClass} px-4 rounded-0`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {isDelete ? "Deleting..." : "Disabling..."}
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Users Page Component
 * 
 * This page displays a list of all users in the system.
 * Access is restricted to users with 'list_users' permission.
 * 
 * Features:
 * - View all users in a data table
 * - Filter users by various criteria
 * - Add new users (requires 'create_users' permission)
 * - Edit existing users
 * - Disable/enable users
 * - Delete users
 * - Permission-based access control
 */
const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);
  const permissions = usePermissions();
  
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetUser, setTargetUser] = useState<any>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>(
    {},
  );

  // Check if user has permission to create users
  const canCreateUsers = permissions.hasPermission('create_users');

  // Fetch users from API when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users based on active filters
  const filteredUsers = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return users;

    return users.filter((user) => {
      // Role filter
      if (activeFilters.role && activeFilters.role !== "") {
        const userRoles = user.roles.map((r) => r.name);
        if (!userRoles.includes(activeFilters.role)) return false;
      }

      // Status filter
      if (activeFilters.status && activeFilters.status !== user.status) {
        return false;
      }

      // Organization filter
      if (
        activeFilters.organization &&
        activeFilters.organization !== user.organization
      ) {
        return false;
      }

      // Date range filters
      if (activeFilters.created_at_from) {
        const userDate = new Date(user.created_at);
        const fromDate = new Date(activeFilters.created_at_from);
        if (userDate < fromDate) return false;
      }

      if (activeFilters.created_at_to) {
        const userDate = new Date(user.created_at);
        const toDate = new Date(activeFilters.created_at_to);
        if (userDate > toDate) return false;
      }

      return true;
    });
  }, [users, activeFilters]);

  // Memoize filtered users to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => filteredUsers, [filteredUsers]);

  // Define filter options
  const filterOptions = useMemo(() => {
    const rolesSet = new Set(users.flatMap((u) => u.roles.map((r) => r.name)));
    const statusesSet = new Set(users.map((u) => u.status));
    const organizationsSet = new Set(users.map((u) => u.organization));

    return {
      role: Array.from(rolesSet),
      status: Array.from(statusesSet),
      organization: Array.from(organizationsSet),
      created_at: [], // Date range filter
    };
  }, [users]);

  // DataTables column definitions – data-driven table so React never touches tbody (fixes insertBefore error)
  const dataTableColumns = useMemo(
    () => [
      {
        title: "Name",
        data: "first_name",
        orderable: true,
        render(data: string, type: string, row: any) {
          if (type !== "display") return data;
          const fn = row.first_name || "";
          const ln = row.last_name || "";
          const initials = (fn.charAt(0) + ln.charAt(0)).toUpperCase();
          const name = `${fn} ${ln}`.trim() || "—";
          const photoHtml = row.photo
            ? `<img src="${row.photo}" alt="" class="rounded-circle" width="40" height="40" />`
            : `<div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:40px;height:40px;font-size:14px">${initials}</div>`;
          return `<div class="d-flex align-items-center gap-3">${photoHtml}<div><a href="#" class="text-decoration-none fw-bold users-table-name-link" data-user-id="${row.id}">${name}</a></div></div>`;
        },
      },
      { title: "Email", data: "email", orderable: true },
      { title: "Organization", data: "organization", orderable: true },
      {
        title: "Role",
        data: "roles",
        orderable: true,
        render(data: any[], type: string) {
          if (type !== "display" || !Array.isArray(data)) return "";
          return data.map((r: any) => r.name).join(", ");
        },
      },
      {
        title: "Status",
        data: "status",
        orderable: true,
        render(data: string, type: string) {
          if (type !== "display") return data;
          const map: Record<string, { bg: string; text: string }> = {
            active: { bg: "success", text: "Active" },
            disabled: { bg: "danger", text: "Disabled" },
            pending: { bg: "warning", text: "Pending" },
          };
          const cfg = map[data] || map.pending;
          return `<span class="dash-lable mb-0 bg-${cfg.bg} bg-opacity-10 text-${cfg.bg} rounded-2">${cfg.text}</span>`;
        },
      },
      {
        title: "Created At",
        data: "created_at",
        orderable: true,
        render(data: string, type: string) {
          if (type !== "display" || !data) return "";
          return new Date(data).toLocaleDateString();
        },
      },
      {
        title: "Actions",
        orderable: false,
        data: null,
        defaultContent: "",
        render(_: any, type: string, row: any) {
          if (type !== "display") return "";
          const disableTitle = row.status === "disabled" ? "Enable User" : "Disable User";
          const disableIcon = row.status === "disabled" ? "check_circle" : "block";
          return `<div class="d-flex gap-1">
            <button type="button" class="btn btn-sm p-1 users-table-action" title="Edit User" data-user-id="${row.id}" data-action="edit" style="border:none;background:transparent"><i class="material-icons-outlined text-primary">edit</i></button>
            <button type="button" class="btn btn-sm p-1 users-table-action" title="${disableTitle}" data-user-id="${row.id}" data-action="disable" style="border:none;background:transparent"><i class="material-icons-outlined text-warning">${disableIcon}</i></button>
            <button type="button" class="btn btn-sm p-1 users-table-action" title="Delete User" data-user-id="${row.id}" data-action="delete" style="border:none;background:transparent"><i class="material-icons-outlined text-danger">delete</i></button>
          </div>`;
        },
      },
    ],
    [],
  );

  const dataTableOptions = useMemo(
    () => ({
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      order: [[0, "asc"]] as [number, string][],
      columnDefs: [{ orderable: false, targets: -1 }],
      columns: dataTableColumns,
    }),
    [dataTableColumns],
  );

  // Initialize DataTable in data-driven mode so updates go through DataTables API (no React DOM conflict)
  const { isInitialized, destroyDataTable } = useDataTable(
    "users-datatable",
    memoizedUsers,
    dataTableOptions,
    !loading && memoizedUsers.length > 0,
  );

  // Destroy DataTable when refetch starts (e.g. loading with no data)
  useEffect(() => {
    if (loading && isInitialized) {
      destroyDataTable();
    }
  }, [loading, isInitialized, destroyDataTable]);

  // Cleanup DataTable when component unmounts
  useEffect(() => {
    return () => {
      destroyDataTable();
    };
  }, [destroyDataTable]);

  const handleUserClick = useCallback(
    (userId: string) => {
      navigate(`/user-management/users/${userId}`);
    },
    [navigate],
  );

  const handleActionClick = useCallback((user: any, action: "disable" | "delete") => {
    setTargetUser(user);
    setModalAction(action);
    setShowModal(true);
  }, []);

  // Refs for event delegation so DataTables-rendered buttons still trigger React handlers
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const handlersRef = useRef({
    memoizedUsers,
    handleUserClick,
    handleActionClick,
  });
  handlersRef.current = { memoizedUsers, handleUserClick, handleActionClick };

  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    const onTableClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nameLink = target.closest(".users-table-name-link") as HTMLElement | null;
      const actionBtn = target.closest(".users-table-action") as HTMLElement | null;
      const userId = nameLink?.getAttribute("data-user-id") ?? actionBtn?.getAttribute("data-user-id");
      const action = actionBtn?.getAttribute("data-action");
      if (!userId) return;
      const { memoizedUsers: list, handleUserClick: go, handleActionClick: act } = handlersRef.current;
      const user = list.find((u: any) => u.id === userId);
      if (nameLink) {
        e.preventDefault();
        go(userId);
      } else if (actionBtn && user) {
        if (action === "edit") go(userId);
        else if (action === "disable" || action === "delete") act(user, action);
      }
    };
    el.addEventListener("click", onTableClick);
    return () => el.removeEventListener("click", onTableClick);
  }, []);

  const handleConfirmAction = () => {
    const user = targetUser;
    const userName = user ? `${user.first_name} ${user.last_name}` : "";

    // Destroy DataTable before closing modal so React never reconciles DataTables-mutated DOM (fixes insertBefore crash)
    destroyDataTable();

    setShowModal(false);
    setTargetUser(null);

    if (modalAction === "delete" && user) {
      dispatch(deleteUserAsync(user.id))
        .unwrap()
        .then(() => {
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: `User "${userName}" has been deleted.`,
            }),
          );
        })
        .catch((err: unknown) => {
          dispatch(
            addAlert({
              type: "danger",
              title: "Delete User Failed",
              message: err instanceof Error ? err.message : "Failed to delete user.",
            }),
          );
        });
    } else if (modalAction === "disable" && user) {
      // Handle disable/enable logic here (placeholder – no API yet)
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `User "${userName}" has been ${user.status === "disabled" ? "enabled" : "disabled"}.`,
        }),
      );
    }
  };

  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
  };

  return (
    <PermissionRoute requiredPermissions={['list_users']}>
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
                    Users
                  </li>
                </ol>
              </nav>
            </div>
            <div className="ms-auto d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={() => setShowFilterModal(true)}
                disabled={loading}
              >
                <i className="material-icons-outlined me-1">filter_list</i>
                Filters
              </button>
              {canCreateUsers ? (
                <button
                  type="button"
                  className="btn btn-grd-primary px-4"
                  onClick={() => setShowNewUserModal(true)}
                  disabled={loading}
                >
                  + | New User
                </button>
              ) : (
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2">
                    <i className="material-icons-outlined me-1" style={{ fontSize: '16px' }}>info</i>
                    Create users permission required
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Page Title */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-uppercase">Users Management</h6>
            {loading && (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-muted">Loading users...</span>
              </div>
            )}
          </div>
          <hr />

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch({ type: 'users/clearError' })}
              ></button>
            </div>
          )}

          {/* Users Table */}
          <div className="card">
            <div className="card-body">
              {loading && memoizedUsers.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading users from server...</p>
                </div>
              ) : (
                <div className="table-responsive" ref={tableContainerRef}>
                  {loading && memoizedUsers.length > 0 && (
                    <div className="text-center py-2 text-muted small">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Updating...
                    </div>
                  )}
                  <table
                    id="users-datatable"
                    className="table table-striped table-bordered"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody />
                    <tfoot>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New User Modal */}
        <NewUserModal
          show={showNewUserModal}
          onClose={() => setShowNewUserModal(false)}
          onBeforeSuccess={destroyDataTable}
          onSuccess={() => dispatch(fetchUsers())}
        />

        {/* Filter Modal */}
        <FilterModal
          show={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filterOptions={filterOptions}
          onApplyFilters={handleApplyFilters}
          title="Users"
        />

        {/* Confirmation dialog: portaled like RemoveRoleConfirmDialog on UserDetails */}
        {showModal &&
          targetUser &&
          createPortal(
            <ConfirmUserActionDialog
              action={modalAction}
              userName={`${targetUser.first_name} ${targetUser.last_name}`}
              loading={modalAction === "delete" ? loading : false}
              onConfirm={handleConfirmAction}
              onCancel={() => {
                setShowModal(false);
                setTargetUser(null);
              }}
            />,
            document.body,
          )}
      </MainLayout>
    </PermissionRoute>
  );
};

export default Users;
