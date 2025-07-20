/**
 * UserProfile Component
 * 
 * This component displays user information extracted from JWT claims.
 * It shows personal details, roles, and permissions in a user-friendly format.
 * 
 * Features:
 * - Display user's personal information
 * - Show user's roles and permissions
 * - Display token information
 * - Show account status and details
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { usePermissions } from '../hooks/usePermissions';

/**
 * UserProfile component that displays user information from JWT claims
 * 
 * @returns User profile information display
 */
const UserProfile: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { getAllRoles, getAllPermissions } = usePermissions();

  // If no user data, show loading or error
  if (!user) {
    return (
      <div className="alert alert-info" role="alert">
        Loading user profile...
      </div>
    );
  }

  const roles = getAllRoles();
  const permissions = getAllPermissions();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">User Profile</h4>
              <p className="card-subtitle text-muted">Information extracted from JWT token</p>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Personal Information */}
                <div className="col-md-6">
                  <h5 className="mb-3">Personal Information</h5>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Full Name:</strong></td>
                          <td>{user.fullName || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <td><strong>First Name:</strong></td>
                          <td>{user.firstName || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <td><strong>Last Name:</strong></td>
                          <td>{user.lastName || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <td><strong>Username:</strong></td>
                          <td>{user.username}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{user.email}</td>
                        </tr>
                        <tr>
                          <td><strong>User ID:</strong></td>
                          <td>
                            <code className="text-muted">{user.id}</code>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Account Information */}
                <div className="col-md-6">
                  <h5 className="mb-3">Account Information</h5>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Client ID:</strong></td>
                          <td>
                            {user.clientId ? (
                              <code className="text-muted">{user.clientId}</code>
                            ) : (
                              'Not provided'
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Scopes:</strong></td>
                          <td>
                            {user.scopes && user.scopes.length > 0 ? (
                              <div>
                                {user.scopes.map((scope, index) => (
                                  <span key={index} className="badge bg-primary me-1">
                                    {scope}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              'No scopes'
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Token Type:</strong></td>
                          <td>
                            <span className="badge bg-success">Bearer</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="row mt-4">
                <div className="col-12">
                  <h5 className="mb-3">Roles & Permissions</h5>
                  
                  {/* Roles */}
                  <div className="mb-4">
                    <h6>Roles ({roles.length})</h6>
                    {roles.length > 0 ? (
                      <div>
                        {roles.map((role, index) => (
                          <span key={index} className="badge bg-info me-2 mb-2">
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No roles assigned</p>
                    )}
                  </div>

                  {/* Permissions */}
                  <div>
                    <h6>Permissions ({permissions.length})</h6>
                    {permissions.length > 0 ? (
                      <div className="row">
                        {permissions.map((permission, index) => (
                          <div key={index} className="col-md-4 col-lg-3 mb-2">
                            <span className="badge bg-secondary">
                              {permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No permissions assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Token Information */}
              <div className="row mt-4">
                <div className="col-12">
                  <h5 className="mb-3">Token Information</h5>
                  <div className="alert alert-light">
                    <small>
                      <strong>JWT Token (first 50 characters):</strong><br />
                      <code className="text-muted">
                        {token ? `${token.substring(0, 50)}...` : 'No token available'}
                      </code>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 