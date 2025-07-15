import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  organization: string;
  photo?: string;
  status: "active" | "disabled" | "pending";
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

const Users: React.FC = () => {
  // Sample data with new structure
  const [users] = useState<User[]>([
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      first_name: "John",
      last_name: "Smith",
      username: "john_smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      designation: "Software Engineer",
      organization: "Tech Corp",
      photo: "/assets/images/avatars/01.png",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          name: "admin",
          description: "Administrator role with full permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      first_name: "Sarah",
      last_name: "Johnson",
      username: "sarah_johnson",
      email: "sarah.johnson@example.com",
      phone: "+1234567891",
      designation: "UI/UX Designer",
      organization: "Design Studio",
      photo: "/assets/images/avatars/02.png",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          name: "manager",
          description: "Manager role with team permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-20T00:00:00Z",
      updated_at: "2024-01-20T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      first_name: "Mike",
      last_name: "Wilson",
      username: "mike_wilson",
      email: "mike.wilson@example.com",
      phone: "+1234567892",
      designation: "Marketing Specialist",
      organization: "Marketing Inc",
      status: "pending",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-25T00:00:00Z",
      updated_at: "2024-01-25T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      first_name: "Emily",
      last_name: "Davis",
      username: "emily_davis",
      email: "emily.davis@example.com",
      phone: "+1234567893",
      designation: "Financial Analyst",
      organization: "Finance Ltd",
      status: "disabled",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      first_name: "Robert",
      last_name: "Brown",
      username: "robert_brown",
      email: "robert.brown@example.com",
      phone: "+1234567894",
      designation: "Senior Developer",
      organization: "Engineering Co",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          name: "manager",
          description: "Manager role with team permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetUser, setTargetUser] = useState<User | null>(null);

  // Initialize DataTables after component mounts
  useEffect(() => {
    // DataTables initialization would go here in a real implementation
    // For now, we'll handle sorting manually
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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

  const handleUserClick = (userId: string) => {
    // Navigate to user details page
    window.location.href = `/user-management/users/${userId}`;
  };

  const getUserRoles = (roles: Role[]) => {
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
              <button type="button" className="btn btn-primary">
                <i className="material-icons-outlined me-2">add</i>Add New User
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered"
                    id="usersTable"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                              selectedUsers.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Designation</th>
                        <th>Organization</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
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
                            <div className="d-flex align-items-center">
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
                              {user.first_name} {user.last_name}
                            </a>
                          </td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.designation}</td>
                          <td>{user.organization}</td>
                          <td>
                            <span className="badge bg-info text-white">
                              {getUserRoles(user.roles)}
                            </span>
                          </td>
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
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="Edit User"
                                onClick={() => handleUserClick(user.id)}
                              >
                                <i className="material-icons-outlined">edit</i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                title={
                                  user.status === "disabled"
                                    ? "Enable User"
                                    : "Disable User"
                                }
                                onClick={() =>
                                  handleActionClick(user, "disable")
                                }
                              >
                                <i className="material-icons-outlined">
                                  {user.status === "disabled"
                                    ? "check_circle"
                                    : "block"}
                                </i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete User"
                                onClick={() =>
                                  handleActionClick(user, "delete")
                                }
                              >
                                <i className="material-icons-outlined">
                                  delete
                                </i>
                              </button>
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
