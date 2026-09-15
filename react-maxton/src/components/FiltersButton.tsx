import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setProgramme, setOrganisation, setDistrict, setPeriod, resetFilters,
} from "../store/slices/globalFiltersSlice";

const PERIOD_OPTIONS = ["Today", "Yesterday", "Last 7 Days", "This Month", "This Year"];

function activeCount(g: {
  programme: string; organisation: string; district: string; period: string;
}): number {
  let n = 0;
  if (g.period !== "Today") n++;
  if (!/^all\b/i.test(g.programme)) n++;
  if (!/^all\b/i.test(g.organisation)) n++;
  if (!/^all\b/i.test(g.district)) n++;
  return n;
}

const FiltersButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const g = useAppSelector((s) => s.globalFilters);
  const [show, setShow] = useState(false);
  const count = activeCount(g);

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
          <Form.Group controlId="gfb-period" className="mb-3">
            <Form.Label>Period</Form.Label>
            <Form.Select
              value={g.period}
              onChange={(e) => dispatch(setPeriod(e.target.value))}>
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          </Form.Group>

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
          <Button variant="primary" onClick={() => setShow(false)}>Done</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FiltersButton;
