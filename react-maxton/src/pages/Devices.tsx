import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FilterModal from "../components/FilterModal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";
import { fetchDevices } from "../store/slices/deviceSlice";

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Redux state for devices
  const { devices, loading, error } = useAppSelector((state) => state.devices);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">("disable");
  const [targetDevice, setTargetDevice] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});

  // Fetch devices from API on mount
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // Filter devices based on active filters
  const filteredDevices = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return devices;

    return devices.filter((device) => {
      if (
        activeFilters.organization &&
        activeFilters.organization !== device.organization
      )
        return false;
      if (
        activeFilters.programme &&
        activeFilters.programme !== device.programme
      )
        return false;
      if (
        activeFilters.is_active !== undefined &&
        activeFilters.is_active !== device.is_active
      )
        return false;
      return true;
    });
  }, [devices, activeFilters]);

  // Memoize filtered devices to prevent unnecessary re-renders
  const memoizedDevices = useMemo(() => filteredDevices, [filteredDevices]);

  // Define filter options
  const filterOptions = useMemo(() => {
    const organizationsSet = new Set(devices.map((d) => d.organization));
    const programmesSet = new Set(devices.map((d) => d.programme));
    const activeStates = [true, false];

    return {
      organization: Array.from(organizationsSet),
      programme: Array.from(programmesSet),
      is_active: activeStates,
    };
  }, [devices]);

  // Initialize DataTable using custom hook
  useDataTable("devices-datatable", memoizedDevices);

  // Helper to get status badge
  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: { bg: "success", text: "Active" },
      maintenance: { bg: "warning", text: "Maintenance" },
      lost: { bg: "danger", text: "Lost" },
      available: { bg: "info", text: "Available" },
      retired: { bg: "secondary", text: "Retired" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available;

    return (
      <span
        className={`dash-lable mb-0 bg-${config.bg} bg-opacity-10 text-${config.bg} rounded-2`}
      >
        {config.text}
      </span>
    );
  };

  // Handle action button clicks
  const handleActionClick = (device: any, action: "disable" | "delete") => {
    setTargetDevice(device);
    setModalAction(action);
    setShowModal(true);
  };

  // Handle confirm action (delete/disable)
  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Device "${targetDevice?.device_name}" has been deleted.`,
        })
      );
    } else {
      const newStatus = !targetDevice?.is_active ? "activated" : "deactivated";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Device "${targetDevice?.device_name}" has been ${newStatus}.`,
        })
      );
    }

    setShowModal(false);
    setTargetDevice(null);
  };

  // Handle filter modal apply
  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
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
                <li className="breadcrumb-item active" aria-current="page">
                  Devices
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={() => setShowFilterModal(true)}
              disabled={loading}
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Filters
            </button>
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => {
                /* TODO: Implement new device modal */
              }}
              disabled={loading}
            >
              + | New Device
            </button>
          </div>
        </div>

        {/* Page Title and Loading Spinner */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Devices Management</h6>
          {loading && (
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-muted">Loading devices...</span>
            </div>
          )}
        </div>
        <hr />
        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch({ type: 'devices/clearError' })}
            ></button>
          </div>
        )}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading devices from server...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table
                  id="devices-datatable"
                  className="table table-striped table-bordered"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Device Name</th>
                      <th>Android Version</th>
                      <th>App Version</th>
                      <th>Partner</th>
                      <th>Intervention</th>
                      <th>Active</th>
                      <th>Date Enrolled</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memoizedDevices.map((device) => (
                      <tr key={device.id}>
                        <td>
                          <a
                            href="#"
                            className="text-decoration-none fw-bold"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/device-management/devices/${device.id}`);
                            }}
                          >
                            {device.device_name}
                          </a>
                        </td>
                        <td>{device.android_version}</td>
                        <td>{device.app_version}</td>
                        <td>{device.organization}</td>
                        <td>{device.programme}</td>
                        <td>
                          <span
                            className={`badge ${device.is_active ? "bg-success" : "bg-danger"}`}
                          >
                            {device.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {new Date(device.date_enrolled).toLocaleDateString()}
                        </td>
                        <td>
                          {device.current_beneficiary ? (
                            <a
                              href="#"
                              className="text-decoration-none fw-bold text-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                // Only navigate if current_beneficiary is not null
                                if (device.current_beneficiary) {
                                  navigate(
                                    `/beneficiary-management/beneficiaries/${device.current_beneficiary.id}`,
                                  );
                                }
                              }}
                              title={
                                device.current_beneficiary
                                  ? `Beneficiary ID: ${device.current_beneficiary.id}`
                                  : undefined
                              }
                            >
                              {/* Only show beneficiary name if current_beneficiary is not null */}
                              {device.current_beneficiary.name}
                            </a>
                          ) : (
                            <span className="text-muted">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm p-1"
                              title="Edit Device"
                              onClick={() =>
                                navigate(
                                  `/device-management/devices/${device.id}`,
                                )
                              }
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
                              title="Retire/Activate Device"
                              onClick={() => handleActionClick(device, "disable")}
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                            >
                              <i className="material-icons-outlined text-warning">
                                {!device.is_active ? "check_circle" : "block"}
                              </i>
                            </button>
                            <button
                              className="btn btn-sm p-1"
                              title="Delete Device"
                              onClick={() => handleActionClick(device, "delete")}
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
                      <th>Device Name</th>
                      <th>Android Version</th>
                      <th>App Version</th>
                      <th>Partner</th>
                      <th>Intervention</th>
                      <th>Active</th>
                      <th>Date Enrolled</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
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
                  Confirm {modalAction === "delete" ? "Delete" : "Retire"} Device
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to {modalAction === "delete" ? "delete" : "retire"} device{" "}
                  <strong>{targetDevice?.device_name}</strong>?
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
                    {modalAction === "delete" ? "Delete" : "Retire"} Device
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        title="Devices"
      />
    </MainLayout>
  );
};

export default Devices;
