import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setProgramme, setOrganisation, setDistrict, setPeriod, resetFilters,
} from "../store/slices/globalFiltersSlice";
import { PeriodValue, PeriodSlug, PERIOD_LABELS } from "../types/period";

function activeCount(g: {
  programme: string; organisation: string; district: string; period: PeriodValue;
}): number {
  let n = 0;
  if (g.period !== "today") n++;
  if (!/^all\b/i.test(g.programme)) n++;
  if (!/^all\b/i.test(g.organisation)) n++;
  if (!/^all\b/i.test(g.district)) n++;
  return n;
}

const FiltersButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const g = useAppSelector((s) => s.globalFilters);
  const [show, setShow] = useState(false);
  const [slugOrCustom, setSlugOrCustom] = useState<PeriodSlug | 'custom'>('today');
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const count = activeCount(g);
  const isCustom = slugOrCustom === 'custom';

  // Compute validity
  let invalidReason: string | null = null;
  if (isCustom) {
    if (!start || !end) {
      invalidReason = "Pick both start and end dates.";
    } else if (end < start) {
      invalidReason = "End must be on or after start.";
    } else if ((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) > 366) {
      invalidReason = "Range must be 366 days or less.";
    }
  }

  const handleDone = () => {
    if (isCustom) {
      if (start && end) {
        dispatch(setPeriod({ start: start.getTime(), end: end.getTime() }));
      }
    } else {
      dispatch(setPeriod(slugOrCustom as PeriodSlug));
    }
    setShow(false);
  };

  return (
    <>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setShow(true)}
        aria-label="Filters"
        className="d-inline-flex align-items-center gap-1">
        <i className="material-icons-outlined" style={{ fontSize: 16 }}>filter_list</i>
        <span>Filters</span>
        {count > 0 && (
          <span className="badge bg-primary rounded-pill ms-1">{count}</span>
        )}
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="period-select">Period</Form.Label>
            <Form.Select
              id="period-select"
              value={slugOrCustom}
              onChange={(e) => setSlugOrCustom(e.target.value as PeriodSlug | 'custom')}>
              {Object.entries(PERIOD_LABELS).map(([slug, label]) => (
                <option key={slug} value={slug}>{label}</option>
              ))}
              <option value="custom">Custom range…</option>
            </Form.Select>
          </Form.Group>

          {isCustom && (
            <div data-testid="custom-range-picker" className="mb-3">
              <div className="d-flex gap-2">
                <DatePicker selected={start} onChange={setStart} selectsStart startDate={start} endDate={end}
                            className="form-control" placeholderText="Start date" />
                <DatePicker selected={end}   onChange={setEnd}   selectsEnd   startDate={start} endDate={end}
                            minDate={start ?? undefined}
                            className="form-control" placeholderText="End date" />
              </div>
              {invalidReason && <Form.Text className="text-danger">{invalidReason}</Form.Text>}
            </div>
          )}

          <Form.Group controlId="gfb-programme" className="mb-3">
            <Form.Label>Programme</Form.Label>
            <Form.Select
              value={g.programme}
              onChange={(e) => dispatch(setProgramme(e.target.value))}>
              {g.availableProgrammes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="gfb-organisation" className="mb-3">
            <Form.Label>Organisation</Form.Label>
            <Form.Select
              value={g.organisation}
              onChange={(e) => dispatch(setOrganisation(e.target.value))}>
              {g.availableOrganisations.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="gfb-district" className="mb-0">
            <Form.Label>District</Form.Label>
            <Form.Select
              value={g.district}
              onChange={(e) => dispatch(setDistrict(e.target.value))}>
              {g.availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="text-decoration-none me-auto"
            onClick={() => dispatch(resetFilters())}>
            Clear all
          </Button>
          <Button variant="primary" onClick={handleDone} disabled={isCustom && invalidReason !== null}>Done</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FiltersButton;
