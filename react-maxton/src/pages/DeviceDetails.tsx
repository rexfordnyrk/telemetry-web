import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Nav,
  Tab,
} from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";
import { fetchDeviceDetails, clearDeviceDetails, updateDevice } from "../store/slices/deviceSlice";
import LocationHistoryMap from "../components/LocationHistoryMap";

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get device details from Redux store (now contains all summary and tab/table data)
  const deviceDetails = useAppSelector((state) => state.devices.deviceDetails);
  const detailsLoading = useAppSelector((state) => state.devices.detailsLoading);
  const detailsError = useAppSelector((state) => state.devices.detailsError);
  const updating = useAppSelector((state) => state.devices.updating);
  const updateError = useAppSelector((state) => state.devices.updateError);

  // Use deviceDetails for all summary and tab/table data
  const device = deviceDetails;

  // Tab state
  const [activeTab, setActiveTab] = useState("home");

  // Fetch device details when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchDeviceDetails(id));
    }
    
    // Clean up device details when component unmounts
    return () => {
      dispatch(clearDeviceDetails());
    };
  }, [dispatch, id]);

  // Initialize DataTables for each tab using device
  useDataTable("app-sessions-datatable", device?.app_sessions || []);
  useDataTable("screen-sessions-datatable", device?.screen_sessions || []);
  useDataTable(
    "assignment-history-datatable",
    device?.assignment_history || [],
  );
  useDataTable("sync-history-datatable", device?.sync_history || []);
  useDataTable("installed-apps-datatable", device?.installed_apps || []);

  // Form state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    device_name: "",
    android_version: "",
    app_version: "",
    organization: "",
    programme: "",
    is_active: false,
    imei: "",
    serial_number: "",
    mac_address: "",
    fingerprint: "",
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
        imei: (device as any)?.imei || "",
        serial_number: (device as any)?.serial_number || "",
        mac_address: device.mac_address || "",
        fingerprint: (device as any)?.fingerprint || "",
      });
    }
  }, [device]);

  // Show loading state while fetching device details
  if (detailsLoading) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading device details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show not found if no device data available
  if (!device) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">Device not found</div>
        </div>
      </MainLayout>
    );
  }

  // Show error state if device details fetch failed
  if (detailsError && !device) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">
            <h5>Error Loading Device Details</h5>
            <p>{detailsError}</p>
            <button 
              className="btn btn-outline-primary" 
              onClick={() => id && dispatch(fetchDeviceDetails(id))}
            >
              <i className="bx bx-refresh me-2"></i>Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show device not found if no device data available
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !device) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Error",
          message: "Device ID or device data not available.",
        }),
      );
      return;
    }

    try {
      // Prepare the data for the API call
      const updateData = {
        id: id,
        imei: formData.imei,
        serial_number: formData.serial_number,
        mac_address: formData.mac_address,
        device_name: formData.device_name,
        android_version: formData.android_version,
        app_version: formData.app_version,
        organization: formData.organization,
        programme: formData.programme,
        is_active: formData.is_active,
        fingerprint: formData.fingerprint,
      };

      // Make the API call to update the device
      await dispatch(updateDevice({ deviceId: id, deviceData: updateData })).unwrap();

      // Show success message
      dispatch(
        addAlert({
          type: "success",
          title: "Device Updated",
          message: "Device information has been updated successfully.",
        }),
      );

      // Exit editing mode
      setIsEditing(false);

      // Refresh device details to show updated data
      dispatch(fetchDeviceDetails(id));

    } catch (error) {
      // Show error message
      dispatch(
        addAlert({
          type: "danger",
          title: "Update Failed",
          message: error instanceof Error ? error.message : "Failed to update device. Please try again.",
        }),
      );
    }
  };

  const handleCancel = () => {
    if (device) {
      setFormData({
        device_name: device.device_name,
        android_version: device.android_version,
        app_version: device.app_version,
        organization: device.organization,
        programme: device.programme,
        is_active: device.is_active,
        imei: (device as any)?.imei || "",
        serial_number: (device as any)?.serial_number || "",
        mac_address: device.mac_address || "",
        fingerprint: (device as any)?.fingerprint || "",
      });
    }
    setIsEditing(false);
  };

  const handleNavigateToBeneficiary = () => {
    if (device?.current_beneficiary) {
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
                    disabled={updating}
                  >
                    <i className="bx bx-edit me-2"></i>Edit Device
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      form="device-form"
                      className="btn btn-primary btn-sm"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-save me-2"></i>Save
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancel}
                      disabled={updating}
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
              {/* MAC Address (read-only) */}
              <div className="col-md-6">
                <label htmlFor="mac_address" className="form-label">
                  MAC Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mac_address"
                  name="mac_address"
                  value={formData.mac_address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter MAC address"
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
                  Telemetry App Version
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
                  Intervention
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

            {/* Display update errors if any */}
            {updateError && isEditing && (
              <div className="alert alert-danger mt-3" role="alert">
                <i className="bx bx-error-circle me-2"></i>
                <strong>Update Error:</strong> {updateError}
              </div>
            )}
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
                    {(device as any)?.device_specs?.storage || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">RAM:</span>
                  <span className="fw-semibold">
                    {(device as any)?.device_specs?.ram || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Battery:</span>
                  <span className="fw-semibold">
                    {(device as any)?.device_specs?.battery || "N/A"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Screen Size:</span>
                  <span className="fw-semibold">
                    {(device as any)?.device_specs?.screen_size || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installed Apps */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h6 className="mb-0 text-uppercase">Installed Apps</h6>
        </div>
        <hr />
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table
                id="installed-apps-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>App Name</th>
                    <th>Version</th>
                    <th>Monitoring</th>
                    <th>Uninstalled</th>
                    <th>Install Date</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                   {device?.installed_apps?.map((app: any) => (
                    <tr key={app.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                           {/* Show app icon if available */}
                           {app.icon_base64 ? (
                             <img src={app.icon_base64} alt={app.app_name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                           ) : (
                             <span style={{ fontSize: "24px" }}>{app.app_icon || ""}</span>
                           )}
                          <div>
                            <div className="fw-semibold text-decoration-none">
                              {app.app_name}
                            </div>
                            <small className="text-muted">
                              {app.package_name}
                            </small>
                          </div>
                        </div>
                      </td>
                       {/* Use version_name if available, fallback to version */}
                       <td>{app.version_name || app.version || "-"}</td>
                       {/* Show is_selected value for Monitoring */}
                       <td>{app.is_selected ? "Yes" : "No"}</td>
                       {/* Show is_uninstalled value for Uninstalled */}
                       <td>{app.is_uninstalled ? "Yes" : "No"}</td>
                       {/* Use created_at for install date */}
                       <td>{app.created_at ? new Date(app.created_at).toLocaleDateString() : "-"}</td>
                       {/* Use updated_at for last updated */}
                       <td>{app.updated_at ? new Date(app.updated_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>App Name</th>
                    <th>Version</th>
                    <th>Monitoring</th>
                    <th>Uninstalled</th>
                    <th>Install Date</th>
                    <th>Last Updated</th>
                  </tr>
                </tfoot>
              </table>
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
                {device && (device as any)?.last_synced ? new Date((device as any).last_synced).toLocaleString() : "N/A"}
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
        <div className="card rounded-4 mb-3">
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
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3 text-uppercase fw-bold">App Usage Sessions</h6>
            <div className="table-responsive">
              <table
                id="app-sessions-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
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
                  {device?.app_sessions?.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {/* Show app icon if available */}
                          {session.app_icon ? (
                            <img src={session.app_icon} alt={session.app_name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: "24px" }}>📱</span>
                          )}
                          <div>
                            <div className="fw-semibold text-decoration-none">
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
                      <td>{session.session_duration?.formatted || "N/A"}</td>
                      <td>{session.network_usage?.formatted || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>App</th>
                    <th>Session Start</th>
                    <th>Session End</th>
                    <th>Duration</th>
                    <th>Network Usage</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Screen Sessions Table */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3 text-uppercase fw-bold">Screen Sessions</h6>
            <div className="table-responsive">
              <table
                id="screen-sessions-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Screen On</th>
                    <th>Screen Off</th>
                    <th>Duration</th>
                    <th>Trigger Source</th>
                  </tr>
                </thead>
                <tbody>
                  {device?.screen_sessions?.map((session) => (
                    <tr key={session.id}>
                      <td>{formatTimestamp(session.screen_on_time_stamp)}</td>
                      <td>{formatTimestamp(session.screen_off_time_stamp)}</td>
                      <td>{session.session_duration?.formatted || "N/A"}</td>
                      <td>
                        <span
                          className={`dash-lable mb-0 bg-${
                            session.trigger_source === "power_button"
                              ? "primary"
                              : "info"
                          } bg-opacity-10 text-${
                            session.trigger_source === "power_button"
                              ? "primary"
                              : "info"
                          } rounded-2`}
                        >
                          {session.trigger_source
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Screen On</th>
                    <th>Screen Off</th>
                    <th>Duration</th>
                    <th>Trigger Source</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeviceHistoryTab = () => (
    <div className="row">
      <div className="col-12">
        {/* Assignment History */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3 text-uppercase fw-bold">
              Device Assignment History
            </h6>
            <div className="table-responsive">
              <table
                id="assignment-history-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
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
                  {device?.assignment_history?.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.beneficiary.name}</td>
                      <td>
                        {new Date(assignment.assigned_at).toLocaleString()}
                      </td>
                      <td>
                        {assignment.unassigned_at ? (
                          new Date(assignment.unassigned_at).toLocaleString()
                        ) : (
                          <span className="dash-lable mb-0 bg-success bg-opacity-10 text-success rounded-2">
                            Currently Assigned
                          </span>
                        )}
                      </td>
                      <td>{assignment.assigned_by}</td>
                      <td>
                        <span
                          className={`dash-lable mb-0 bg-${
                            assignment.is_active ? "success" : "secondary"
                          } bg-opacity-10 text-${
                            assignment.is_active ? "success" : "secondary"
                          } rounded-2`}
                        >
                          {assignment.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">{assignment.notes}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Beneficiary</th>
                    <th>Assigned At</th>
                    <th>Unassigned At</th>
                    <th>Assigned By</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sync History */}
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3 text-uppercase fw-bold">Sync History</h6>
            <div className="table-responsive">
              <table
                id="sync-history-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
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
                  {device?.sync_history?.map((sync) => (
                    <tr key={sync.id}>
                      <td>{new Date(sync.created_at).toLocaleString()}</td>
                      <td>
                        <span
                          className={`dash-lable mb-0 bg-${
                            sync.sync_type === "full_sync" ? "primary" : "info"
                          } bg-opacity-10 text-${
                            sync.sync_type === "full_sync" ? "primary" : "info"
                          } rounded-2`}
                        >
                          {sync.sync_type.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`dash-lable mb-0 bg-${
                            sync.status === "completed" ? "success" : "danger"
                          } bg-opacity-10 text-${
                            sync.status === "completed" ? "success" : "danger"
                          } rounded-2`}
                        >
                          {sync.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{sync.records_synced ? sync.records_synced.toLocaleString() : "0"}</td>
                      <td>{sync.sync_duration_ms ? (sync.sync_duration_ms / 1000).toFixed(2) + "s" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Date</th>
                    <th>Sync Type</th>
                    <th>Status</th>
                    <th>Records Synced</th>
                    <th>Duration</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationHistoryTab = () => (
    <div className="row">
      <div className="col-12">
        <LocationHistoryMap 
          deviceId={id || ''} 
          deviceName={device?.device_name || 'Unknown Device'} 
        />
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
