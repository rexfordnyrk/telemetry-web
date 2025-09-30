import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import DataTableWrapper from "../components/DataTableWrapper";
import ImportVisitsModal from "../components/ImportVisitsModal";
import CheckInModal from "../components/CheckInModal";
import { checkoutVisit, deleteVisit, fetchVisits, Visit } from "../store/slices/visitSlice";

const CicVisits: React.FC = () => {
  const dispatch = useAppDispatch();
  const { visits, loading, error } = useAppSelector((state) => state.visits);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"delete">("delete");
  const [targetVisit, setTargetVisit] = useState<Visit | null>(null);
  const [selectedCic, setSelectedCic] = useState<string>("");
  const [checkoutProcessingId, setCheckoutProcessingId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch from backend if available; otherwise ignore error and rely on client-side imports/check-ins
    dispatch(fetchVisits({})).catch(() => undefined);
  }, [dispatch]);

  const availableCics = useMemo(() => {
    const map = new Map<string, string>();
    visits.forEach((visit) => {
      if (visit.cic_id) {
        map.set(visit.cic_id, visit.cic_name || "Unnamed CIC");
      }
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [visits]);

  const filteredVisits = useMemo(() => {
    if (!selectedCic) return visits;
    return visits.filter((visit) => visit.cic_id === selectedCic);
  }, [visits, selectedCic]);

  const memoized = useMemo(() => filteredVisits, [filteredVisits]);


  const dtColumns = useMemo(() => [
    { title: 'CIC', data: 'cic_name', render: (d: any) => d || '-' },
    { title: 'Beneficiary', data: 'beneficiary_name', render: (d: any) => d || '-' },
    { title: 'Intervention', data: 'intervention_name', render: (d: any) => d || '-' },
    { title: 'Activity', data: 'activity_name', render: (d: any) => d || '-' },
    { title: 'Assisted By', data: 'assisted_by', render: (d: any) => d || '-' },
    { title: 'Notes / Follow Up', data: 'notes', render: (d: any) => d || '-' },
    { title: 'Check-In', data: 'check_in_at', render: (d: any) => d ? new Date(d).toLocaleString() : '-' },
    { title: 'Check-Out', data: 'check_out_at', render: (d: any) => d ? new Date(d).toLocaleString() : '-' },
    { title: 'Duration', data: 'duration_minutes', render: (mins: any) => {
      const m = Number(mins);
      if (!m || m <= 0) return '-';
      const h = Math.floor(m / 60);
      const r = m % 60;
      return h > 0 ? `${h}h ${r}m` : `${r}m`;
    } },
    {
      title: 'Actions', data: null, orderable: false, searchable: false,
      render: (_: any, __: any, row: Visit) => {
        const isProcessing = checkoutProcessingId === row.id;
        const isCheckedOut = Boolean(row.check_out_at);
        const checkoutDisabled = isCheckedOut || isProcessing ? 'disabled' : '';
        const checkoutIcon = isCheckedOut
          ? '<i class="material-icons-outlined align-middle">check_circle</i>'
          : isProcessing
            ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
            : '<i class="material-icons-outlined align-middle">logout</i>';
        const checkoutLabel = isCheckedOut ? 'Checked Out' : 'Check-Out';

        return `
          <div class="d-flex gap-2 align-items-center">
            <button type="button" class="btn btn-sm btn-outline-success d-flex align-items-center gap-1" data-action="checkout" data-id="${row.id}" ${checkoutDisabled}>
              ${checkoutIcon}
              <span>${checkoutLabel}</span>
            </button>
            <button class="btn btn-sm p-1" title="Edit" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-primary">edit</i>
            </button>
            <button class="btn btn-sm p-1" title="Delete" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-danger">delete</i>
            </button>
          </div>`;
      }
    }
  ], [checkoutProcessingId]);

  const dtOptions = React.useMemo(() => ({
    columns: dtColumns,
    pageLength: 10,
    autoWidth: false,
    searching: true,
    ordering: true,
    info: true,
    lengthChange: true,
    responsive: true,
  }), [dtColumns]);

  const handleVisitCheckout = useCallback(
    async (visit: Visit, sourceButton?: HTMLElement | null) => {
      if (checkoutProcessingId === visit.id || visit.check_out_at) {
        return;
      }

      setCheckoutProcessingId(visit.id);
      if (sourceButton) {
        sourceButton.setAttribute("disabled", "true");
      }

      try {
        const updated = await dispatch(
          checkoutVisit({ id: visit.id, checkoutTime: new Date().toISOString() })
        ).unwrap();

        const checkOutDisplayTime = updated.check_out_at
          ? new Date(updated.check_out_at).toLocaleString()
          : new Date().toLocaleString();

        dispatch(
          addAlert({
            type: "success",
            title: "Visit Checked Out",
            message: `${updated.beneficiary_name || "Beneficiary"} checked out at ${checkOutDisplayTime}.`,
          })
        );
      } catch (error) {
        if (sourceButton) {
          sourceButton.removeAttribute("disabled");
        }
        dispatch(
          addAlert({
            type: "danger",
            title: "Checkout Failed",
            message: error instanceof Error ? error.message : "Unable to process checkout.",
          })
        );
      } finally {
        setCheckoutProcessingId(null);
      }
    },
    [checkoutProcessingId, dispatch]
  );

  useEffect(() => {
    if (!window.$) return;
    const $table = window.$('#cic-visits-datatable');
    if ($table.length === 0) return;

    const onDelete = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      const v = memoized.find((x) => x.id === id);
      if (v) handleActionClick(v, 'delete');
    };
    const onEdit = (e: any) => {
      e.preventDefault();
      // Optional: open edit modal later
    };
    const onCheckoutClick = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      const visit = memoized.find((x) => x.id === id);
      if (visit) {
        handleVisitCheckout(visit, e.currentTarget as HTMLElement);
      }
    };

    $table.off('.dtActions');
    $table.on('click.dtActions', 'button[data-action="delete"]', onDelete);
    $table.on('click.dtActions', 'button[data-action="edit"]', onEdit);
    $table.on('click.dtActions', 'button[data-action="checkout"]', onCheckoutClick);

    return () => { if ($table && $table.off) $table.off('.dtActions'); };
  }, [memoized, handleVisitCheckout]);

  const handleActionClick = (visit: Visit, action: "delete") => {
    setTargetVisit(visit);
    setModalAction(action);
    setDeleteError(null);
    setDeleteSubmitting(false);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (modalAction !== "delete" || !targetVisit) {
      return;
    }

    try {
      setDeleteSubmitting(true);
      setDeleteError(null);
      await dispatch(deleteVisit(targetVisit.id)).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Visit Deleted",
          message: `Visit for "${targetVisit.beneficiary_name || "Beneficiary"}" has been deleted.`,
        })
      );
      setShowModal(false);
      setTargetVisit(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete visit.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="main-content">
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
                  CIC Visits
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="cicFilter" className="mb-0 small text-muted">CIC</label>
              <select
                id="cicFilter"
                className="form-select form-select-sm"
                style={{ width: "180px" }}
                value={selectedCic}
                onChange={(e) => setSelectedCic(e.target.value)}
                disabled={loading}
              >
                <option value="">All CICs</option>
                {availableCics.map((cic) => (
                  <option key={cic.id} value={cic.id}>{cic.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-grd-info px-4"
              onClick={() => setShowImportModal(true)}
              disabled={loading}
            >
              <i className="material-icons-outlined me-1">file_upload</i>
              Import Data
            </button>
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => setShowCheckInModal(true)}
              disabled={loading}
            >
              + | Check-In
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">CIC Visits</h6>
          {loading && (
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-muted">Loading visits...</span>
            </div>
          )}
        </div>
        <hr />
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => undefined}></button>
          </div>
        )}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading visit records from server...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <DataTableWrapper id="cic-visits-datatable" data={memoized} options={dtOptions} className="table table-striped table-bordered" style={{ width: "100%" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            if (!deleteSubmitting) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-dialog">
            <div className={`card border-top border-3 border-danger rounded-0`} onClick={(e) => e.stopPropagation()}>
              <div className="card-header py-3 px-4">
                <h5 className="mb-0 text-danger">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={deleteSubmitting}></button>
              </div>
              <div className="card-body p-4">
                {deleteError && (
                  <div className="alert alert-danger" role="alert">
                    {deleteError}
                  </div>
                )}
                <p>
                  Are you sure you want to delete the visit for <strong>{targetVisit?.beneficiary_name || "this beneficiary"}</strong>?
                  <span className="text-danger d-block mt-2">This action cannot be undone.</span>
                </p>
                <div className="d-md-flex d-grid align-items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-grd-royal px-4 rounded-0"
                    onClick={() => setShowModal(false)}
                    disabled={deleteSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-grd-danger px-4 rounded-0"
                    onClick={handleConfirmAction}
                    disabled={deleteSubmitting}
                  >
                    {deleteSubmitting ? (
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Deleting...
                      </span>
                    ) : (
                      "Delete Visit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CheckInModal show={showCheckInModal} onHide={() => setShowCheckInModal(false)} />
      <ImportVisitsModal show={showImportModal} onHide={() => setShowImportModal(false)} />
    </MainLayout>
  );
};

export default CicVisits;
