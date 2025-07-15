import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const RolesPermissions: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetRole, setTargetRole] = useState<any>(null);

  // Sample roles data matching DataTable structure
  const roles = [
    {
      id: "1",
      name: "Administrator",
      permissions: "All permissions",
      users_count: 5,
      description: "Full system access",
      created_at: "2023-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Manager",
      permissions: "Limited permissions",
      users_count: 12,
      description: "Management access",
      created_at: "2023-02-20",
      status: "active",
    },
    {
      id: "3",
      name: "User",
      permissions: "Basic permissions",
      users_count: 45,
      description: "Standard user access",
      created_at: "2023-03-10",
      status: "active",
    },
    {
      id: "4",
      name: "Guest",
      permissions: "Read-only",
      users_count: 8,
      description: "Limited read access",
      created_at: "2023-04-05",
      status: "disabled",
    },
  ];

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
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-grd-primary px-4"
                onClick={() => setShowNewRoleModal(true)}
              >
                + | New Role
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
                      {roles.map((role) => (
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
                                  }}
                                >
                                  {role.name}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td>{role.permissions}</td>
                          <td>{role.description}</td>
                          <td>{role.users_count} users</td>
                          <td>{getStatusElement(role.status)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <span>
                                {new Date(role.created_at).toLocaleDateString()}
                              </span>
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
                                  title={
                                    role.status === "disabled"
                                      ? "Enable Role"
                                      : "Disable Role"
                                  }
                                  onClick={() =>
                                    handleActionClick(role, "disable")
                                  }
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                >
                                  <i className="material-icons-outlined text-warning">
                                    {role.status === "disabled"
                                      ? "check_circle"
                                      : "block"}
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
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
