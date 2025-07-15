import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import NewUserModal from "../components/NewUserModal";
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

  // Memoize users to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => users, [users]);

  // Initialize DataTable using custom hook
  useDataTable("users-datatable", memoizedUsers);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserRoles = (roles: any[]) => {
    return roles.map((role) => role.name).join(", ");
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

        {/* Add New User Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Users Management</h6>
          <button
            type="button"
            className="btn btn-grd-primary px-4"
            onClick={() => setShowNewUserModal(true)}
          >
            + | New User
          </button>
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
