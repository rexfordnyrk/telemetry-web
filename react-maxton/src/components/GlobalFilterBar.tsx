import React from "react";
import { Form, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setProgramme, setOrganisation, setDistrict, setPeriod, resetFilters,
} from "../store/slices/globalFiltersSlice";

const PERIOD_OPTIONS = ["Today", "Yesterday", "Last 7 Days", "This Month", "This Year"];

const GlobalFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const g = useAppSelector((s) => s.globalFilters);

  return (
    <div className="global-filter-bar d-flex flex-wrap align-items-center gap-2 px-3 py-2 mb-2">
      <span className="text-uppercase small text-secondary me-1">Filters:</span>

      <Form.Group controlId="gfb-period" className="d-flex align-items-center gap-1">
        <Form.Label className="mb-0 small text-secondary">Period</Form.Label>
        <Form.Select
          size="sm"
          value={g.period}
          onChange={(e) => dispatch(setPeriod(e.target.value))}
          style={{ width: "auto", minWidth: 130 }}
          aria-label="Period">
          {PERIOD_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="gfb-programme" className="d-flex align-items-center gap-1">
        <Form.Label className="mb-0 small text-secondary">Programme</Form.Label>
        <Form.Select
          size="sm"
          value={g.programme}
          onChange={(e) => dispatch(setProgramme(e.target.value))}
          style={{ width: "auto", minWidth: 160 }}
          aria-label="Programme">
          {g.availableProgrammes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="gfb-organisation" className="d-flex align-items-center gap-1">
        <Form.Label className="mb-0 small text-secondary">Organisation</Form.Label>
        <Form.Select
          size="sm"
          value={g.organisation}
          onChange={(e) => dispatch(setOrganisation(e.target.value))}
          style={{ width: "auto", minWidth: 160 }}
          aria-label="Organisation">
          {g.availableOrganisations.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="gfb-district" className="d-flex align-items-center gap-1">
        <Form.Label className="mb-0 small text-secondary">District</Form.Label>
        <Form.Select
          size="sm"
          value={g.district}
          onChange={(e) => dispatch(setDistrict(e.target.value))}
          style={{ width: "auto", minWidth: 140 }}
          aria-label="District">
          {g.availableDistricts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button
        size="sm"
        variant="link"
        className="text-decoration-none ms-auto py-0"
        onClick={() => dispatch(resetFilters())}>
        Clear
      </Button>
    </div>
  );
};

export default GlobalFilterBar;
