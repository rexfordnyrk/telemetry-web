import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setProgramme, setOrganisation, setDistrict, setPeriod, resetFilters,
} from "../store/slices/globalFiltersSlice";

const PERIOD_OPTIONS = ["Today", "Yesterday", "Last 7 Days", "This Month", "This Year"];

const GlobalFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const g = useAppSelector((s) => s.globalFilters);

  return (
    <div className="global-filter-bar border-bottom bg-body-tertiary py-2">
      <Row className="g-2 align-items-end px-3">
        <Col md={3}>
          <Form.Label htmlFor="gfb-period">Period</Form.Label>
          <Form.Select id="gfb-period" value={g.period}
            onChange={(e) => dispatch(setPeriod(e.target.value))}>
            {PERIOD_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="gfb-programme">Programme</Form.Label>
          <Form.Select id="gfb-programme" value={g.programme}
            onChange={(e) => dispatch(setProgramme(e.target.value))}>
            {g.availableProgrammes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="gfb-organisation">Organisation</Form.Label>
          <Form.Select id="gfb-organisation" value={g.organisation}
            onChange={(e) => dispatch(setOrganisation(e.target.value))}>
            {g.availableOrganisations.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="gfb-district">District</Form.Label>
          <Form.Select id="gfb-district" value={g.district}
            onChange={(e) => dispatch(setDistrict(e.target.value))}>
            {g.availableDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={12} className="text-end mt-2">
          <Button size="sm" variant="outline-secondary"
            onClick={() => dispatch(resetFilters())}>Clear</Button>
        </Col>
      </Row>
    </div>
  );
};

export default GlobalFilterBar;
