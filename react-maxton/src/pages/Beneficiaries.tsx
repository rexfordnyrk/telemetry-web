import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import DataTableWrapper from "../components/DataTableWrapper";
import NewBeneficiaryModal from "../components/NewBeneficiaryModal";
import ImportBeneficiariesModal from "../components/ImportBeneficiariesModal";
import FilterModal from "../components/FilterModal";
import { fetchBeneficiaries, deleteBeneficiary, updateBeneficiary, clearError } from "../store/slices/beneficiarySlice";
import PermissionRoute from "../components/PermissionRoute";
import { usePermissions } from "../hooks/usePermissions";
import { escapeHtml } from "../utils/escapeHtml";

const DEFAULT_PER_PAGE = 50;

const Beneficiaries: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { beneficiaries, loading, error } = useAppSelector((state) => state.beneficiaries);

  const [showNewBeneficiaryModal, setShowNewBeneficiaryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">("disable");
  const [targetBeneficiary, setTargetBeneficiary] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});

  const permissions = usePermissions();

  // Server-side filtering — no client-side date range needed; beneficiaries from Redux
  // are only used for action lookups (toggle/delete confirmations).
  const memoizedBeneficiaries = useMemo(() => beneficiaries, [beneficiaries]);

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
      date_enrolled: [], // Date range filter
    };
  }, [beneficiaries]);


  const dtColumns = useMemo(() => [
    {
      title: 'Name',
      data: null,
      render: (_: any, __: any, row: any) => {
        const initials = String(row.name || '')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase();
        const escapedName = escapeHtml(row.name || '');
        const escapedEmail = escapeHtml(row.email || '');
        return `
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:40px;height:40px;font-size:14px;">
              ${initials}
            </div>
            <div>
              <a href="#" class="text-decoration-none fw-bold" data-action="view-beneficiary" data-id="${row.id}">
                ${escapedName}
              </a>
              <div class="text-muted small">${escapedEmail}</div>
            </div>
          </div>`;
      }
    },
    { title: 'Email', data: 'email' },
    { title: 'District', data: 'district' },
    { title: 'Partner', data: 'organization' },
    { title: 'Intervention', data: 'programme' },
    {
      title: 'Date Enrolled',
      data: 'date_enrolled',
      render: (d: any) => {
        try { return d ? new Date(d).toLocaleDateString() : '-'; } catch { return '-'; }
      }
    },
    {
      title: 'Assigned Device',
      data: null,
      render: (_: any, __: any, row: any) => {
        if (row.current_device) {
          const id = row.current_device.id;
          const name = escapeHtml(row.current_device.device_name || 'Device');
          return `<a href="#" class="text-decoration-none fw-bold text-primary" data-action="view-device" data-id="${id}" title="Device ID: ${id}">${name}</a>`;
        }
        return '<span class="text-muted">Unassigned</span>';
      }
    },
    {
      title: 'Actions',
      data: null,
      orderable: false,
      searchable: false,
      render: (_: any, __: any, row: any) => {
        const isActive = !!row.is_active;
        return `
          <div class="d-flex gap-1">
            <button class="btn btn-sm p-1" title="Edit Beneficiary" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-primary">edit</i>
            </button>
            <button class="btn btn-sm p-1" title="${isActive ? 'Deactivate' : 'Activate'} Beneficiary" data-action="toggle-active" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-warning">${isActive ? 'block' : 'check_circle'}</i>
            </button>
            <button class="btn btn-sm p-1" title="Delete Beneficiary" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-danger">delete</i>
            </button>
          </div>`;
      }
    }
  ], []);

  const dtOptions = useMemo(() => ({
    columns: dtColumns,
    serverSide: true,
    processing: true,
    pageLength: DEFAULT_PER_PAGE,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
    ajax: (requestData: any, callback: (json: { draw?: number; data: any[]; recordsTotal: number; recordsFiltered: number }) => void) => {
      const start = requestData.start ?? requestData.iDisplayStart ?? 0;
      const length = requestData.length ?? requestData.iDisplayLength ?? DEFAULT_PER_PAGE;
      const page = Math.floor(start / length) + 1;
      const params: Record<string, unknown> = { page, limit: length };
      if (activeFilters.organization) params.organization = activeFilters.organization;
      if (activeFilters.district) params.district = activeFilters.district;
      if (activeFilters.programme) params.programme = activeFilters.programme;
      if (activeFilters.status) params.is_active = activeFilters.status === "active";
      if (activeFilters.date_enrolled_from) params.date_enrolled_from = activeFilters.date_enrolled_from;
      if (activeFilters.date_enrolled_to) params.date_enrolled_to = activeFilters.date_enrolled_to;
      const searchValue = requestData.search?.value;
      if (searchValue) params.search = searchValue;
      dispatch(fetchBeneficiaries(params as any))
        .unwrap()
        .then((result: { data: any[]; pagination: { total: number } | null }) => {
          const total = result.pagination?.total ?? result.data.length;
          callback({ draw: requestData.draw, data: result.data, recordsTotal: total, recordsFiltered: total });
        })
        .catch(() => {
          callback({ draw: requestData.draw, data: [], recordsTotal: 0, recordsFiltered: 0 });
        });
    },
  }), [dtColumns, activeFilters, dispatch]);

  // Delegate clicks from DataTables-rendered content
  useEffect(() => {
    if (!window.$) return;
    const $table = window.$('#beneficiaries-datatable');
    if ($table.length === 0) return;

    const onViewBeneficiary = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      if (id) navigate(`/beneficiary-management/beneficiaries/${id}`);
    };
    const onViewDevice = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      if (id) navigate(`/device-management/devices/${id}`);
    };
    const onEdit = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      if (id) navigate(`/beneficiary-management/beneficiaries/${id}`);
    };
    const onToggle = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      const b = memoizedBeneficiaries.find((x: any) => x.id === id);
      if (b) handleActionClick(b, 'disable');
    };
    const onDelete = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      const b = memoizedBeneficiaries.find((x: any) => x.id === id);
      if (b) handleActionClick(b, 'delete');
    };

    $table.off('.dtActions');
    $table.on('click.dtActions', 'a[data-action="view-beneficiary"]', onViewBeneficiary);
    $table.on('click.dtActions', 'a[data-action="view-device"]', onViewDevice);
    $table.on('click.dtActions', 'button[data-action="edit"]', onEdit);
    $table.on('click.dtActions', 'button[data-action="toggle-active"]', onToggle);
    $table.on('click.dtActions', 'button[data-action="delete"]', onDelete);

    return () => {
      if ($table && $table.off) $table.off('.dtActions');
    };
  }, [navigate, memoizedBeneficiaries]);

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

  // Handle filter modal apply; table re-inits (via key) and refetches with new filters
  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
  };

  // Clear DataTables search box so a subsequent ajax reload runs without stale search
  const handleClearSearch = () => {
    if (window.$) {
      try {
        const dt = window.$('#beneficiaries-datatable').DataTable();
        if (dt && dt.search) dt.search('').draw();
      } catch (_) {
        // DataTable may not be initialized yet — safe to ignore
      }
    }
  };

  // Reload DataTables ajax without resetting pagination position
  const reloadDataTable = () => {
    if (window.$) {
      const dt = window.$('#beneficiaries-datatable').DataTable();
      if (dt && dt.ajax) dt.ajax.reload(null, false);
    }
  };

  // Handle confirm action (delete/disable) — keeps modal open until async completes
  const handleConfirmAction = async () => {
    if (!targetBeneficiary?.id || confirming) return;
    setConfirming(true);
    try {
      if (modalAction === 'delete') {
        await dispatch(deleteBeneficiary(targetBeneficiary.id)).unwrap();
        dispatch(addAlert({ type: 'success', title: 'Success', message: `Beneficiary "${targetBeneficiary.name}" deleted.` }));
      } else {
        const newActive = !targetBeneficiary.is_active;
        await dispatch(updateBeneficiary({ id: targetBeneficiary.id, is_active: newActive })).unwrap();
        dispatch(addAlert({ type: 'success', title: 'Success', message: `Beneficiary "${targetBeneficiary.name}" ${newActive ? 'activated' : 'deactivated'}.` }));
      }
      reloadDataTable();
      setShowModal(false);
      setTargetBeneficiary(null);
    } catch (err: any) {
      dispatch(addAlert({ type: 'danger', title: 'Error', message: err?.message || err || 'Action failed' }));
      // Do NOT close modal on error — user can see the error and retry
    } finally {
      setConfirming(false);
    }
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
                onClick={() => dispatch(clearError())}
              ></button>
            </div>
          )}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive" key={JSON.stringify(activeFilters)}>
              <DataTableWrapper
                id="beneficiaries-datatable"
                data={[]}
                options={dtOptions}
                className="table table-striped table-bordered"
                style={{ width: "100%" }}
              />
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
          onClick={() => { if (!confirming) setShowModal(false); }}
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
                  Confirm {modalAction === "delete" ? "Delete" : (targetBeneficiary?.is_active ? "Deactivate" : "Activate")} Beneficiary
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  disabled={confirming}
                  onClick={() => { if (!confirming) setShowModal(false); }}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to {modalAction === "delete" ? "delete" : (targetBeneficiary?.is_active ? "deactivate" : "activate")} beneficiary <strong>{targetBeneficiary?.name}</strong>?
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
                    disabled={confirming}
                    onClick={() => { if (!confirming) setShowModal(false); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${modalAction === "delete" ? "btn-grd-danger" : "btn-grd-warning"} px-4 rounded-0`}
                    disabled={confirming}
                    onClick={handleConfirmAction}
                  >
                    {confirming ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Working…
                      </span>
                    ) : (
                      `${modalAction === "delete" ? "Delete" : (targetBeneficiary?.is_active ? "Deactivate" : "Activate")} Beneficiary`
                    )}
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
        onCreated={() => {
          setShowNewBeneficiaryModal(false);
          dispatch(fetchBeneficiaries({}));
        }}
      />
      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
        onClearSearch={handleClearSearch}
        title="Beneficiaries"
      />
      <ImportBeneficiariesModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        filters={activeFilters}
        onCompleted={() => {
          setShowImportModal(false);
          reloadDataTable();
        }}
      />
    </MainLayout>
    </PermissionRoute>
  );
};

export default Beneficiaries;
