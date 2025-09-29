import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { useDataTable } from "../hooks/useDataTable";
import ImportVisitsModal from "../components/ImportVisitsModal";
import CheckInModal from "../components/CheckInModal";
import { fetchVisits, removeVisit, Visit } from "../store/slices/visitSlice";

const CicVisits: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useAppSelector((state) => state.visits);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"delete">("delete");
  const [targetVisit, setTargetVisit] = useState<Visit | null>(null);
  const [selectedCic, setSelectedCic] = useState<string>("");

  useEffect(() => {
    // Try to fetch from backend if available; otherwise ignore error and rely on client-side imports/check-ins
    dispatch(fetchVisits({})).catch(() => undefined);
  }, [dispatch]);

  const availableCics = useMemo(() => Array.from(new Set(visits.map(v => v.cic))).sort(), [visits]);

  const filteredVisits = useMemo(() => {
    if (!selectedCic) return visits;
    return visits.filter(v => v.cic === selectedCic);
  }, [visits, selectedCic]);

  const memoized = useMemo(() => filteredVisits, [filteredVisits]);

  useDataTable("cic-visits-datatable", memoized);

  const handleActionClick = (visit: Visit, action: "delete") => {
    setTargetVisit(visit);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete" && targetVisit) {
      dispatch(removeVisit(targetVisit.id));
      dispatch(addAlert({ type: "success", title: "Deleted", message: `Visit for "${targetVisit.name}" has been deleted.` }));
    }
    setShowModal(false);
    setTargetVisit(null);
  };

  const formatDuration = (mins: number | null) => {
    if (!mins || mins <= 0) return "-";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
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
                {availableCics.map(c => (
                  <option key={c} value={c}>{c}</option>
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
                <table id="cic-visits-datatable" className="table table-striped table-bordered" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>CIC</th>
                      <th>Name</th>
                      <th>Intervention</th>
                      <th>Activity</th>
                      <th>Assisted By</th>
                      <th>Notes / Follow Up</th>
                      <th>Check-In</th>
                      <th>Check Out</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memoized.map((visit) => (
                      <tr key={visit.id}>
                        <td>{visit.cic}</td>
                        <td>{visit.name}</td>
                        <td>{visit.programme}</td>
                        <td>{visit.activity}</td>
                        <td>{visit.assisted_by || "-"}</td>
                        <td>{visit.notes || "-"}</td>
                        <td>{new Date(visit.check_in).toLocaleString()}</td>
                        <td>{visit.check_out ? new Date(visit.check_out).toLocaleString() : "-"}</td>
                        <td>{formatDuration(visit.duration_minutes)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm p-1" title="Edit" style={{ border: "none", background: "transparent" }}>
                              <i className="material-icons-outlined text-primary">edit</i>
                            </button>
                            <button className="btn btn-sm p-1" title="Delete" onClick={() => handleActionClick(visit, "delete")} style={{ border: "none", background: "transparent" }}>
                              <i className="material-icons-outlined text-danger">delete</i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>CIC</th>
                      <th>Name</th>
                      <th>Intervention</th>
                      <th>Activity</th>
                      <th>Assisted By</th>
                      <th>Notes / Follow Up</th>
                      <th>Check-In</th>
                      <th>Check Out</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog">
            <div className={`card border-top border-3 border-danger rounded-0`} onClick={(e) => e.stopPropagation()}>
              <div className="card-header py-3 px-4">
                <h5 className="mb-0 text-danger">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to delete the visit for <strong>{targetVisit?.name}</strong>?
                  <span className="text-danger d-block mt-2">This action cannot be undone.</span>
                </p>
                <div className="d-md-flex d-grid align-items-center gap-3 mt-3">
                  <button type="button" className="btn btn-grd-royal px-4 rounded-0" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-grd-danger px-4 rounded-0" onClick={handleConfirmAction}>
                    Delete Visit
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
