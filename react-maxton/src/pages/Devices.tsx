import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FilterModal from "../components/FilterModal";
import DataTableWrapper from "../components/DataTableWrapper";
import DeviceComparePanel from "../components/DeviceComparePanel";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { fetchDevices, deleteDevice, updateDevice } from "../store/slices/deviceSlice";
import { fetchDeviceCompareRow, DeviceCompareRow } from "../utils/deviceCompare";
import { escapeHtml } from "../utils/escapeHtml";

const DEFAULT_PER_PAGE = 50;

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { devices, loading, error } = useAppSelector((state) => state.devices);
  const token = useAppSelector((state) => state.auth.token);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">("disable");
  const [targetDevice, setTargetDevice] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Comparison state — up to 3 device ids selected via checkbox column.
  // Keep selection in React state so it survives DataTable redraws and
  // can be enforced (no more than 3) without poking the DOM.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareRows, setCompareRows] = useState<DeviceCompareRow[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const filterOptions = useMemo(() => {
    const organizationsSet = new Set(devices.map((d) => d.organization));
    const programmesSet = new Set(devices.map((d) => d.programme));
    return {
      organization: Array.from(organizationsSet),
      programme: Array.from(programmesSet),
      is_active: [true, false],
    };
  }, [devices]);

  const dtColumns = useMemo(
    () => [
      {
        title: "",
        data: null,
        orderable: false,
        searchable: false,
        width: "30px",
        // Checkbox column for the multi-device comparison panel
        // (DEF-042). Selection state lives in React; this render
        // only reflects it via data-* attrs.
        render: (_: any, __: any, row: any) => {
          const id = escapeHtml(row.id);
          return `<input type="checkbox" class="form-check-input device-compare-cb" data-id="${id}" />`;
        },
      },
      {
        title: "Device Name",
        data: "device_name",
        render: (_: any, __: any, row: any) =>
          `<a href="#" class="text-decoration-none fw-bold" data-action="view-device" data-id="${escapeHtml(row.id)}">${escapeHtml(row.device_name)}</a>`,
      },
      {
        title: "Android Version",
        data: "android_version",
        render: (v: any) => escapeHtml(v),
      },
      {
        title: "App Version",
        data: "app_version",
        render: (v: any) => escapeHtml(v),
      },
      {
        title: "Partner",
        data: "organization",
        render: (v: any) => escapeHtml(v),
      },
      {
        title: "Intervention",
        data: "programme",
        render: (v: any) => escapeHtml(v),
      },
      {
        title: "Active",
        data: "is_active",
        render: (d: any) =>
          `<span class="badge ${d ? "bg-success" : "bg-danger"}">${d ? "Active" : "Inactive"}</span>`,
      },
      {
        title: "Date Enrolled",
        data: "date_enrolled",
        render: (d: any) => (d ? new Date(d).toLocaleDateString() : "-"),
      },
      {
        title: "Assigned To",
        data: null,
        render: (_: any, __: any, row: any) => {
          if (row.current_beneficiary) {
            const b = row.current_beneficiary;
            return `<a href="#" class="text-decoration-none fw-bold text-primary" data-action="view-beneficiary" data-id="${escapeHtml(b.id)}">${escapeHtml(b.name)}</a>`;
          }
          return '<span class="text-muted">Unassigned</span>';
        },
      },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        render: (_: any, __: any, row: any) => {
          const icon = row.is_active ? "block" : "check_circle";
          const id = escapeHtml(row.id);
          return `<div class="d-flex gap-1">
            <button class="btn btn-sm p-1" title="Edit Device" data-action="edit" data-id="${id}" style="border:none;background:transparent"><i class="material-icons-outlined text-primary">edit</i></button>
            <button class="btn btn-sm p-1" title="Retire/Activate" data-action="toggle" data-id="${id}" style="border:none;background:transparent"><i class="material-icons-outlined text-warning">${icon}</i></button>
            <button class="btn btn-sm p-1" title="Delete Device" data-action="delete" data-id="${id}" style="border:none;background:transparent"><i class="material-icons-outlined text-danger">delete</i></button>
          </div>`;
        },
      },
    ],
    [],
  );

  const dtOptions = useMemo(
    () => ({
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
        // Forward DataTables' built-in search box value so the backend
        // can apply ILIKE filters across device fields (DEF-028 — search
        // returned nothing before because we never sent the term).
        const searchVal = requestData.search?.value?.trim?.();
        if (searchVal) params.search = searchVal;
        if (activeFilters.organization) params.organization = activeFilters.organization;
        if (activeFilters.programme) params.programme = activeFilters.programme;
        if (activeFilters.is_active !== undefined) params.is_active = activeFilters.is_active;
        dispatch(fetchDevices(params as any))
          .unwrap()
          .then((result: { data: any[]; pagination: { total: number } }) => {
            // Use server-reported total so page numbers and result-count
            // labels are correct on the last page (DEF-036–037 pagination
            // inferred from QA).
            const total = result.pagination?.total ?? result.data.length;
            callback({ draw: requestData.draw, data: result.data, recordsTotal: total, recordsFiltered: total });
          })
          .catch(() => {
            callback({ draw: requestData.draw, data: [], recordsTotal: 0, recordsFiltered: 0 });
          });
      },
    }),
    [dtColumns, activeFilters, dispatch],
  );

  const refreshTable = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleActionClick = useCallback((device: any, action: "disable" | "delete") => {
    setTargetDevice(device);
    setModalAction(action);
    setShowModal(true);
  }, []);

  const handleConfirmAction = async () => {
    if (modalAction === "delete") {
      try {
        await dispatch(deleteDevice(targetDevice.id)).unwrap();
        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: `Device "${targetDevice?.device_name}" has been deleted successfully.`,
          })
        );
        setShowModal(false);
        setTargetDevice(null);
        refreshTable();
      } catch (error) {
        dispatch(
          addAlert({
            type: "danger",
            title: "Delete Failed",
            message: `Failed to delete device: ${error}`,
          })
        );
      }
    } else {
      // Retire / re-activate persists is_active via the existing
      // PUT /api/v1/devices/:id endpoint. Pre-fix, this branch only
      // dispatched a success toast — the status never reached the DB
      // (DEF-030–032).
      try {
        await dispatch(
          updateDevice({
            deviceId: targetDevice.id,
            deviceData: { is_active: !targetDevice.is_active },
          })
        ).unwrap();
        const newStatus = !targetDevice?.is_active ? "activated" : "retired";
        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: `Device "${targetDevice?.device_name}" has been ${newStatus}.`,
          })
        );
        setShowModal(false);
        setTargetDevice(null);
        refreshTable();
      } catch (error) {
        dispatch(
          addAlert({
            type: "danger",
            title: "Update Failed",
            message: `Failed to update device: ${error}`,
          })
        );
      }
    }
  };

  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
    // Bump refreshKey so the table re-keyed wrapper re-mounts the
    // DataTable with the new ajax closure (which closes over filters).
    setRefreshKey((k) => k + 1);
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // Cap at 3 — comparison stays readable with up to 3 columns.
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  // Re-sync checkbox checked state with selectedIds after every
  // DataTables redraw (page change, search, filter). DT rebuilds
  // <input> nodes from the template so React state would otherwise
  // appear "lost" visually even though it's intact.
  useEffect(() => {
    if (!window.$) return;
    const $table = window.$("#devices-datatable");
    if ($table.length === 0) return;
    $table.find("input.device-compare-cb").each(function (this: HTMLInputElement) {
      const id = window.$(this).data("id");
      this.checked = selectedIds.includes(String(id));
    });
  }, [selectedIds, devices, refreshKey]);

  const handleCompare = useCallback(async () => {
    if (!token || selectedIds.length < 2) return;
    setShowCompare(true);
    setCompareLoading(true);
    setCompareRows([]);
    const rows = await Promise.all(
      selectedIds.map((id) => fetchDeviceCompareRow(id, token)),
    );
    setCompareRows(rows);
    setCompareLoading(false);
  }, [token, selectedIds]);

  useEffect(() => {
    if (!window.$) return;
    const $table = window.$("#devices-datatable");
    if ($table.length === 0) return;
    const onViewDevice = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data("id");
      if (id) navigate(`/device-management/devices/${id}`);
    };
    const onViewBeneficiary = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data("id");
      if (id) navigate(`/beneficiary-management/beneficiaries/${id}`);
    };
    const onEdit = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data("id");
      if (id) navigate(`/device-management/devices/${id}`);
    };
    const onToggle = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data("id");
      const device = devices.find((d: any) => d.id === id);
      if (device) handleActionClick(device, "disable");
    };
    const onDelete = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data("id");
      const device = devices.find((d: any) => d.id === id);
      if (device) handleActionClick(device, "delete");
    };
    const onCheckbox = (e: any) => {
      const id = window.$(e.currentTarget).data("id");
      if (id) toggleSelect(String(id));
    };
    $table.off(".dtActions");
    $table.on("click.dtActions", 'a[data-action="view-device"]', onViewDevice);
    $table.on("click.dtActions", 'a[data-action="view-beneficiary"]', onViewBeneficiary);
    $table.on("click.dtActions", 'button[data-action="edit"]', onEdit);
    $table.on("click.dtActions", 'button[data-action="toggle"]', onToggle);
    $table.on("click.dtActions", 'button[data-action="delete"]', onDelete);
    $table.on("click.dtActions", "input.device-compare-cb", onCheckbox);
    return () => {
      if ($table && $table.off) $table.off(".dtActions");
    };
  }, [navigate, devices, handleActionClick, toggleSelect]);

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
              onClick={handleCompare}
              disabled={loading || selectedIds.length < 2}
              title={selectedIds.length < 2
                ? "Select 2 or 3 devices to compare"
                : `Compare ${selectedIds.length} devices`}
            >
              <i className="material-icons-outlined me-1">compare_arrows</i>
              Compare
              {selectedIds.length > 0 && (
                <span className="badge bg-primary ms-2">{selectedIds.length}</span>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={() => setShowFilterModal(true)}
              disabled={loading}
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Filters
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
            <div className="table-responsive" key={JSON.stringify(activeFilters) + refreshKey}>
              <DataTableWrapper
                id="devices-datatable"
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
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ 
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <div className={`card border-top border-3 ${modalAction === "delete" ? "border-danger" : "border-warning"} rounded-0`}>
              <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                <h5
                  className={`mb-0 ${modalAction === "delete" ? "text-danger" : "text-warning"}`}
                >
                  Confirm {modalAction === "delete" ? "Delete" : "Retire"} Device
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setTargetDevice(null);
                  }}
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
                    onClick={() => {
                      setShowModal(false);
                      setTargetDevice(null);
                    }}
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

      {/* Device Compare Panel */}
      <DeviceComparePanel
        show={showCompare}
        onHide={() => setShowCompare(false)}
        rows={compareRows}
        loading={compareLoading}
      />
    </MainLayout>
  );
};

export default Devices;
