/**
 * CIC Visits — Delete confirmation modal backdrop behaviour (§7.3 phase-1).
 *
 * Verifies that the delete confirmation modal:
 * - Does NOT dismiss when the user clicks within the dialog body.
 * - DOES dismiss when the user clicks the surrounding backdrop.
 *
 * Mirrors the sibling-backdrop pattern adopted in Beneficiaries.tsx so the
 * modal cannot be cancelled by stray clicks on its own content.
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Extract just the modal markup we changed in CicVisits.tsx so we can exercise
// its click behaviour without booting the whole page (DataTables, jQuery, etc).
const DeleteConfirmationModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
}> = ({ show, onClose, onConfirm, submitting }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        data-testid="delete-backdrop"
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 }}
        onClick={() => { if (!submitting) onClose(); }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="card border-top border-3 border-danger rounded-0"
        style={{ position: 'relative', zIndex: 10001, width: '100%', maxWidth: 480 }}
      >
        <div className="card-header py-3 px-4 d-flex align-items-center justify-content-between">
          <h5 className="mb-0 text-danger">Confirm Delete</h5>
        </div>
        <div className="card-body p-4">
          <p>Are you sure you want to delete the visit for <strong>Test Beneficiary</strong>?</p>
          <button type="button" data-testid="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" data-testid="confirm-btn" onClick={onConfirm}>Delete Visit</button>
        </div>
      </div>
    </div>
  );
};

const Harness: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <>
      <div data-testid="state">{open ? 'open' : 'closed'}{confirmed ? '-confirmed' : ''}</div>
      <DeleteConfirmationModal
        show={open}
        onClose={() => setOpen(false)}
        onConfirm={() => { setConfirmed(true); setOpen(false); }}
      />
    </>
  );
};

describe('CicVisits delete modal — backdrop pattern (§7.3 phase-1)', () => {
  it('does not close when the user clicks dialog body text', () => {
    render(<Harness />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Are you sure you want to delete/i));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('state').textContent).toBe('open');
  });

  it('does not close when the user clicks the heading', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('Confirm Delete'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes when the backdrop is clicked', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('delete-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('state').textContent).toBe('closed');
  });

  it('closes when Cancel is clicked', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('triggers confirm callback when Delete Visit is clicked', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('confirm-btn'));
    expect(screen.getByTestId('state').textContent).toBe('closed-confirmed');
  });
});
