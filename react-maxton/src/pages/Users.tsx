import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";

interface User {
  id: number;
  name: string;
  email: string;
  organization: string;
  role: string;
  status: "active" | "disabled" | "pending";
  created_at: string;
  avatar?: string;
}

const Users: React.FC = () => {
  // Sample data - in real app, this would come from API
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      organization: "Tech Corp",
      role: "Admin",
      status: "active",
      created_at: "2024-01-15",
      avatar: "/assets/images/avatars/01.png",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      organization: "Design Studio",
      role: "Manager",
      status: "active",
      created_at: "2024-01-20",
      avatar: "/assets/images/avatars/02.png",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@example.com",
      organization: "Marketing Inc",
      role: "User",
      status: "pending",
      created_at: "2024-01-25",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      organization: "Finance Ltd",
      role: "User",
      status: "disabled",
      created_at: "2024-01-10",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert.brown@example.com",
      organization: "Engineering Co",
      role: "Manager",
      status: "active",
      created_at: "2024-01-05",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetUser, setTargetUser] = useState<User | null>(null);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null || bVal == null) return 0;
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-success",
      disabled: "bg-danger",
      pending: "bg-warning text-dark",
    };
    return `badge ${statusClasses[status as keyof typeof statusClasses] || "bg-secondary"}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleActionClick = (user: User, action: "disable" | "delete") => {
    setTargetUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    // In real app, make API call here
    console.log(`${modalAction} user:`, targetUser);
    setShowModal(false);
    setTargetUser(null);
  };

  const handleUserClick = (userId: number) => {
    // Navigate to user details page
    window.location.href = `/user-management/users/${userId}`;
  };

  return (
    <MainLayout>
      <div className="page-content">
        <div className="row">
          <div className="col-12">
            <div className="card rounded-4">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="card-title mb-0">Users Management</h5>
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn btn-primary">
                      <i className="material-icons-outlined me-2">add</i>Add New
                      User
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="material-icons-outlined">search</i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    {selectedUsers.length > 0 && (
                      <div className="btn-group me-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Bulk Actions ({selectedUsers.length})
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm dropdown-toggle dropdown-toggle-split"
                          data-bs-toggle="dropdown"
                        >
                          <span className="visually-hidden">
                            Toggle Dropdown
                          </span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              Change Role
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Disable Accounts
                            </a>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <a className="dropdown-item text-danger" href="#">
                              Delete Users
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                    <select
                      className="form-select d-inline-block w-auto"
                      value={recordsPerPage}
                      onChange={(e) =>
                        setRecordsPerPage(Number(e.target.value))
                      }
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table
                    className="table table-striped table-hover"
                    id="usersTable"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                              selectedUsers.length === paginatedUsers.length &&
                              paginatedUsers.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>User</th>
                        <th
                          role="button"
                          onClick={() => handleSort("name")}
                          style={{ cursor: "pointer", userSelect: "none" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(0,0,0,0.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          Name
                          {sortField === "name" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th
                          role="button"
                          onClick={() => handleSort("email")}
                          className="sortable"
                        >
                          Email
                          {sortField === "email" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th
                          role="button"
                          onClick={() => handleSort("organization")}
                          className="sortable"
                        >
                          Organization
                          {sortField === "organization" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th
                          role="button"
                          onClick={() => handleSort("role")}
                          className="sortable"
                        >
                          Role
                          {sortField === "role" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th
                          role="button"
                          onClick={() => handleSort("status")}
                          className="sortable"
                        >
                          Status
                          {sortField === "status" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th
                          role="button"
                          onClick={() => handleSort("created_at")}
                          className="sortable"
                        >
                          Created At
                          {sortField === "created_at" && (
                            <i className="material-icons-outlined ms-1">
                              {sortDirection === "asc"
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          )}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt=""
                                  className="rounded-circle"
                                  width="32"
                                  height="32"
                                />
                              ) : (
                                <div
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {getInitials(user.name)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <a
                              href="#"
                              className="text-decoration-none fw-bold"
                              onClick={(e) => {
                                e.preventDefault();
                                handleUserClick(user.id);
                              }}
                            >
                              {user.name}
                            </a>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.organization}</td>
                          <td>{user.role}</td>
                          <td>
                            <span className={getStatusBadge(user.status)}>
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Actions
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleUserClick(user.id);
                                    }}
                                  >
                                    <i className="material-icons-outlined me-2">
                                      visibility
                                    </i>
                                    View Details
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#">
                                    <i className="material-icons-outlined me-2">
                                      edit
                                    </i>
                                    Edit User
                                  </a>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleActionClick(user, "disable");
                                    }}
                                  >
                                    <i className="material-icons-outlined me-2">
                                      block
                                    </i>
                                    {user.status === "disabled"
                                      ? "Enable"
                                      : "Disable"}{" "}
                                    User
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="dropdown-item text-danger"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleActionClick(user, "delete");
                                    }}
                                  >
                                    <i className="material-icons-outlined me-2">
                                      delete
                                    </i>
                                    Delete User
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="row align-items-center mt-3">
                  <div className="col-md-6">
                    <p className="mb-0 text-muted">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + recordsPerPage,
                        filteredAndSortedUsers.length,
                      )}{" "}
                      of {filteredAndSortedUsers.length} entries
                    </p>
                  </div>
                  <div className="col-md-6">
                    <nav>
                      <ul className="pagination justify-content-end mb-0">
                        <li
                          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1),
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
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
                  <strong>{targetUser?.name}</strong>?
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
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${modalAction === "delete" ? "btn-danger" : "btn-warning"}`}
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
