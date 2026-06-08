import React, { useCallback, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Table, Alert, Spinner } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { importVisitsCSV, ImportVisitsCSVRow } from "../store/slices/visitSlice";
import CsvImportReportModal from "./CsvImportReportModal";
import { escapeHtml } from "../utils/escapeHtml";
import type { CSVImportResult } from "../types/csvImport";

interface ImportVisitsModalProps {
  show: boolean;
  onHide: () => void;
  onImportSuccess?: () => void;
}

type ParsedRow = Record<string, string>;

const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const pushField = () => { current.push(field); field = ""; };
  const pushRow = () => { rows.push(current); current = []; };
  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += char; }
    } else {
      if (char === '"') { inQuotes = true; }
      else if (char === ',') { pushField(); }
      else if (char === '\n') { pushField(); pushRow(); }
      else if (char === '\r') { if (text[i + 1] === '\n') i++; pushField(); pushRow(); }
      else { field += char; }
    }
    i++;
  }
  if (field.length > 0 || current.length > 0) { pushField(); pushRow(); }
  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map(h => h.trim());
  const dataRows = rows.slice(1).filter(r => r.some(c => c && c.trim().length > 0));
  return { headers, rows: dataRows };
};

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

const isCSVFile = (file: File) => {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".csv")) return false;
  if (file.type && !["text/csv", "application/vnd.ms-excel", "application/csv", ""].includes(file.type)) {
    return false;
  }
  return true;
};

