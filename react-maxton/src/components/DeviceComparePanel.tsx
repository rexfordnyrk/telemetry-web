import React from "react";
import { Modal, Table, Spinner, Alert } from "react-bootstrap";
import { DeviceCompareRow } from "../utils/deviceCompare";

interface Props {
  show: boolean;
  onHide: () => void;
  rows: DeviceCompareRow[];
  loading: boolean;
}

const METRICS: Array<{ key: keyof DeviceCompareRow; label: string }> = [
  { key: "lastSynced", label: "Last synced" },
  { key: "status", label: "Status" },
  { key: "screenTime7d", label: "Screen time (7d)" },
  { key: "topApp", label: "Top app" },
  { key: "dataUsage7d", label: "Data usage (7d)" },
];

/**
 * Side-by-side comparison of 2–3 devices (DEF-042, REQ-DEV-007).
 *
 * Keep the panel intentionally minimal: it surfaces existing
 * per-device telemetry signals (last sync, 7-day usage, top app)
 * for quick admin sense-checks without pulling in chart libraries
 * or designing a full analytics workspace.
 */
const DeviceComparePanel: React.FC<Props> = ({ show, onHide, rows, loading }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Compare Devices</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {!loading && rows.length === 0 && (
          <Alert variant="info">Select 2 or 3 devices to compare.</Alert>
        )}
        {!loading && rows.length > 0 && (
          <Table bordered responsive size="sm">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Metric</th>
                {rows.map((r) => (
                  <th key={r.deviceId}>{r.deviceName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(({ key, label }) => (
                <tr key={String(key)}>
                  <td className="text-muted">{label}</td>
                  {rows.map((r) => (
                    <td key={`${r.deviceId}-${String(key)}`}>
                      {r.error
                        ? <span className="text-danger">{r.error}</span>
                        : String(r[key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DeviceComparePanel;
