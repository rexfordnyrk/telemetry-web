import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Sample devices data (would come from store in real app)
  const devices = [
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
      },
      device_specs: {
        storage: "128GB",
        ram: "8GB",
        battery: "4355mAh",
        screen_size: "6.3 inches",
      },
      sync_history: [
        {
          date: "2025-01-15T14:30:00.000Z",
          status: "Success",
          data_synced: "2.5MB",
        },
        {
          date: "2025-01-14T10:15:00.000Z",
          status: "Success",
          data_synced: "1.8MB",
        },
        {
          date: "2025-01-13T16:45:00.000Z",
          status: "Failed",
          data_synced: "0MB",
        },
        {
          date: "2025-01-12T11:20:00.000Z",
          status: "Success",
          data_synced: "3.2MB",
        },
      ],
    },
  ];

  // Find device by ID
  const device = devices.find((d) => d.id === id);

  // Form state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    device_name: device?.device_name || "",
    android_version: device?.android_version || "",
    app_version: device?.app_version || "",
    organization: device?.organization || "",
    programme: device?.programme || "",
    is_active: device?.is_active || false,
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

  return (
    <MainLayout>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
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

                <form
                  id="device-form"
                  className="row g-4"
                  onSubmit={handleSubmit}
                >
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

            {/* Sync History */}
            <div className="card rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3 fw-bold">Recent Sync History</h5>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Data Synced</th>
                      </tr>
                    </thead>
                    <tbody>
                      {device.sync_history?.map((sync, index) => (
                        <tr key={index}>
                          <td>{new Date(sync.date).toLocaleString()}</td>
                          <td>
                            <span
                              className={`badge ${
                                sync.status === "Success"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {sync.status}
                            </span>
                          </td>
                          <td>{sync.data_synced}</td>
                        </tr>
                      ))}
                    </tbody>
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
                        <h6 className="mb-0">
                          {device.current_beneficiary.name}
                        </h6>
                        <p className="text-muted mb-0">
                          {device.current_beneficiary.email}
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
      </div>
    </MainLayout>
  );
};

export default DeviceDetails;
