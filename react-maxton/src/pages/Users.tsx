import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import NewUserModal from "../components/NewUserModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteUser, updateUser } from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetUser, setTargetUser] = useState<any>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // For now, show all users (search functionality can be added later)
  const filteredUsers = users;

  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: {
        text: "Completed",
        class:
          "dash-lable mb-0 bg-success bg-opacity-10 text-success rounded-2",
      },
      pending: {
        text: "Pending",
        class:
          "dash-lable mb-0 bg-warning bg-opacity-10 text-warning rounded-2",
      },
      disabled: {
        text: "Canceled",
        class: "dash-lable mb-0 bg-danger bg-opacity-10 text-danger rounded-2",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={config.class}>{config.text}</span>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleActionClick = (user: any, action: "disable" | "delete") => {
    setTargetUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (!targetUser) return;

    if (modalAction === "delete") {
      dispatch(deleteUser(targetUser.id));
      dispatch(
        addAlert({
          type: "success",
          title: "User Deleted",
          message: `User ${targetUser.first_name} ${targetUser.last_name} has been deleted successfully.`,
        }),
      );
    } else {
      const updatedUser = {
        ...targetUser,
        status: targetUser.status === "disabled" ? "active" : "disabled",
      };
      dispatch(updateUser(updatedUser));
      dispatch(
        addAlert({
          type: "success",
          title: "User Updated",
          message: `User ${targetUser.first_name} ${targetUser.last_name} has been ${updatedUser.status === "disabled" ? "disabled" : "enabled"}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetUser(null);
  };

  const handleUserClick = (userId: string) => {
    window.location.href = `/user-management/users/${userId}`;
  };

  const getUserRoles = (roles: any[]) => {
    return roles.map((role) => role.name).join(", ");
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
                <li className="breadcrumb-item active" aria-current="page">
                  Users
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-grd-primary px-4"
                onClick={() => setShowNewUserModal(true)}
              >
                + | New User
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="mb-0">DataTable Example</h6>
                  </div>
                  <div className="col-auto">
                    <div className="dropdown">
                      <a
                        href="javascript:;"
                        className="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <span className="material-icons-outlined">
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
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered"
                    id="example"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
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
                          <td>{user.designation}</td>
                          <td>{user.organization}</td>
                          <td>{getUserRoles(user.roles)}</td>
                          <td>{getStatusElement(user.status)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <span>
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
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
                                  onClick={() =>
                                    handleActionClick(user, "disable")
                                  }
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
                                  onClick={() =>
                                    handleActionClick(user, "delete")
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Confirm {modalAction === "delete" ? "Delete" : "Disable"} User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-grd-royal px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${modalAction === "delete" ? "btn-grd-danger" : "btn-grd-warning"} px-4`}
                  onClick={handleConfirmAction}
                >
                  {modalAction === "delete" ? "Delete" : "Disable"} User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Users;
