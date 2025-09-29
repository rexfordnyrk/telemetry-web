import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import DataTableWrapper from "../components/DataTableWrapper";
import NewBeneficiaryModal from "../components/NewBeneficiaryModal";
import ImportBeneficiariesModal from "../components/ImportBeneficiariesModal";
import FilterModal from "../components/FilterModal";
import { fetchBeneficiaries } from "../store/slices/beneficiarySlice";
import PermissionRoute from "../components/PermissionRoute";
import { usePermissions } from "../hooks/usePermissions";

const Beneficiaries: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Redux state for beneficiaries
  const { beneficiaries, loading, error } = useAppSelector((state) => state.beneficiaries);

  const [showNewBeneficiaryModal, setShowNewBeneficiaryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">("disable");
  const [targetBeneficiary, setTargetBeneficiary] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});

  const permissions = usePermissions();

  // Fetch beneficiaries from API on mount
  useEffect(() => {
    dispatch(fetchBeneficiaries({}));
  }, [dispatch]);

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
  const memoizedBeneficiaries = useMemo(() => filteredBeneficiaries, [filteredBeneficiaries]);
  const [tableVisible, setTableVisible] = useState(true);
  useEffect(() => {
    setTableVisible(false);
    const t = setTimeout(() => setTableVisible(true), 0);
    return () => clearTimeout(t);
  }, [memoizedBeneficiaries.length]);

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

  const tableKey = useMemo(() => `beneficiaries-${memoizedBeneficiaries.length}`,[memoizedBeneficiaries.length]);

  // Helper to get status badge
  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: { bg: "success", text: "Active" },
      inactive: { bg: "danger", text: "Inactive" },
      pending: { bg: "warning", text: "Pending" },
      suspended: { bg: "secondary", text: "Suspended" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`dash-lable mb-0 bg-${config.bg} bg-opacity-10 text-${config.bg} rounded-2`}>
        {config.text}
      </span>
    );
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle action button clicks
  const handleActionClick = (beneficiary: any, action: "disable" | "delete") => {
    setTargetBeneficiary(beneficiary);
    setModalAction(action);
    setShowModal(true);
  };

  // Handle filter modal apply
  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
  };

  // Handle confirm action (delete/disable)
  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been deleted.`,
        })
      );
    } else {
      const newStatus = !targetBeneficiary?.is_active ? "activated" : "deactivated";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been ${newStatus}.`,
        })
      );
    }
    setShowModal(false);
    setTargetBeneficiary(null);
  };

  return (
    <PermissionRoute requiredPermissions={['list_beneficiaries']}>
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
              onClick={() => setShowFilterModal(true)}
              disabled={loading}
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Filters
            </button>
            {permissions.hasPermission('create_beneficiaries') && (
              <>
                <button
                  type="button"
                  className="btn btn-grd-info px-4"
                  onClick={() => setShowImportModal(true)}
                  disabled={loading}
                >
                  <i className="material-icons-outlined me-1">file_upload</i>
                  Import Beneficiaries
                </button>
                <button
                  type="button"
                  className="btn btn-grd-primary px-4"
                  onClick={() => setShowNewBeneficiaryModal(true)}
                  disabled={loading}
                >
                  + | New Beneficiary
                </button>
              </>
            )}
          </div>
        </div>

          {/* Page Title and Loading Spinner */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Beneficiaries Management</h6>
            {loading && (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-muted">Loading beneficiaries...</span>
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
                onClick={() => dispatch({ type: 'beneficiaries/clearError' })}
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
                  <p className="mt-3 text-muted">Loading beneficiaries from server...</p>
                </div>
              ) : (
            <div className="table-responsive">
              {tableVisible && (
              <DataTableWrapper
                key={tableKey}
                id="beneficiaries-datatable"
                data={memoizedBeneficiaries}
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
                              className="text-decoration-none fw-bold"
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
                            {new Date(beneficiary.date_enrolled).toLocaleDateString()}
                      </td>
                      <td>
                        {beneficiary.current_device ? (
                          <a
                            href="#"
                            className="text-decoration-none fw-bold text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                                  // Only navigate if current_device is not null
                                  if (beneficiary.current_device) {
                              navigate(
                                `/device-management/devices/${beneficiary.current_device.id}`,
                              );
                                  }
                            }}
                                title={
                                  beneficiary.current_device
                                    ? `Device ID: ${beneficiary.current_device.id}`
                                    : undefined
                                }
                          >
                                {/* Only show device name if current_device is not null */}
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
                                <i className="material-icons-outlined text-primary">edit</i>
                          </button>
                          <button
                            className="btn btn-sm p-1"
                            title={
                              !beneficiary.is_active
                                ? "Activate Beneficiary"
                                : "Deactivate Beneficiary"
                            }
                                onClick={() => handleActionClick(beneficiary, "disable")}
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          >
                            <i className="material-icons-outlined text-warning">
                                  {!beneficiary.is_active ? "check_circle" : "block"}
                            </i>
                          </button>
                          <button
                            className="btn btn-sm p-1"
                            title="Delete Beneficiary"
                                onClick={() => handleActionClick(beneficiary, "delete")}
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          >
                                <i className="material-icons-outlined text-danger">delete</i>
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
              </DataTableWrapper>
              )}
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
                    Confirm {modalAction === "delete" ? "Delete" : "Deactivate"} Beneficiary
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                    Are you sure you want to {modalAction === "delete" ? "delete" : "deactivate"} beneficiary <strong>{targetBeneficiary?.name}</strong>?
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
                      {modalAction === "delete" ? "Delete" : "Deactivate"} Beneficiary
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
      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        title="Beneficiaries"
      />
      <ImportBeneficiariesModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        filters={activeFilters}
      />
    </MainLayout>
    </PermissionRoute>
  );
};

export default Beneficiaries;
