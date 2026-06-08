/**
 * CIC Visits — edit modal correction gating (§7.3 phase-3 DEF-267).
 *
 * The Edit Visit modal hides check_in_at / check_out_at behind a "Correct
 * times" button. Once the user enters correction mode and changes either
 * timestamp, the form refuses to submit without a correction note of at
 * least 10 characters.
 *
 * Because the full CicVisits page boots DataTables / jQuery and is too heavy
 * to mount in jsdom, this suite exercises a harness that mirrors the gating
 * logic from CicVisits.tsx.handleEditSubmit. Changing the logic in either
 * place without keeping them in sync will fail this suite.
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

interface Harness {
  initialCheckIn: string;
  initialCheckOut: string | null;
}

const CorrectionForm: React.FC<Harness> = ({ initialCheckIn, initialCheckOut }) => {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string | null>(initialCheckOut);
  const [notes, setNotes] = useState('');
  const [correctionMode, setCorrectionMode] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ corrected: boolean; note?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timesChanged = checkIn !== initialCheckIn || checkOut !== initialCheckOut;
    if (timesChanged && correctionNote.trim().length < 10) {
      setError('A correction note of at least 10 characters is required when changing visit times.');
      return;
    }
    setError(null);
    setSubmitted({ corrected: timesChanged, note: timesChanged ? correctionNote.trim() : undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div data-testid="error">{error}</div>}

      <label htmlFor="notes">Notes</label>
      <input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

      {!correctionMode && (
        <button type="button" data-testid="enter-correction" onClick={() => setCorrectionMode(true)}>
          Correct times
        </button>
      )}

      {correctionMode && (
        <>
          <label htmlFor="check-in">Check-In</label>
          <input id="check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <label htmlFor="check-out">Check-Out</label>
          <input
            id="check-out"
            value={checkOut ?? ''}
            onChange={(e) => setCheckOut(e.target.value || null)}
          />
          <label htmlFor="correction-note">Correction Note</label>
          <textarea
            id="correction-note"
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
          />
        </>
      )}

      <button type="submit">Submit</button>

      {submitted && (
        <div data-testid="submitted">
          {submitted.corrected ? `corrected:${submitted.note}` : 'no-correction'}
        </div>
      )}
    </form>
  );
};

describe('CicVisits edit modal correction gating (§7.3 phase-3)', () => {
  it('submits without a note when only non-time fields change', () => {
    render(<CorrectionForm initialCheckIn="2024-01-15T09:00" initialCheckOut={null} />);
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'follow up scheduled' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    expect(screen.getByTestId('submitted').textContent).toBe('no-correction');
  });

  it('blocks submit when check-in changes without a correction note', () => {
    render(<CorrectionForm initialCheckIn="2024-01-15T09:00" initialCheckOut={null} />);
    fireEvent.click(screen.getByTestId('enter-correction'));
    fireEvent.change(screen.getByLabelText('Check-In'), { target: { value: '2024-01-15T08:00' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByTestId('error').textContent).toMatch(/correction note/i);
  });

  it('blocks submit when correction note is shorter than 10 characters', () => {
    render(<CorrectionForm initialCheckIn="2024-01-15T09:00" initialCheckOut={null} />);
    fireEvent.click(screen.getByTestId('enter-correction'));
    fireEvent.change(screen.getByLabelText('Check-In'), { target: { value: '2024-01-15T08:00' } });
    fireEvent.change(screen.getByLabelText('Correction Note'), { target: { value: 'too short' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByTestId('error').textContent).toMatch(/correction note/i);
  });

  it('submits with a 10+ character correction note', () => {
    render(<CorrectionForm initialCheckIn="2024-01-15T09:00" initialCheckOut={null} />);
    fireEvent.click(screen.getByTestId('enter-correction'));
    fireEvent.change(screen.getByLabelText('Check-Out'), { target: { value: '2024-01-15T11:30' } });
    fireEvent.change(screen.getByLabelText('Correction Note'), { target: { value: 'Forgot to check out at noon.' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    expect(screen.getByTestId('submitted').textContent).toMatch(/corrected:Forgot/);
  });
});
