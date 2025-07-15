import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import FilterModal from "../components/FilterModal";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
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
  const devices = [
    {
      id: "1",
      name: "iPhone 14 Pro",
      type: "Mobile",
      model: "A2894",
      serial: "FMWA2X9N14",
      assigned_to: "John Doe",
      location: "New York Office",
      status: "active",
      last_seen: "2024-01-15",
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "Laptop",
      model: "MacBook Pro 16",
      serial: "C02ZX1Y2JG5H",
      assigned_to: "Jane Smith",
      location: "San Francisco Office",
      status: "active",
      last_seen: "2024-01-14",
    },
    {
      id: "3",
      name: "Dell Monitor",
      type: "Monitor",
      model: "U2720Q",
      serial: "DL2720Q001",
      assigned_to: "Mike Johnson",
      location: "Chicago Office",
      status: "maintenance",
      last_seen: "2024-01-10",
    },
    {
      id: "4",
      name: "Surface Pro",
      type: "Tablet",
      model: "Surface Pro 9",
      serial: "SP9001ABC",
      assigned_to: "Sarah Wilson",
      location: "Remote",
      status: "lost",
      last_seen: "2023-12-20",
    },
    {
      id: "5",
      name: "iPad Air",
      type: "Tablet",
      model: "iPad Air 5",
      serial: "DMQK2LL/A",
      assigned_to: "Unassigned",
      location: "Storage Room",
      status: "available",
      last_seen: "2024-01-12",
    },
  ];

  // Filter devices based on active filters
  const filteredDevices = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return devices;

    return devices.filter((device) => {
      if (activeFilters.type && activeFilters.type !== device.type)
        return false;
      if (activeFilters.status && activeFilters.status !== device.status)
        return false;
      if (activeFilters.location && activeFilters.location !== device.location)
        return false;
      return true;
    });
  }, [devices, activeFilters]);

  // Memoize filtered devices to prevent unnecessary re-renders
  const memoizedDevices = useMemo(() => filteredDevices, [filteredDevices]);

  // Define filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(devices.map((d) => d.type))];
    const statuses = [...new Set(devices.map((d) => d.status))];
    const locations = [...new Set(devices.map((d) => d.location))];

    return {
      type: types,
      status: statuses,
      location: locations,
    };
  }, [devices]);

  // Initialize DataTable using custom hook
  useDataTable("devices-datatable", memoizedDevices);

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

  const getDeviceIcon = (type: string) => {
    const iconMap = {
      Mobile: "smartphone",
      Laptop: "laptop_mac",
      Monitor: "monitor",
      Tablet: "tablet_mac",
      Desktop: "desktop_windows",
    };
    return iconMap[type as keyof typeof iconMap] || "devices";
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
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedDevices.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <div>
                          <a
                            href="#"
                            className="text-decoration-none fw-bold"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {device.name}
                          </a>
                          <div className="text-muted small">
                            {device.serial}
                          </div>
                        </div>
                      </td>
                      <td>
                        {device.type}
                        <div className="text-muted small">{device.model}</div>
                      </td>
                      <td>{device.location}</td>
                      <td>{device.assigned_to}</td>
                      <td>{getStatusElement(device.status)}</td>
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
                              {device.status === "retired"
                                ? "check_circle"
                                : "block"}
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
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Assigned To</th>
                    <th>Status</th>
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
    </MainLayout>
  );
};

export default Devices;
