import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";
import NewBeneficiaryModal from "../components/NewBeneficiaryModal";

const Beneficiaries: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showNewBeneficiaryModal, setShowNewBeneficiaryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetBeneficiary, setTargetBeneficiary] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>(
    {},
  );

  // Sample beneficiaries data - memoized to prevent re-renders
  const beneficiaries = [
    {
      id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
      created_at: "2025-07-15T03:06:24.753042Z",
      updated_at: "2025-07-15T18:42:42.204065Z",
      deleted_at: null,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      organization: "Research Institute",
      district: "Central District",
      programme: "Digital Literacy Study",
      date_enrolled: "2025-05-15T03:06:24.730291Z",
      current_device_id: "077777f9-1ad9-4f1b-a07c-a2e590962dbc",
      is_active: true,
      current_device: {
        id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
        device_name: "Pixel 7",
        android_version: "Android 16",
        app_version: "1.0.0",
      },
    },
    {
      id: "b234c5d8-34ff-5075-85f6-bbf3ad7d72ef",
      created_at: "2025-06-10T08:15:30.123456Z",
      updated_at: "2025-07-10T14:20:15.987654Z",
      deleted_at: null,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1987654321",
      organization: "Community Center",
      district: "North District",
      programme: "Health Monitoring Program",
      date_enrolled: "2025-04-20T10:30:45.654321Z",
      current_device_id: null,
      is_active: true,
      current_device: null,
    },
    {
      id: "c345d6e9-45ff-6075-95f6-ccf4ad8e83f0",
      created_at: "2025-05-25T12:45:18.456789Z",
      updated_at: "2025-07-12T16:30:22.321098Z",
      deleted_at: null,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1122334455",
      organization: "Tech Hub",
      district: "South District",
      programme: "Innovation Lab",
      date_enrolled: "2025-03-10T14:15:30.987123Z",
      current_device_id: "d456e7f0-56ff-7075-a5f6-ddf5ad9f94g1",
      is_active: false,
      current_device: {
        id: "d456e7f0-56ff-7075-a5f6-ddf5ad9f94g1",
        device_name: "Samsung Galaxy S23",
        android_version: "Android 14",
        app_version: "1.2.1",
      },
    },
  ];

  // Filter beneficiaries based on active filters
  const filteredBeneficiaries = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return beneficiaries;

    return beneficiaries.filter((beneficiary) => {
      // Organization filter
      if (
        activeFilters.organization &&
        activeFilters.organization !== beneficiary.organization
      ) {
        return false;
      }

      // District filter
      if (
        activeFilters.district &&
        activeFilters.district !== beneficiary.district
      ) {
        return false;
      }

      // Programme filter
      if (
        activeFilters.programme &&
        activeFilters.programme !== beneficiary.programme
      ) {
        return false;
      }

      // Status filter
      if (activeFilters.status) {
        const isActive = activeFilters.status === "active";
        if (beneficiary.is_active !== isActive) return false;
      }

      // Date range filters
      if (activeFilters.created_at_from) {
        const beneficiaryDate = new Date(beneficiary.created_at);
        const fromDate = new Date(activeFilters.created_at_from);
        if (beneficiaryDate < fromDate) return false;
      }

      if (activeFilters.created_at_to) {
        const beneficiaryDate = new Date(beneficiary.created_at);
        const toDate = new Date(activeFilters.created_at_to);
        if (beneficiaryDate > toDate) return false;
      }

      return true;
    });
  }, [beneficiaries, activeFilters]);

  // Memoize filtered beneficiaries to prevent unnecessary re-renders
  const memoizedBeneficiaries = useMemo(
    () => filteredBeneficiaries,
    [filteredBeneficiaries],
  );

  // Define filter options
  const filterOptions = useMemo(() => {
    const organizationsSet = new Set(beneficiaries.map((b) => b.organization));
    const districtsSet = new Set(beneficiaries.map((b) => b.district));
    const programmesSet = new Set(beneficiaries.map((b) => b.programme));

    return {
      organization: Array.from(organizationsSet),
      district: Array.from(districtsSet),
      programme: Array.from(programmesSet),
      status: ["active", "inactive"],
      created_at: [], // Date range filter
    };
  }, [beneficiaries]);

  // Initialize DataTable using custom hook
  useDataTable("beneficiaries-datatable", memoizedBeneficiaries);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: { bg: "success", text: "Active" },
      inactive: { bg: "danger", text: "Inactive" },
      pending: { bg: "warning", text: "Pending" },
      suspended: { bg: "secondary", text: "Suspended" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`dash-lable mb-0 bg-${config.bg} bg-opacity-10 text-${config.bg} rounded-2`}
      >
        {config.text}
      </span>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      Primary: { bg: "primary", text: "Primary" },
      Secondary: { bg: "info", text: "Secondary" },
      Contingent: { bg: "warning", text: "Contingent" },
    };

    const config =
      categoryConfig[category as keyof typeof categoryConfig] ||
      categoryConfig.Primary;

    return (
      <span
        className={`badge bg-${config.bg} bg-opacity-10 text-${config.bg} border border-${config.bg}`}
      >
        {config.text}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleActionClick = (
    beneficiary: any,
    action: "disable" | "delete",
  ) => {
    setTargetBeneficiary(beneficiary);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been deleted.`,
        }),
      );
    } else {
      const newStatus = !targetBeneficiary?.is_active
        ? "activated"
        : "deactivated";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been ${newStatus}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetBeneficiary(null);
  };

  return (
    <MainLayout>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Beneficiary Management</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Beneficiaries
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={() => {
                /* TODO: Implement filters modal */
              }}
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Filters
            </button>
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => setShowNewBeneficiaryModal(true)}
            >
              + | New Beneficiary
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Beneficiaries Management</h6>
        </div>
        <hr />
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table
                id="beneficiaries-datatable"
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>District</th>
                    <th>Partner</th>
                    <th>Intervention</th>
                    <th>Date Enrolled</th>
                    <th>Assigned Device</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedBeneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontSize: "14px",
                            }}
                          >
                            {getInitials(beneficiary.name)}
                          </div>
                          <div>
                            <a
                              href="#"
                              className="text-decoration-none fw-bold text-dark"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/beneficiary-management/beneficiaries/${beneficiary.id}`,
                                );
                              }}
                            >
                              {beneficiary.name}
                            </a>
                            <div className="text-muted small">
                              {beneficiary.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{beneficiary.email}</td>
                      <td>{beneficiary.district}</td>
                      <td>{beneficiary.organization}</td>
                      <td>{beneficiary.programme}</td>
                      <td>
                        {new Date(
                          beneficiary.date_enrolled,
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {beneficiary.current_device ? (
                          <a
                            href="#"
                            className="text-decoration-none fw-bold text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/device-management/devices/${beneficiary.current_device.id}`,
                              );
                            }}
                            title={`Device ID: ${beneficiary.current_device.id}`}
                          >
                            {beneficiary.current_device.device_name}
                          </a>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm p-1"
                            title="Edit Beneficiary"
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
                            title={
                              !beneficiary.is_active
                                ? "Activate Beneficiary"
                                : "Deactivate Beneficiary"
                            }
                            onClick={() =>
                              handleActionClick(beneficiary, "disable")
                            }
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          >
                            <i className="material-icons-outlined text-warning">
                              {!beneficiary.is_active
                                ? "check_circle"
                                : "block"}
                            </i>
                          </button>
                          <button
                            className="btn btn-sm p-1"
                            title="Delete Beneficiary"
                            onClick={() =>
                              handleActionClick(beneficiary, "delete")
                            }
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
                    <th>Email</th>
                    <th>District</th>
                    <th>Partner</th>
                    <th>Intervention</th>
                    <th>Date Enrolled</th>
                    <th>Assigned Device</th>
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
                  Confirm {modalAction === "delete" ? "Delete" : "Deactivate"}{" "}
                  Beneficiary
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
                  {modalAction === "delete" ? "delete" : "deactivate"}{" "}
                  beneficiary <strong>{targetBeneficiary?.name}</strong>?
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
                    {modalAction === "delete" ? "Delete" : "Deactivate"}{" "}
                    Beneficiary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Beneficiary Modal */}
      <NewBeneficiaryModal
        show={showNewBeneficiaryModal}
        onHide={() => setShowNewBeneficiaryModal(false)}
      />
    </MainLayout>
  );
};

export default Beneficiaries;
