import React from 'react';
import { Modal, Table, Badge } from 'react-bootstrap';
import { CSVImportResult } from '../types/csvImport';

interface CsvImportReportModalProps {
  show: boolean;
  result: CSVImportResult | null;
  onClose: () => void;
}

const CsvImportReportModal: React.FC<CsvImportReportModalProps> = ({ show, result, onClose }) => {
  if (!result) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-top border-3 border-success" style={{ borderRadius: 0 }}>
        <Modal.Title>
          <i className="bx bx-file-import me-2"></i>
          CSV Import Report
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="d-flex gap-4 mb-4">
          <div className="text-center">
            <div className="fs-3 fw-bold text-success">{result.created}</div>
            <div className="text-muted small">Created</div>
          </div>
          <div className="text-center">
            <div className="fs-3 fw-bold text-warning">{result.skipped}</div>
            <div className="text-muted small">Skipped</div>
          </div>
          <div className="text-center">
            <div className="fs-3 fw-bold text-danger">{result.errors.length}</div>
            <div className="text-muted small">Errors</div>
          </div>
        </div>

        {result.errors.length > 0 && (
          <>
            <h6 className="mb-2">Error Details</h6>
            <div className="table-responsive">
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Reason</th>
                    <th>Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err, idx) => (
                    <tr key={idx}>
                      <td>{err.row}</td>
                      <td>
                        <Badge bg={err.reason === 'duplicate within file' ? 'warning' : err.reason === 'validation' ? 'danger' : 'secondary'} text="dark">
                          {err.reason}
                        </Badge>
                      </td>
                      <td>
                        {err.fields
                          ? Object.entries(err.fields)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(', ')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-primary px-4" onClick={onClose}>
          OK
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CsvImportReportModal;
