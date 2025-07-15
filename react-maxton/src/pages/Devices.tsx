import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FilterModal from "../components/FilterModal";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Removed unused showNewDeviceModal
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetDevice, setTargetDevice] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>(
    {},
  );

  // Sample devices data - memoized to prevent re-renders
  const devices = useMemo(
    () => [
      {
        id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
        created_at: "2025-07-15T18:46:15.015251Z",
        updated_at: "2025-07-15T18:47:23.523564Z",
        deleted_at: null,
        mac_address: "BP2A.250605.031.A2",
        device_name: "Pixel 7",
        android_version: "Android 16",
        app_version: "1.0.0",
        organization: "GI-KACE",
        programme: "KEY",
        date_enrolled: "2025-07-15T18:46:14.98002Z",
        last_synced: "2025-07-15T18:47:23.495158Z",
        is_active: true,
        current_beneficiary_id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
        current_beneficiary: {
          id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
          name: "John Doe",
          email: "john.doe@example.com",
        },
      },
      {
        id: "d456e7f0-56ff-7075-a5f6-ddf5ad9f94g1",
        created_at: "2025-06-20T10:30:45.123456Z",
        updated_at: "2025-07-10T14:25:30.987654Z",
        deleted_at: null,
        mac_address: "SM2B.230815.042.B3",
        device_name: "Samsung Galaxy S23",
        android_version: "Android 14",
        app_version: "1.2.1",
        organization: "Tech Hub",
        programme: "Innovation Lab",
        date_enrolled: "2025-06-20T10:30:45.100123Z",
        last_synced: "2025-07-10T14:25:30.960147Z",
        is_active: false,
        current_beneficiary_id: "c345d6e9-45ff-6075-95f6-ccf4ad8e83f0",
        current_beneficiary: {
          id: "c345d6e9-45ff-6075-95f6-ccf4ad8e83f0",
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
        },
      },
      {
        id: "e567f8g1-67ff-8075-b5f6-eef6adb0a5h2",
        created_at: "2025-05-10T08:15:30.654321Z",
        updated_at: "2025-07-12T16:40:45.321987Z",
        deleted_at: null,
        mac_address: "IP3C.240920.053.C4",
        device_name: "iPhone 15 Pro",
        android_version: "iOS 17",
        app_version: "2.0.0",
        organization: "Research Institute",
        programme: "Digital Literacy Study",
        date_enrolled: "2025-05-10T08:15:30.620456Z",
        last_synced: "2025-07-12T16:40:45.300789Z",
        is_active: true,
        current_beneficiary_id: null,
        current_beneficiary: null,
      },
    ],
    [],
  );

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleActionClick = (device: any, action: "disable" | "delete") => {
    setTargetDevice(device);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Device "${targetDevice?.name}" has been deleted.`,
        }),
      );
    } else {
      const newStatus =
        targetDevice?.status === "retired" ? "available" : "retired";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Device "${targetDevice?.name}" has been ${newStatus}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetDevice(null);
  };

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
            >
              + | New Device
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Devices Management</h6>
        </div>
        <hr />
        <div className="card">
          <div className="card-body">
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
                    <th>Last Synced</th>
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
                            // TODO: Navigate to device details page
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
                        {new Date(device.last_synced).toLocaleDateString()}
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
                              navigate(
                                `/beneficiary-management/beneficiaries/${device.current_beneficiary.id}`,
                              );
                            }}
                            title={`Beneficiary ID: ${device.current_beneficiary.id}`}
                          >
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
                    <th>Last Synced</th>
                    <th>Date Enrolled</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
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
                  Confirm {modalAction === "delete" ? "Delete" : "Retire"}{" "}
                  Device
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to{" "}
                  {modalAction === "delete" ? "delete" : "retire"} device{" "}
                  <strong>{targetDevice?.name}</strong>?
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
