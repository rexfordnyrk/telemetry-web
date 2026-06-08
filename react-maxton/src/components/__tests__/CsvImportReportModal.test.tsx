import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CsvImportReportModal from '../CsvImportReportModal';
import { CSVImportResult } from '../../store/slices/beneficiarySlice';

// Suppress react-bootstrap Modal warnings in tests
jest.mock('react-bootstrap', () => {
  const actual = jest.requireActual('react-bootstrap');
  return actual;
});

const renderModal = (result: CSVImportResult | null, show = true, onClose = jest.fn()) => {
  return render(
    <CsvImportReportModal show={show} result={result} onClose={onClose} />
  );
};

describe('CsvImportReportModal', () => {
  it('renders nothing when result is null', () => {
    const { container } = renderModal(null);
    expect(container.firstChild).toBeNull();
  });

  it('displays created count', () => {
    renderModal({ created: 5, skipped: 2, errors: [] });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays skipped count', () => {
    renderModal({ created: 5, skipped: 2, errors: [] });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays error count', () => {
    const errors = [
      { row: 10, reason: 'validation', fields: { email: 'invalid' } },
      { row: 11, reason: 'db_error' },
    ];
    renderModal({ created: 0, skipped: 0, errors });
    // The error count stat should show "2"
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders error table with row, reason, and fields', () => {
    const errors = [
      { row: 3, reason: 'duplicate within file', fields: { email: 'dup@test.com' } },
    ];
    renderModal({ created: 1, skipped: 1, errors });
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('duplicate within file')).toBeInTheDocument();
    expect(screen.getByText('email: dup@test.com')).toBeInTheDocument();
  });

  it('does not render error table when there are no errors', () => {
    renderModal({ created: 3, skipped: 0, errors: [] });
    expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
  });

  it('renders multiple errors', () => {
    const errors = [
      { row: 1, reason: 'validation' },
      { row: 2, reason: 'db_error' },
    ];
    renderModal({ created: 0, skipped: 0, errors });
    expect(screen.getByText('validation')).toBeInTheDocument();
    expect(screen.getByText('db_error')).toBeInTheDocument();
  });

  it('calls onClose when OK button is clicked', () => {
    const onClose = jest.fn();
    renderModal({ created: 1, skipped: 0, errors: [] }, true, onClose);
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows Created, Skipped, Errors labels', () => {
    renderModal({ created: 10, skipped: 3, errors: [] });
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
  });
});