const ImportVisitsModal: React.FC<ImportVisitsModalProps> = ({ show, onHide, onImportSuccess }) => {
  const dispatch = useAppDispatch();
  const [fileName, setFileName] = useState("");
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reportResult, setReportResult] = useState<CSVImportResult | null>(null);
  const [showReport, setShowReport] = useState(false);

  const requiredKeys = useMemo(() => [
    "cic_name",
    "beneficiary_name",
    "activity_name",
    "check_in_at",
  ], []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isCSVFile(file)) {
      setError("Only .csv files are supported.");
      setFileName(file.name);
      setParsedHeaders([]);
      setParsedRows([]);
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      if (headers.length === 0) {
        setError("The selected file appears to be empty or invalid CSV.");
        setParsedHeaders([]);
        setParsedRows([]);
        return;
      }
      const normalizedHeaders = headers.map(normalizeKey).map((h) => {
        if (h === "cic" || h === "cicname" || h === "cic_center" || h === "ciccentre") return "cic_name";
        if (h === "cicid" || h === "cic_code" || h === "cic_uuid") return "cic_id";
        if (h === "name" || h === "beneficiary" || h === "beneficiaryname") return "beneficiary_name";
        if (h === "beneficiaryid" || h === "participant_id") return "beneficiary_id";
        if (h === "programme" || h === "program" || h === "intervention" || h === "intervention_name") return "intervention_name";
        if (h === "programme_id" || h === "program_id" || h === "interventionid" || h === "intervention_id") return "intervention_id";
        if (h === "activity" || h === "activityname") return "activity_name";
        if (h === "assistedby" || h === "assisted_by") return "assisted_by";
        if (h === "notes_follow_up" || h === "notesfollowup") return "notes";
        if (h === "checkin" || h === "check_in" || h === "check_in_time" || h === "checkinat") return "check_in_at";
        if (h === "checkout" || h === "check_out" || h === "check_out_time" || h === "checkoutat") return "check_out_at";
        if (h === "duration" || h === "durationmins" || h === "duration_min") return "duration_minutes";
        return h;
      });
      setParsedHeaders(normalizedHeaders);
      const rowsAsObjects: ParsedRow[] = rows.map((r) => {
        const obj: ParsedRow = {};
        for (let i = 0; i < normalizedHeaders.length; i++) {
          obj[normalizedHeaders[i]] = (r[i] ?? "").trim();
        }
        return obj;
      });
      for (const key of requiredKeys) {
        if (!normalizedHeaders.includes(key)) {
          setError(`Missing required column: ${key}`);
          setParsedRows([]);
          return;
        }
      }
      setParsedRows(rowsAsObjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
      setParsedHeaders([]);
      setParsedRows([]);
    }
  }, [requiredKeys]);

  const resetStateAndClose = useCallback(() => {
    setFileName("");
    setParsedHeaders([]);
    setParsedRows([]);
    setError(null);
    setSubmitting(false);
    onHide();
  }, [onHide]);

  const toInt = (v: string | undefined): number | null => {
    if (!v) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  const handleImport = useCallback(async () => {
    if (parsedRows.length === 0) {
      setError("No rows to import. Please select a valid CSV file.");
      return;
    }
    const apiRows: ImportVisitsCSVRow[] = parsedRows.map((row) => ({
      cic_name: row["cic_name"] || "",
      beneficiary_name: row["beneficiary_name"] || "",
      activity_name: row["activity_name"] || "",
      check_in_at: row["check_in_at"] || "",
      assisted_by: row["assisted_by"] || undefined,
      notes: row["notes"] || undefined,
      intervention_name: row["intervention_name"] || undefined,
      check_out_at: row["check_out_at"] || undefined,
      duration_minutes: toInt(row["duration_minutes"]) ?? undefined,
    }));

    setSubmitting(true);
    setError(null);
    try {
      const result = await dispatch(importVisitsCSV(apiRows)).unwrap();
      const summary = `${result.created} created, ${result.skipped} skipped, ${result.errors.length} errors.`;
      dispatch(addAlert({
        type: result.errors.length > 0 ? "warning" : "success",
        title: "CSV Import Complete",
        message: `${summary} (${fileName})`,
      }));
      setReportResult(result);
      setShowReport(true);
      if (result.created > 0 && onImportSuccess) {
        onImportSuccess();
      }
      // keep the import modal open behind the report; closing the report
      // resets state.
    } catch (err) {
      const message = err instanceof Error ? err.message : "CSV import failed";
      setError(message);
      dispatch(addAlert({ type: "danger", title: "CSV Import Failed", message }));
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, parsedRows, fileName, onImportSuccess]);

  const handleReportClose = useCallback(() => {
    setShowReport(false);
    setReportResult(null);
    resetStateAndClose();
  }, [resetStateAndClose]);

  return (
    <>
      <Modal show={show && !showReport} onHide={resetStateAndClose} size="lg" centered style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Modal.Header closeButton className="border-top border-3 border-info" style={{ borderRadius: 0 }}>
          <Modal.Title>
            <i className="bx bx-file-import me-2"></i>
            Import CIC Visits
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-3">{error}</Alert>
          )}
          <Form.Group controlId="importVisitsFile">
            <Form.Label>Choose CSV File</Form.Label>
            <Form.Control type="file" accept=".csv,text/csv" onChange={onFileChange} disabled={submitting} />
            <Form.Text muted>
              Required columns: cic_name, beneficiary_name, activity_name, check_in_at. Optional: assisted_by,
              intervention_name, notes, check_out_at, duration_minutes. Names are resolved against existing
              CICs, beneficiaries, and interventions in the database.
            </Form.Text>
          </Form.Group>
          {parsedRows.length > 0 && (
            <div className="mt-4">
              <Row className="mb-2">
                <Col>
                  <strong>File:</strong> {fileName}
                </Col>
                <Col className="text-end">
                  <strong>Detected rows:</strong> {parsedRows.length}
                </Col>
              </Row>
              <div className="table-responsive">
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      {parsedHeaders.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 5).map((r, idx) => (
                      <tr key={idx}>
                        {parsedHeaders.map((h) => (
                          <td
                            key={h}
                            dangerouslySetInnerHTML={{ __html: escapeHtml(r[h] || "") }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {parsedRows.length > 5 && (
                <div className="text-muted small">Showing first 5 of {parsedRows.length} rows</div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <button type="button" className="btn btn-light" onClick={resetStateAndClose} disabled={submitting}>
            <i className="bx bx-x me-2"></i>
            Cancel
          </button>
          <div>
            <button type="button" className="btn btn-grd-info" onClick={handleImport} disabled={parsedRows.length === 0 || submitting}>
              {submitting ? (
                <span className="d-inline-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" role="status" />
                  Importing...
                </span>
              ) : (
                <>
                  <i className="material-icons-outlined me-1">file_upload</i>
                  Import
                </>
              )}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <CsvImportReportModal
        show={showReport}
        result={reportResult}
        onClose={handleReportClose}
      />
    </>
  );
};

export default ImportVisitsModal;
