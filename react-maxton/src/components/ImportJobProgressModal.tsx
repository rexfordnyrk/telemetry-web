import React from "react";
import { Modal, ProgressBar } from "react-bootstrap";

export interface ImportJobStatus {
  id: string;
  status: "queued" | "processing" | "completed" | "failed" | "canceled" | string;
  current_page?: number;
  total_pages?: number;
  progress?: number; // percentage 0-100
  total_records?: number;
  processed_records?: number;
  created_records?: number;
  updated_records?: number;
  skipped_records?: number;
  error_count?: number;
  started_at?: string | null;
  completed_at?: string | null;
  error_message?: string;
}

interface ImportJobProgressModalProps {
  show: boolean;
  onClose: () => void;
  onBackground: () => void;
  onCancelJob: () => void;
  status: ImportJobStatus | null;
}

const ImportJobProgressModal: React.FC<ImportJobProgressModalProps> = ({ show, onClose, onBackground, onCancelJob, status }) => {
  const progress = Math.max(0, Math.min(100, status?.progress ?? 0));
  const isTerminal = status?.status === "completed" || status?.status === "failed" || status?.status === "canceled";

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
      <div className={`card border-top border-3 ${status?.status === 'failed' ? 'border-danger' : status?.status === 'completed' ? 'border-success' : 'border-warning'} rounded-0 w-100`}> 
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">PMS Import Progress</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="card-body">
          <div className="mb-2 d-flex justify-content-between">
            <span>Status: <strong className="text-capitalize">{status?.status || 'queued'}</strong></span>
            <span>{progress.toFixed(2)}%</span>
          </div>
          <ProgressBar now={progress} variant={status?.status === 'failed' ? 'danger' : status?.status === 'completed' ? 'success' : 'info'} className="mb-3" />
          <div className="row g-3">
            {status?.current_page !== undefined && (
              <div className="col-6"><small>Page:</small> <div>{status.current_page} / {status.total_pages ?? 0}</div></div>
            )}
            {status?.processed_records !== undefined && (
              <div className="col-6"><small>Processed:</small> <div>{status.processed_records} / {status.total_records ?? 0}</div></div>
            )}
            {status?.created_records !== undefined && (
              <div className="col-6"><small>Created:</small> <div>{status.created_records}</div></div>
            )}
            {status?.updated_records !== undefined && (
              <div className="col-6"><small>Updated:</small> <div>{status.updated_records}</div></div>
            )}
            {status?.error_count !== undefined && (
              <div className="col-6"><small>Errors:</small> <div>{status.error_count}</div></div>
            )}
            {status?.error_message && (
              <div className="col-12 text-danger"><small>Error:</small> <div>{status.error_message}</div></div>
            )}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button type="button" className="btn btn-light" onClick={onBackground} disabled={isTerminal}>
            Run in background
          </button>
          <div className="d-flex gap-2">
            {!isTerminal && (
              <button type="button" className="btn btn-grd-danger" onClick={onCancelJob}>
                Cancel
              </button>
            )}
            <button type="button" className={`btn ${status?.status === 'completed' ? 'btn-grd-success' : status?.status === 'failed' ? 'btn-grd-danger' : 'btn-secondary'}`} onClick={onClose}>
              {status?.status === 'completed' ? 'Done' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImportJobProgressModal;
