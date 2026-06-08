import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Beneficiary } from '../store/slices/beneficiarySlice';

interface SimilarBeneficiaryConfirmModalProps {
  show: boolean;
  matches: Beneficiary[];
  onCancel: () => void;
  onConfirm: () => void;
}

const SimilarBeneficiaryConfirmModal: React.FC<SimilarBeneficiaryConfirmModalProps> = ({
  show,
  matches,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      size="lg"
      centered
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <Modal.Header
        closeButton
        className="border-top border-3 border-warning"
        style={{ borderRadius: 0 }}
      >
        <Modal.Title>
          <i className="bx bx-error-circle me-2 text-warning"></i>
          Similar records found
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <p className="text-muted mb-3">
          The following existing beneficiaries have similar contact details. Please review
          before creating a new record.
        </p>
        <Table striped bordered hover responsive size="sm">
          <thead className="table-warning">
            <tr>
              <th>Name</th>
              <th>Programme</th>
              <th>District</th>
              <th>External ID</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.programme}</td>
                <td>{b.district}</td>
                <td>{b.id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Create anyway
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SimilarBeneficiaryConfirmModal;
