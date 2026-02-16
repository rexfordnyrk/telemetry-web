import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FilterModal from "../components/FilterModal";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { fetchDevices, deleteDevice } from "../store/slices/deviceSlice";

const DEFAULT_PER_PAGE = 50;

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { devices, loading, error } = useAppSelector((state) => state.devices);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">("disable");
  const [targetDevice, setTargetDevice] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});
  const [refreshKey, setRefreshKey] = useState(0);

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
        title: "Device Name",
        data: "device_name",
        render: (_: any, __: any, row: any) =>
          `<a href="#" class="text-decoration-none fw-bold" data-action="view-device" data-id="${row.id}">${row.device_name || ""}</a>`,
      },
      { title: "Android Version", data: "android_version" },
      { title: "App Version", data: "app_version" },
      { title: "Partner", data: "organization" },
      { title: "Intervention", data: "programme" },
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
            return `<a href="#" class="text-decoration-none fw-bold text-primary" data-action="view-beneficiary" data-id="${b.id}">${b.name || ""}</a>`;
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
          return `<div class="d-flex gap-1">
            <button class="btn btn-sm p-1" title="Edit Device" data-action="edit" data-id="${row.id}" style="border:none;background:transparent"><i class="material-icons-outlined text-primary">edit</i></button>
            <button class="btn btn-sm p-1" title="Retire/Activate" data-action="toggle" data-id="${row.id}" style="border:none;background:transparent"><i class="material-icons-outlined text-warning">${icon}</i></button>
            <button class="btn btn-sm p-1" title="Delete Device" data-action="delete" data-id="${row.id}" style="border:none;background:transparent"><i class="material-icons-outlined text-danger">delete</i></button>
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
        if (activeFilters.organization) params.organization = activeFilters.organization;
        if (activeFilters.programme) params.programme = activeFilters.programme;
        if (activeFilters.is_active !== undefined) params.is_active = activeFilters.is_active;
        dispatch(fetchDevices(params as any))
          .unwrap()
          .then((data: any[]) => {
            const total = start + data.length + (data.length >= length ? 1 : 0);
            callback({ draw: requestData.draw, data, recordsTotal: total, recordsFiltered: total });
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
      const newStatus = !targetDevice?.is_active ? "activated" : "deactivated";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Device "${targetDevice?.device_name}" has been ${newStatus}.`,
        })
      );
      
      setShowModal(false);
      setTargetDevice(null);
    }
  };

  const handleApplyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters);
  };

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
    $table.off(".dtActions");
    $table.on("click.dtActions", 'a[data-action="view-device"]', onViewDevice);
    $table.on("click.dtActions", 'a[data-action="view-beneficiary"]', onViewBeneficiary);
    $table.on("click.dtActions", 'button[data-action="edit"]', onEdit);
    $table.on("click.dtActions", 'button[data-action="toggle"]', onToggle);
    $table.on("click.dtActions", 'button[data-action="delete"]', onDelete);
    return () => {
      if ($table && $table.off) $table.off(".dtActions");
    };
  }, [navigate, devices, handleActionClick]);

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
    </MainLayout>
  );
};

export default Devices;
