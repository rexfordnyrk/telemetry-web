import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Nav,
  Tab,
  Table,
  Badge,
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Tab state
  const [activeTab, setActiveTab] = useState("home");

  // Sample devices data (would come from store in real app) - memoized to prevent re-renders
  const devices = useMemo(
    () => [
      {
        id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
        device_name: "Pixel 7",
        android_version: "Android 13",
        app_version: "1.2.3",
        organization: "Research Institute",
        programme: "Digital Literacy Study",
        is_active: true,
        last_synced: "2025-01-15T14:30:00.000Z",
        date_enrolled: "2025-01-10T09:00:00.000Z",
        current_beneficiary: {
          id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
          name: "John Doe",
          email: "john.doe@example.com",
          organization: "Research Institute",
          programme: "Digital Literacy Study",
        },
        device_specs: {
          storage: "128GB",
          ram: "8GB",
          battery: "4355mAh",
          screen_size: "6.3 inches",
        },
        imei: "123456789012345",
        serial_number: "GXB123456",
        fingerprint:
          "google/pixel7/pixel7:13/TQ3A.230705.001/10216780:user/release-keys",
        installed_apps: [
          {
            id: "app_001",
            package_name: "com.google.android.youtube",
            app_name: "YouTube",
            app_icon: "🎥",
            version: "18.45.43",
            size: "156.7 MB",
            install_date: "2024-01-10T09:00:00Z",
            last_updated: "2024-01-12T14:30:00Z",
            category: "Entertainment",
          },
          {
            id: "app_002",
            package_name: "com.whatsapp",
            app_name: "WhatsApp",
            app_icon: "💬",
            version: "2.24.1.78",
            size: "89.3 MB",
            install_date: "2024-01-10T09:15:00Z",
            last_updated: "2024-01-14T10:20:00Z",
            category: "Communication",
          },
          {
            id: "app_003",
            package_name: "com.google.android.gms",
            app_name: "Google Play Services",
            app_icon: "⚙️",
            version: "23.49.13",
            size: "312.4 MB",
            install_date: "2024-01-10T08:45:00Z",
            last_updated: "2024-01-15T09:10:00Z",
            category: "System",
          },
          {
            id: "app_004",
            package_name: "com.facebook.katana",
            app_name: "Facebook",
            app_icon: "📘",
            version: "442.0.0.39.108",
            size: "203.8 MB",
            install_date: "2024-01-11T16:30:00Z",
            last_updated: "2024-01-13T11:45:00Z",
            category: "Social",
          },
          {
            id: "app_005",
            package_name: "com.spotify.music",
            app_name: "Spotify",
            app_icon: "🎵",
            version: "8.8.84.490",
            size: "78.9 MB",
            install_date: "2024-01-12T10:15:00Z",
            last_updated: "2024-01-14T15:20:00Z",
            category: "Music",
          },
        ],
        sync_history: [
          {
            id: "550e8400-e29b-41d4-a716-446655440002",
            device_id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
            sync_type: "full_sync",
            status: "completed",
            records_synced: 150,
            sync_duration_ms: 2500,
            created_at: "2025-01-15T10:30:00Z",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440003",
            device_id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
            sync_type: "incremental",
            status: "completed",
            records_synced: 25,
            sync_duration_ms: 800,
            created_at: "2025-01-15T09:15:00Z",
          },
        ],
        assignment_history: [
          {
            id: "550e8400-e29b-41d4-a716-446655440004",
            device_id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
            beneficiary_id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
            assigned_at: "2024-01-10T08:00:00Z",
            unassigned_at: null,
            assigned_by: "admin@techcorp.com",
            notes: "Device assigned for digital literacy study",
            is_active: true,
            created_at: "2024-01-10T08:00:00Z",
            updated_at: "2024-01-10T08:00:00Z",
            beneficiary: {
              id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
              name: "John Doe",
            },
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440005",
            device_id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
            beneficiary_id: "550e8400-e29b-41d4-a716-446655440006",
            assigned_at: "2024-01-05T14:30:00Z",
            unassigned_at: "2024-01-10T07:45:00Z",
            assigned_by: "admin@techcorp.com",
            notes: "Previous assignment for pilot program",
            is_active: false,
            created_at: "2024-01-05T14:30:00Z",
            updated_at: "2024-01-10T07:45:00Z",
            beneficiary: {
              id: "550e8400-e29b-41d4-a716-446655440006",
              name: "Jane Smith",
            },
          },
        ],
        app_sessions: [
          {
            id: "550e8400-e29b-41d4-a716-446655440009",
            package_name: "com.google.android.youtube",
            app_name: "YouTube",
            app_icon: "🎥",
            foreground_time_stamp: 1705312200000,
            background_time_stamp: 1705315800000,
            session_time: 3600000,
            session_duration: {
              hours: 1,
              minutes: 0,
              formatted: "1h 0m",
            },
            start_activity_class: "com.google.android.youtube.HomeActivity",
            end_activity_class: "com.google.android.youtube.MainActivity",
            network_usage: {
              formatted: "45.67 MB",
            },
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440010",
            package_name: "com.whatsapp",
            app_name: "WhatsApp",
            app_icon: "💬",
            foreground_time_stamp: 1705308600000,
            background_time_stamp: 1705312200000,
            session_time: 3600000,
            session_duration: {
              hours: 1,
              minutes: 0,
              formatted: "1h 0m",
            },
            start_activity_class: "com.whatsapp.Main",
            end_activity_class: "com.whatsapp.Conversation",
            network_usage: {
              formatted: "12.34 MB",
            },
          },
        ],
        screen_sessions: [
          {
            id: "550e8400-e29b-41d4-a716-446655440011",
            screen_on_time_stamp: 1705312200000,
            screen_off_time_stamp: 1705315800000,
            session_duration: {
              milliseconds: 3600000,
              hours: 1,
              minutes: 0,
              formatted: "1h 0m",
            },
            trigger_source: "power_button",
            created_at: "2024-01-15T10:30:00Z",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440012",
            screen_on_time_stamp: 1705308600000,
            screen_off_time_stamp: 1705312200000,
            session_duration: {
              milliseconds: 3600000,
              hours: 1,
              minutes: 0,
              formatted: "1h 0m",
            },
            trigger_source: "notification",
            created_at: "2024-01-15T09:10:00Z",
          },
        ],
      },
    ],
    [],
  );

  // Find device by ID - memoized to prevent infinite re-renders
  const device = useMemo(() => devices.find((d) => d.id === id), [devices, id]);

  // Form state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    device_name: device?.device_name || "",
    android_version: device?.android_version || "",
    app_version: device?.app_version || "",
    organization: device?.organization || "",
    programme: device?.programme || "",
    is_active: device?.is_active || false,
    imei: device?.imei || "",
    serial_number: device?.serial_number || "",
    fingerprint: device?.fingerprint || "",
  });

  // Update form data when device changes
  React.useEffect(() => {
    if (device) {
      setFormData({
        device_name: device.device_name,
        android_version: device.android_version,
        app_version: device.app_version,
        organization: device.organization,
        programme: device.programme,
        is_active: device.is_active,
        imei: device.imei || "",
        serial_number: device.serial_number || "",
        fingerprint: device.fingerprint || "",
      });
    }
  }, [device]);

  if (!device) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">Device not found</div>
        </div>
      </MainLayout>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement updateDevice action
    dispatch(
      addAlert({
        type: "success",
        title: "Device Updated",
        message: "Device information has been updated successfully.",
      }),
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      device_name: device.device_name,
      android_version: device.android_version,
      app_version: device.app_version,
      organization: device.organization,
      programme: device.programme,
      is_active: device.is_active,
      imei: device.imei || "",
      serial_number: device.serial_number || "",
      fingerprint: device.fingerprint || "",
    });
    setIsEditing(false);
  };

  const handleNavigateToBeneficiary = () => {
    if (device.current_beneficiary) {
      navigate(
        `/beneficiary-management/beneficiaries/${device.current_beneficiary.id}`,
      );
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderHomeTab = () => (
    <div className="row">
      {/* Main Content */}
      <div className="col-12 col-xl-8">
        <div className="card rounded-4 border-top border-4 border-info border-gradient-1">
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <h5 className="mb-0 fw-bold">Device Information</h5>
              </div>
              <div>
                {!isEditing ? (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bx bx-edit me-2"></i>Edit Device
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      form="device-form"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bx bx-save me-2"></i>Save
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <form id="device-form" className="row g-4" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="device_name" className="form-label">
                  Device Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="device_name"
                  name="device_name"
                  value={formData.device_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="android_version" className="form-label">
                  Android Version
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="android_version"
                  name="android_version"
                  value={formData.android_version}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="app_version" className="form-label">
                  App Version
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="app_version"
                  name="app_version"
                  value={formData.app_version}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="organization" className="form-label">
                  Partner Organization
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="programme" className="form-label">
                  Intervention Programme
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="programme"
                  name="programme"
                  value={formData.programme}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="imei" className="form-label">
                  IMEI
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="imei"
                  name="imei"
                  value={formData.imei}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter IMEI number"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="serial_number" className="form-label">
                  Serial Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="col-12">
                <label htmlFor="fingerprint" className="form-label">
                  Device Fingerprint
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fingerprint"
                  name="fingerprint"
                  value={formData.fingerprint}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter device fingerprint"
                />
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <label className="form-check-label" htmlFor="is_active">
                    Device Active
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Device Specifications */}
        <div className="card rounded-4 mt-4">
          <div className="card-body p-4">
            <h5 className="mb-3 fw-bold">Device Specifications</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Storage:</span>
                  <span className="fw-semibold">
                    {device.device_specs?.storage || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">RAM:</span>
                  <span className="fw-semibold">
                    {device.device_specs?.ram || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Battery:</span>
                  <span className="fw-semibold">
                    {device.device_specs?.battery || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Screen Size:</span>
                  <span className="fw-semibold">
                    {device.device_specs?.screen_size || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installed Apps */}
        <div className="card rounded-4 mt-4">
          <div className="card-body p-4">
            <h5 className="mb-3 fw-bold">
              Installed Apps
              <span className="fw-light ms-2">
                ({device.installed_apps?.length || 0})
              </span>
            </h5>
            <div className="product-table">
              <div className="table-responsive white-space-nowrap">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>App Name</th>
                      <th>Version</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Install Date</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {device.installed_apps?.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="app-icon">
                              <span style={{ fontSize: "24px" }}>
                                {app.app_icon}
                              </span>
                            </div>
                            <div className="app-info">
                              <div className="fw-semibold">{app.app_name}</div>
                              <small className="text-muted">
                                {app.package_name}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{app.version}</td>
                        <td>{app.category}</td>
                        <td>{app.size}</td>
                        <td>
                          {new Date(app.install_date).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(app.last_updated).toLocaleDateString()}
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

      {/* Right Sidebar */}
      <div className="col-12 col-xl-4">
        {/* Device Status */}
        <div className="card rounded-4 mb-3">
          <div className="card-body">
            <h5 className="mb-3 fw-bold">Device Status</h5>
            <div className="mb-3">
              <span className="text-muted">Status:</span>
              <span
                className={`badge ms-2 ${
                  device.is_active ? "bg-success" : "bg-danger"
                }`}
              >
                {device.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-muted">Last Synced:</span>
              <p className="mb-0 mt-1">
                {new Date(device.last_synced).toLocaleString()}
              </p>
            </div>
            <div className="mb-3">
              <span className="text-muted">Date Enrolled:</span>
              <p className="mb-0 mt-1">
                {new Date(device.date_enrolled).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Beneficiary */}
        <div className="card rounded-4">
          <div className="card-body">
            <h5 className="mb-3 fw-bold">Assigned Beneficiary</h5>
            {device.current_beneficiary ? (
              <div>
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="avatar-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {device.current_beneficiary.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h6 className="mb-0">{device.current_beneficiary.name}</h6>
                    <p className="text-muted mb-0">
                      {device.current_beneficiary.email}
                    </p>
                  </div>
                </div>

                {/* Additional Beneficiary Details */}
                <div className="mb-3">
                  <div className="mb-2">
                    <span className="text-muted">Partner:</span>
                    <p className="mb-0 fw-semibold">
                      {device.current_beneficiary.organization}
                    </p>
                  </div>
                  <div className="mb-2">
                    <span className="text-muted">Intervention:</span>
                    <p className="mb-0 fw-semibold">
                      {device.current_beneficiary.programme}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-outline-primary btn-sm w-100"
                  onClick={handleNavigateToBeneficiary}
                >
                  View Beneficiary Details
                </button>
              </div>
            ) : (
              <div className="text-center text-muted">
                <i className="bx bx-user-x display-6 mb-2"></i>
                <p>No beneficiary assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsageTab = () => (
    <div className="row">
      <div className="col-12">
        {/* App Sessions Table */}
        <Card className="rounded-4 mb-4">
          <Card.Body>
            <Card.Title className="fw-bold">App Usage Sessions</Card.Title>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>App</th>
                    <th>Session Start</th>
                    <th>Session End</th>
                    <th>Duration</th>
                    <th>Network Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {device.app_sessions?.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{session.app_icon}</span>
                          <div>
                            <div className="fw-semibold">
                              {session.app_name}
                            </div>
                            <small className="text-muted">
                              {session.package_name}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{formatTimestamp(session.foreground_time_stamp)}</td>
                      <td>{formatTimestamp(session.background_time_stamp)}</td>
                      <td>{session.session_duration.formatted}</td>
                      <td>{session.network_usage.formatted}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Screen Sessions Table */}
        <Card className="rounded-4 mb-4">
          <Card.Body>
            <Card.Title className="fw-bold">Screen Sessions</Card.Title>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Screen On</th>
                    <th>Screen Off</th>
                    <th>Duration</th>
                    <th>Trigger Source</th>
                  </tr>
                </thead>
                <tbody>
                  {device.screen_sessions?.map((session) => (
                    <tr key={session.id}>
                      <td>{formatTimestamp(session.screen_on_time_stamp)}</td>
                      <td>{formatTimestamp(session.screen_off_time_stamp)}</td>
                      <td>{session.session_duration.formatted}</td>
                      <td>
                        <Badge
                          bg={
                            session.trigger_source === "power_button"
                              ? "primary"
                              : "info"
                          }
                        >
                          {session.trigger_source
                            .replace("_", " ")
                            .toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Usage Timeline Visual */}
        <Card className="rounded-4">
          <Card.Body>
            <Card.Title className="fw-bold">Usage Timeline</Card.Title>
            <div className="timeline-container">
              {device.app_sessions?.map((session, index) => (
                <div
                  key={session.id}
                  className="timeline-item d-flex align-items-center mb-3"
                >
                  <div className="timeline-marker me-3">
                    <span className="badge bg-primary rounded-circle p-2">
                      {session.app_icon}
                    </span>
                  </div>
                  <div className="timeline-content flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{session.app_name}</h6>
                        <small className="text-muted">
                          {formatTimestamp(session.foreground_time_stamp)} -{" "}
                          {formatTimestamp(session.background_time_stamp)}
                        </small>
                      </div>
                      <Badge bg="secondary">
                        {session.session_duration.formatted}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  const renderDeviceHistoryTab = () => (
    <div className="row">
      <div className="col-12">
        {/* Assignment History */}
        <Card className="rounded-4 mb-4">
          <Card.Body>
            <Card.Title className="fw-bold">
              Device Assignment History
            </Card.Title>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Beneficiary</th>
                    <th>Assigned At</th>
                    <th>Unassigned At</th>
                    <th>Assigned By</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {device.assignment_history?.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.beneficiary.name}</td>
                      <td>
                        {new Date(assignment.assigned_at).toLocaleString()}
                      </td>
                      <td>
                        {assignment.unassigned_at ? (
                          new Date(assignment.unassigned_at).toLocaleString()
                        ) : (
                          <Badge bg="success">Currently Assigned</Badge>
                        )}
                      </td>
                      <td>{assignment.assigned_by}</td>
                      <td>
                        <Badge
                          bg={assignment.is_active ? "success" : "secondary"}
                        >
                          {assignment.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">{assignment.notes}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Sync History */}
        <Card className="rounded-4">
          <Card.Body>
            <Card.Title className="fw-bold">Sync History</Card.Title>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sync Type</th>
                    <th>Status</th>
                    <th>Records Synced</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {device.sync_history?.map((sync) => (
                    <tr key={sync.id}>
                      <td>{new Date(sync.created_at).toLocaleString()}</td>
                      <td>
                        <Badge
                          bg={
                            sync.sync_type === "full_sync" ? "primary" : "info"
                          }
                        >
                          {sync.sync_type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={
                            sync.status === "completed" ? "success" : "danger"
                          }
                        >
                          {sync.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{sync.records_synced.toLocaleString()}</td>
                      <td>{(sync.sync_duration_ms / 1000).toFixed(2)}s</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  const renderLocationHistoryTab = () => (
    <div className="row">
      <div className="col-12">
        <Card className="rounded-4 text-center">
          <Card.Body className="p-5">
            <i className="material-icons-outlined display-1 text-muted mb-3">
              location_on
            </i>
            <h4 className="text-muted">Location History</h4>
            <p className="text-muted">
              Location tracking will be implemented in future updates. This will
              show device location history with date-time filtering
              capabilities.
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="breadcrumb-title pe-3">Device Management</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/">
                      <i className="bx bx-home-alt"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/device-management/devices">Devices</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {device.device_name}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Tabs */}
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey || "home")}
          >
            <Nav.Item>
              <Nav.Link eventKey="home">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="usage">Usage</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="device-history">Device History</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="location-history">Location History</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Tab Content */}
        <Tab.Content>
          <Tab.Pane eventKey="home" active={activeTab === "home"}>
            {renderHomeTab()}
          </Tab.Pane>

          <Tab.Pane eventKey="usage" active={activeTab === "usage"}>
            {renderUsageTab()}
          </Tab.Pane>

          <Tab.Pane
            eventKey="device-history"
            active={activeTab === "device-history"}
          >
            {renderDeviceHistoryTab()}
          </Tab.Pane>

          <Tab.Pane
            eventKey="location-history"
            active={activeTab === "location-history"}
          >
            {renderLocationHistoryTab()}
          </Tab.Pane>
        </Tab.Content>
      </div>
    </MainLayout>
  );
};

export default DeviceDetails;
