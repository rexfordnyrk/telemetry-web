import React, { useCallback, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Table, Alert } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { Beneficiary } from "../store/slices/beneficiarySlice";
import { addBeneficiaries } from "../store/slices/beneficiarySlice";

interface ImportBeneficiariesModalProps {
  show: boolean;
  onHide: () => void;
}

type ParsedRow = Record<string, string>;

// Robust CSV parser supporting quoted fields and commas inside quotes
const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const pushField = () => {
    current.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(current);
    current = [];
  };
  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        pushField();
      } else if (char === "\n") {
        pushField();
        pushRow();
      } else if (char === "\r") {
        // ignore CR, handle CRLF by consuming next LF if present
        if (text[i + 1] === "\n") {
          i++;
        }
        pushField();
        pushRow();
      } else {
        field += char;
      }
    }
    i++;
  }
  // push last field/row when file doesn't end with newline
  if (field.length > 0 || current.length > 0) {
    pushField();
    pushRow();
  }
  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map(h => h.trim());
  const dataRows = rows.slice(1).filter(r => r.some(c => c && c.trim().length > 0));
  return { headers, rows: dataRows };
};

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

const ImportBeneficiariesModal: React.FC<ImportBeneficiariesModalProps> = ({ show, onHide }) => {
  const dispatch = useAppDispatch();
  const [fileName, setFileName] = useState("");
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requiredKeys = useMemo(() => [
    "name",
    "email",
    "phone",
    "organization",
    "district",
    "programme",
  ], []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
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

      const normalizedHeaders = headers.map(normalizeKey).map(h => {
        if (h === "organisation") return "organization"; // support UK spelling
        if (h === "program" || h === "program_name") return "programme";
        if (h === "dateenrolled" || h === "date_of_enrollment") return "date_enrolled";
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

      // Basic validation: ensure required fields exist in headers
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

  const handleImport = useCallback(() => {
    if (parsedRows.length === 0) {
      setError("No rows to import. Please select a valid CSV file.");
      return;
    }

    const now = new Date().toISOString();
    const toBeneficiaries: Beneficiary[] = parsedRows.map((row) => {
      const dateEnrolled = row["date_enrolled"] || now;
      const isActive = (row["is_active"] || "true").toLowerCase() !== "false";
      return {
        id: crypto.randomUUID(),
        name: row["name"] || "",
        email: row["email"] || "",
        phone: row["phone"] || "",
        organization: row["organization"] || "",
        district: row["district"] || "",
        programme: row["programme"] || "",
        date_enrolled: dateEnrolled,
        is_active: isActive,
        current_device_id: null,
        current_device: null,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    });

    dispatch(addBeneficiaries(toBeneficiaries));
    dispatch(addAlert({
      type: "success",
      title: "Import Successful",
      message: `${toBeneficiaries.length} beneficiaries have been added from ${fileName}.`,
    }));

    setFileName("");
    setParsedHeaders([]);
    setParsedRows([]);
    setError(null);
    onHide();
  }, [dispatch, parsedRows, fileName, onHide]);

  const handleClose = useCallback(() => {
    setFileName("");
    setParsedHeaders([]);
    setParsedRows([]);
    setError(null);
    onHide();
  }, [onHide]);

  const previewRows = useMemo(() => parsedRows.slice(0, 5), [parsedRows]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <Modal.Header closeButton className="border-top border-3 border-info" style={{ borderRadius: 0 }}>
        <Modal.Title>
          <i className="bx bx-file-import me-2"></i>
          Import Beneficiaries (CSV)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form.Group controlId="importFile">
          <Form.Label>
            Choose CSV File
          </Form.Label>
          <Form.Control type="file" accept=".csv,text/csv" onChange={onFileChange} />
          <Form.Text muted>
            Expected columns: name, email, phone, organization, district, programme, optional: date_enrolled, is_active
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
                  {previewRows.map((r, idx) => (
                    <tr key={idx}>
                      {parsedHeaders.map((h) => (
                        <td key={h}>{r[h] || ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {parsedRows.length > previewRows.length && (
              <div className="text-muted small">Showing first {previewRows.length} of {parsedRows.length} rows</div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <button type="button" className="btn btn-light" onClick={handleClose}>
          <i className="bx bx-x me-2"></i>
          Cancel
        </button>
        <div>
          <button type="button" className="btn btn-grd-info me-2" onClick={handleImport} disabled={parsedRows.length === 0}>
            <i className="material-icons-outlined me-1">file_upload</i>
            Import
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportBeneficiariesModal;
