import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppSelector } from "../store/hooks";
import { usePermissions } from "../hooks/usePermissions";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../config/api";

export interface AuthEventRecord {
  id: string;
  created_at: string;
  user_id?: string;
  email?: string;
  event_type: string;
  success: boolean;
  ip_address?: string;
  user_agent?: string;
}

interface AuthEventListResponse {
  data: AuthEventRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthEventFilters {
  email: string;
  event_type: string;
  success: string;
  from: string;
  to: string;
}

const emptyFilters: AuthEventFilters = {
  email: "",
  event_type: "",
  success: "",
  from: "",
  to: "",
};

const AuthAuditLog: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const { hasPermission } = usePermissions();
  const canExport = hasPermission("export_auth_events");

  const [events, setEvents] = useState<AuthEventRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuthEventFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<AuthEventFilters>(emptyFilters);

  const buildQueryString = useCallback(
    (activeFilters: AuthEventFilters, page = 1, limit = 50) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (activeFilters.email) params.set("email", activeFilters.email);
      if (activeFilters.event_type)
        params.set("event_type", activeFilters.event_type);
      if (activeFilters.success)
        params.set("success", activeFilters.success);
      if (activeFilters.from) params.set("from", activeFilters.from);
      if (activeFilters.to) params.set("to", activeFilters.to);
      return params.toString();
    },
    []
  );

  const loadEvents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(appliedFilters);
      const response = await fetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.AUTH_EVENTS)}?${qs}`,
        { headers: getAuthHeaders(token) }
      );
      if (!response.ok) {
        throw new Error("Failed to load auth events");
      }
      const data: AuthEventListResponse = await response.json();
      setEvents(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load auth events"
      );
    } finally {
      setLoading(false);
    }
  }, [token, appliedFilters, buildQueryString]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
  };

  const handleExport = async () => {
    if (!token || !canExport) return;
    const qs = buildQueryString(appliedFilters);
    const response = await fetch(
      `${buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.AUTH_EVENTS_EXPORT)}?${qs}`,
      { headers: getAuthHeaders(token) }
    );
    if (!response.ok) return;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "auth-events.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">User Management</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Auth Audit Log
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Authentication Audit Log</h5>
              {canExport && (
                <button
                  type="button"
                  className="btn btn-grd-primary"
                  onClick={handleExport}
                  data-testid="export-auth-events"
                >
                  Export CSV
                </button>
              )}
            </div>

            <form
              className="row g-3 mb-4"
              onSubmit={handleApplyFilters}
              data-testid="auth-event-filters"
            >
              <div className="col-md-3">
                <label htmlFor="filterEmail" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="filterEmail"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="filterEventType" className="form-label">
                  Event type
                </label>
                <select
                  className="form-select"
                  id="filterEventType"
                  name="event_type"
                  value={filters.event_type}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="login_success">Login success</option>
                  <option value="login_failure">Login failure</option>
                  <option value="logout">Logout</option>
                  <option value="lockout">Lockout</option>
                  <option value="password_reset">Password reset</option>
                  <option value="refresh">Token refresh</option>
                  <option value="mfa_verify_success">MFA verify success</option>
                  <option value="mfa_verify_failed">MFA verify failed</option>
                  <option value="mfa_admin_reset">MFA admin reset</option>
                  <option value="role_assigned">Role assigned</option>
                  <option value="role_removed">Role removed</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="filterSuccess" className="form-label">
                  Success
                </label>
                <select
                  className="form-select"
                  id="filterSuccess"
                  name="success"
                  value={filters.success}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="filterFrom" className="form-label">
                  From
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="filterFrom"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-outline-primary w-100">
                  Apply filters
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="d-flex align-items-center py-3">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Loading events...
              </div>
            ) : (
              <>
                <p className="text-muted small">
                  Showing {events.length} of {total} events
                </p>
                <div className="table-responsive">
                  <table
                    className="table table-striped"
                    data-testid="auth-events-table"
                  >
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Email</th>
                        <th>Event</th>
                        <th>Success</th>
                        <th>IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} data-testid="auth-event-row">
                          <td>{new Date(event.created_at).toLocaleString()}</td>
                          <td>{event.email || "—"}</td>
                          <td>{event.event_type}</td>
                          <td>{event.success ? "Yes" : "No"}</td>
                          <td>{event.ip_address || "—"}</td>
                        </tr>
                      ))}
                      {events.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No events found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthAuditLog;
