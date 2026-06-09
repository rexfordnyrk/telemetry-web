import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import DataTableWrapper from "../components/DataTableWrapper";
import ImportVisitsModal from "../components/ImportVisitsModal";
import CheckInModal from "../components/CheckInModal";
import { checkoutVisit, deleteVisit, fetchVisits, updateVisit, Visit, UpdateVisitPayload } from "../store/slices/visitSlice";
import { escapeHtml } from "../utils/escapeHtml";
import { interventionService } from "../services/interventionService";

const DEFAULT_PER_PAGE = 50;

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
  const [refreshKey, setRefreshKey] = useState(0);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateVisitPayload>({
    intervention_id: null,
    activity_name: null,
    assisted_by: null,
    notes: null,
    check_in_at: undefined,
    check_out_at: null,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Correction sub-state for retroactive time edits (§7.3 phase-3 DEF-267).
  const [correctionMode, setCorrectionMode] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");
  const [originalTimes, setOriginalTimes] = useState<{ checkIn: string; checkOut: string | null }>({
    checkIn: "",
    checkOut: null,
  });

  // Intervention options for the edit modal dropdown. Loaded once on mount so
  // editing a visit shows the intervention by *name* instead of its UUID.
  const [interventionOptions, setInterventionOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadInterventions = async () => {
      try {
        const response = await interventionService.list({ limit: 200 });
        const items = Array.isArray(response?.data) ? response.data : [];
        const mapped = items
          .map((item: any) => {
            const id = item?.id ?? item?.uuid ?? null;
            const name = item?.name ?? item?.title ?? "";
            if (!id || !name) return null;
            return { id: String(id), name: String(name) };
          })
          .filter((x: any): x is { id: string; name: string } => Boolean(x));
        const unique = new Map<string, { id: string; name: string }>();
        mapped.forEach((item) => unique.set(item.id, item));
        if (!cancelled) {
          setInterventionOptions(
            Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name)),
          );
        }
      } catch {
        // Non-fatal — the edit form falls back to the previously-selected name.
      }
    };
    loadInterventions();
    return () => { cancelled = true; };
  }, []);

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

  const memoized = visits;


  const dtColumns = useMemo(() => [
    { title: 'CIC', data: 'cic_name', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Beneficiary', data: 'beneficiary_name', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Intervention', data: 'intervention_name', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Activity', data: 'activity_name', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Assisted By', data: 'assisted_by', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Notes / Follow Up', data: 'notes', render: (d: any) => escapeHtml(d) || '-' },
    { title: 'Check-In', data: 'check_in_at', render: (d: any) => d ? new Date(d).toLocaleString() : '-' },
    { title: 'Check-Out', data: 'check_out_at', render: (d: any) => d ? new Date(d).toLocaleString() : '-' },
    {
      title: 'Duration', data: null, orderable: false,
      render: (_: any, __: any, row: Visit) => {
        // Prefer the backend-computed value; fall back to check_out - check_in
        // when the row carries times but no precomputed duration (legacy data
        // or third-party imports that bypassed the dedicated checkout flow).
        let m = Number(row.duration_minutes);
        if ((!m || m <= 0) && row.check_in_at && row.check_out_at) {
          const ms = new Date(row.check_out_at).getTime() - new Date(row.check_in_at).getTime();
          if (Number.isFinite(ms) && ms > 0) m = Math.round(ms / 60000);
        }
        if (!m || m <= 0) return '-';
        const h = Math.floor(m / 60);
        const r = m % 60;
        return h > 0 ? `${h}h ${r}m` : `${r}m`;
      },
    },
    {
      title: 'Actions', data: null, orderable: false, searchable: false,
      render: (_: any, __: any, row: Visit) => {
        const isProcessing = checkoutProcessingId === row.id;
        const isCheckedOut = Boolean(row.check_out_at);
        const checkoutIcon = isProcessing
          ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
          : '<i data-feather="log-out" class="align-middle" style="width: 16px; height: 16px;"></i>';

        const checkoutButton = isCheckedOut ? '' : `
          <button type="button" class="btn btn-sm btn-outline-success d-flex align-items-center gap-1" data-action="checkout" data-id="${row.id}" ${isProcessing ? 'disabled' : ''} style="white-space: nowrap;">
            ${checkoutIcon}
            <span>Check-Out</span>
          </button>`;

        return `
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-sm p-1" title="Edit" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-primary">edit</i>
            </button>
            <button class="btn btn-sm p-1" title="Delete" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-danger">delete</i>
            </button>
            ${checkoutButton}
          </div>`;
      }
    }
  ], [checkoutProcessingId]);

  const dtOptions = React.useMemo(() => ({
    columns: dtColumns,
    serverSide: true,
    processing: true,
    pageLength: DEFAULT_PER_PAGE,
    lengthChange: true,
    autoWidth: false,
    searching: true,
    ordering: true,
    info: true,
    responsive: true,
    ajax: (requestData: any, callback: (json: { draw?: number; data: any[]; recordsTotal: number; recordsFiltered: number }) => void) => {
      const start = requestData.start ?? requestData.iDisplayStart ?? 0;
      const length = requestData.length ?? requestData.iDisplayLength ?? DEFAULT_PER_PAGE;
      const page = Math.floor(start / length) + 1;
      const params: Record<string, unknown> = { page, limit: length };
      if (selectedCic) params.cic_id = selectedCic;
      const searchValue = (requestData.search?.value ?? "").trim();
      if (searchValue) params.search = searchValue;
      dispatch(fetchVisits(params as any))
        .unwrap()
        .then(({ visits: data, pagination }) => {
          const total = pagination?.total_records ?? (start + data.length + (data.length >= length ? 1 : 0));
          callback({ draw: requestData.draw, data, recordsTotal: total, recordsFiltered: total });
        })
        .catch(() => {
          callback({ draw: requestData.draw, data: [], recordsTotal: 0, recordsFiltered: 0 });
        });
    },
  }), [dtColumns, selectedCic, dispatch]);

  const refreshTable = useCallback(() => setRefreshKey((k) => k + 1), []);

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
        refreshTable();
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
    [checkoutProcessingId, dispatch, refreshTable]
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
      const id = window.$(e.currentTarget).data('id');
      const visit = memoized.find((x) => x.id === id);
      if (visit) {
        handleOpenEditModal(visit);
      }
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

    // Initialize feather icons for the table
    if (typeof window.feather !== 'undefined') {
      window.feather.replace();
    }

    return () => { if ($table && $table.off) $table.off('.dtActions'); };
  }, [memoized, handleVisitCheckout]);

  const handleActionClick = (visit: Visit, action: "delete") => {
    setTargetVisit(visit);
    setModalAction(action);
    setDeleteError(null);
    setDeleteSubmitting(false);
    setShowModal(true);
  };

  const handleCloseModal = (force: boolean = false) => {
    if (deleteSubmitting && !force) {
      return;
    }
    setShowModal(false);
    setTargetVisit(null);
    setDeleteError(null);
  };

  const handleOpenEditModal = (visit: Visit) => {
    setEditingVisit(visit);
    setEditFormData({
      intervention_id: visit.intervention_id,
      activity_name: visit.activity_name,
      assisted_by: visit.assisted_by,
      notes: visit.notes,
      check_in_at: visit.check_in_at,
      check_out_at: visit.check_out_at,
    });
    setOriginalTimes({ checkIn: visit.check_in_at, checkOut: visit.check_out_at });
    setCorrectionMode(false);
    setCorrectionNote("");
    setEditError(null);
    setEditSubmitting(false);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (editSubmitting) return;
    setShowEditModal(false);
    setEditingVisit(null);
    setEditFormData({
      intervention_id: null,
      activity_name: null,
      assisted_by: null,
      notes: null,
      check_in_at: undefined,
      check_out_at: null,
    });
    setOriginalTimes({ checkIn: "", checkOut: null });
    setCorrectionMode(false);
    setCorrectionNote("");
    setEditError(null);
    setEditSubmitting(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVisit || editSubmitting) return;

    const newCheckIn = editFormData.check_in_at ?? "";
    const newCheckOut = editFormData.check_out_at ?? null;
    const timesChanged =
      newCheckIn !== originalTimes.checkIn || newCheckOut !== originalTimes.checkOut;

    if (timesChanged && correctionNote.trim().length < 10) {
      setEditError("A correction note of at least 10 characters is required when changing visit times.");
      return;
    }

    const payload: UpdateVisitPayload = {
      intervention_id: editFormData.intervention_id ?? null,
      activity_name: editFormData.activity_name ?? null,
      assisted_by: editFormData.assisted_by ?? null,
      notes: editFormData.notes ?? null,
    };
    if (timesChanged) {
      payload.check_in_at = newCheckIn;
      payload.check_out_at = newCheckOut;
      payload.correction_note = correctionNote.trim();
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      await dispatch(updateVisit({ id: editingVisit.id, payload })).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Visit Updated",
          message: `Visit for "${editingVisit.beneficiary_name || "Beneficiary"}" has been updated successfully.`,
        })
      );
      setEditSubmitting(false);
      handleCloseEditModal();
      refreshTable();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Failed to update visit.");
      setEditSubmitting(false);
    }
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
      handleCloseModal(true);
      refreshTable();
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
            <div className="table-responsive" key={selectedCic + refreshKey}>
              <DataTableWrapper id="cic-visits-datatable" data={[]} options={dtOptions} className="table table-striped table-bordered" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000 }}
            onClick={() => { if (!deleteSubmitting) handleCloseModal(); }}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="card border-top border-3 border-danger rounded-0"
            style={{ position: "relative", zIndex: 10001, width: "100%", maxWidth: 480 }}
          >
            <div className="card-header py-3 px-4 d-flex align-items-center justify-content-between">
              <h5 className="mb-0 text-danger">Confirm Delete</h5>
              <button type="button" className="btn-close" onClick={() => handleCloseModal()} disabled={deleteSubmitting} aria-label="Close"></button>
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
                  onClick={() => handleCloseModal()}
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
      )}

      <CheckInModal
        show={showCheckInModal}
        onHide={() => setShowCheckInModal(false)}
        onSuccess={refreshTable}
      />
      <ImportVisitsModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onImportSuccess={refreshTable}
      />

      {/* Edit Visit Modal (sibling backdrop pattern + correction UI — §7.3 phase-3) */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000 }}
            onClick={() => { if (!editSubmitting) handleCloseEditModal(); }}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="card border-top border-3 border-primary rounded-0"
            style={{ position: "relative", zIndex: 10001, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="card-header py-3 px-4 d-flex align-items-center justify-content-between">
              <h5 className="mb-0 text-primary">Edit Visit</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleCloseEditModal()}
                disabled={editSubmitting}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="card-body p-4">
                {editError && (
                  <div className="alert alert-danger" role="alert">
                    {editError}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="editBeneficiary" className="form-label">Beneficiary</label>
                    <input type="text" className="form-control" id="editBeneficiary" value={editingVisit?.beneficiary_name || ""} disabled />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editCic" className="form-label">CIC</label>
                    <input type="text" className="form-control" id="editCic" value={editingVisit?.cic_name || ""} disabled />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editIntervention" className="form-label">Intervention</label>
                    <select
                      className="form-select"
                      id="editIntervention"
                      name="intervention_id"
                      value={editFormData.intervention_id || ""}
                      onChange={handleEditFormChange}
                      disabled={editSubmitting}
                    >
                      <option value="">— None —</option>
                      {/*
                        Keep the original intervention selectable even if the
                        master list hasn't loaded or is missing this entry, so
                        the form doesn't silently drop the visit's value.
                      */}
                      {editingVisit?.intervention_id &&
                        !interventionOptions.some((o) => o.id === editingVisit.intervention_id) && (
                          <option value={editingVisit.intervention_id}>
                            {editingVisit.intervention_name || editingVisit.intervention_id}
                          </option>
                        )}
                      {interventionOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editActivity" className="form-label">Activity</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editActivity"
                      name="activity_name"
                      value={editFormData.activity_name || ""}
                      onChange={handleEditFormChange}
                      placeholder="Enter activity name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editAssistedBy" className="form-label">Assisted By</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editAssistedBy"
                      name="assisted_by"
                      value={editFormData.assisted_by || ""}
                      onChange={handleEditFormChange}
                      placeholder="Enter assistant name"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="editNotes" className="form-label">Notes / Follow Up</label>
                    <textarea
                      className="form-control"
                      id="editNotes"
                      name="notes"
                      rows={3}
                      value={editFormData.notes || ""}
                      onChange={handleEditFormChange}
                      placeholder="Enter notes or follow-up information"
                    ></textarea>
                  </div>
                </div>

                {/* Visit times — read-only by default, editable only after the
                    user enters correction mode and supplies a note. */}
                <hr className="my-4" />
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Visit Times</h6>
                  {!correctionMode && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      onClick={() => setCorrectionMode(true)}
                      disabled={editSubmitting}
                    >
                      <i className="material-icons-outlined me-1 align-middle" style={{ fontSize: 16 }}>edit</i>
                      Correct check-in or check-out times
                    </button>
                  )}
                </div>

                {!correctionMode && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Check-In</label>
                      <div className="form-control bg-light">
                        {originalTimes.checkIn ? new Date(originalTimes.checkIn).toLocaleString() : "—"}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Check-Out</label>
                      <div className="form-control bg-light">
                        {originalTimes.checkOut ? new Date(originalTimes.checkOut).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>
                )}

                {correctionMode && (
                  <>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="editCheckIn" className="form-label">Check-In Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          id="editCheckIn"
                          name="check_in_at"
                          value={editFormData.check_in_at ? new Date(editFormData.check_in_at).toISOString().slice(0, 16) : ""}
                          onChange={handleEditFormChange}
                          disabled={editSubmitting}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="editCheckOut" className="form-label">Check-Out Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          id="editCheckOut"
                          name="check_out_at"
                          value={editFormData.check_out_at ? new Date(editFormData.check_out_at).toISOString().slice(0, 16) : ""}
                          onChange={handleEditFormChange}
                          disabled={editSubmitting}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="editCorrectionNote" className="form-label">
                          Correction Note <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="editCorrectionNote"
                          rows={2}
                          value={correctionNote}
                          onChange={(e) => setCorrectionNote(e.target.value)}
                          placeholder="Why were these times corrected? (min 10 characters)"
                          disabled={editSubmitting}
                        />
                        <div className="form-text">
                          A correction note of at least 10 characters is required when changing visit times.
                          The note is stored in the audit trail along with the previous and new values.
                        </div>
                      </div>
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0"
                          onClick={() => {
                            setCorrectionMode(false);
                            setCorrectionNote("");
                            setEditFormData((prev) => ({
                              ...prev,
                              check_in_at: originalTimes.checkIn,
                              check_out_at: originalTimes.checkOut,
                            }));
                          }}
                          disabled={editSubmitting}
                        >
                          Cancel time correction
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="card-footer d-flex justify-content-end gap-2 py-3 px-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCloseEditModal()}
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? (
                    <span className="d-inline-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Updating...
                    </span>
                  ) : (
                    "Update Visit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CicVisits;
