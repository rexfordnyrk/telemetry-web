import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import NewUserModal from "../components/NewUserModal";
import FilterModal from "../components/FilterModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteUser } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../hooks/useDataTable";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users } = useAppSelector((state) => state.users);
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
    const roles = [
      ...new Set(users.flatMap((u) => u.roles.map((r) => r.name))),
    ];
    const statuses = [...new Set(users.map((u) => u.status))];
    const organizations = [...new Set(users.map((u) => u.organization))];

    return {
      role: roles,
      status: statuses,
      organization: organizations,
      created_at: [], // Date range filter
    };
  }, [users]);

  // Initialize DataTable using custom hook
  useDataTable("users-datatable", memoizedUsers);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserRoles = (roles: any[]) => {
    return roles.map((role) => role.name).join(", ");
  };

  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: { bg: "success", text: "Active" },
      disabled: { bg: "danger", text: "Disabled" },
      pending: { bg: "warning", text: "Pending" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`dash-lable mb-0 bg-${config.bg} bg-opacity-10 text-${config.bg} rounded-2`}
      >
        {config.text}
      </span>
    );
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user-management/users/${userId}`);
  };

  const handleActionClick = (user: any, action: "disable" | "delete") => {
    setTargetUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(deleteUser(targetUser.id));
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `User "${targetUser?.first_name} ${targetUser?.last_name}" has been deleted.`,
        }),
      );
    } else {
      // Handle disable/enable logic here
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `User "${targetUser?.first_name} ${targetUser?.last_name}" has been ${targetUser?.status === "disabled" ? "enabled" : "disabled"}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetUser(null);
  };

  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
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
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Filters
            </button>
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => setShowNewUserModal(true)}
            >
              + | New User
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Users Management</h6>
        </div>
        <hr />
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
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
                <tbody>
                  {memoizedUsers.map((user: any) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt=""
                              className="rounded-circle"
                              width="40"
                              height="40"
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                fontSize: "14px",
                              }}
                            >
                              {getInitials(user.first_name, user.last_name)}
                            </div>
                          )}
                          <div>
                            <a
                              href="#"
                              className="text-decoration-none fw-bold text-dark"
                              onClick={(e) => {
                                e.preventDefault();
                                handleUserClick(user.id);
                              }}
                            >
                              {user.first_name} {user.last_name}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.organization}</td>
                      <td>{getUserRoles(user.roles)}</td>
                      <td>{getStatusElement(user.status)}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm p-1"
                            title="Edit User"
                            onClick={() => handleUserClick(user.id)}
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
                            title={
                              user.status === "disabled"
                                ? "Enable User"
                                : "Disable User"
                            }
                            onClick={() => handleActionClick(user, "disable")}
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          >
                            <i className="material-icons-outlined text-warning">
                              {user.status === "disabled"
                                ? "check_circle"
                                : "block"}
                            </i>
                          </button>
                          <button
                            className="btn btn-sm p-1"
                            title="Delete User"
                            onClick={() => handleActionClick(user, "delete")}
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
          </div>
        </div>
      </div>

      {/* New User Modal */}
      <NewUserModal
        show={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
      />

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        title="Users"
      />

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
                  Confirm {modalAction === "delete" ? "Delete" : "Disable"} User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to {modalAction} user{" "}
                  <strong>
                    {targetUser?.first_name} {targetUser?.last_name}
                  </strong>
                  ?
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
                    {modalAction === "delete" ? "Delete" : "Disable"} User
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

export default Users;
