import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Table, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { Beneficiary } from "../store/slices/beneficiarySlice";
import { addBeneficiaries } from "../store/slices/beneficiarySlice";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../config/api";
import { fetchBeneficiaries } from "../store/slices/beneficiarySlice";

interface ImportBeneficiariesModalProps {
  show: boolean;
  onHide: () => void;
  filters: { [key: string]: any };
}

type ParsedRow = Record<string, string>;

type ImportSource = "csv" | "pms";

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

const ImportBeneficiariesModal: React.FC<ImportBeneficiariesModalProps> = ({ show, onHide, filters }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [importSource, setImportSource] = useState<ImportSource>("csv");
  const [isImporting, setIsImporting] = useState(false);
  const [pageSize, setPageSize] = useState(200);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<any>(null);
  const [showProgress, setShowProgress] = useState(false);
  const pollRef = useRef<number | null>(null);

  // PMS lookups and filter state
  interface LookupItem { id: string; name: string; }
  const [districts, setDistricts] = useState<LookupItem[]>([]);
  const [interventions, setInterventions] = useState<LookupItem[]>([]);
  const [partners, setPartners] = useState<LookupItem[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [districtID, setDistrictID] = useState("");
  const [interventionID, setInterventionID] = useState("");
  const [partnerID, setPartnerID] = useState("");

  const [updatedAfter, setUpdatedAfter] = useState("");
  const [createdAfter, setCreatedAfter] = useState("");
  const [updatedBetweenStart, setUpdatedBetweenStart] = useState("");
  const [updatedBetweenEnd, setUpdatedBetweenEnd] = useState("");
  const [createdBetweenStart, setCreatedBetweenStart] = useState("");
  const [createdBetweenEnd, setCreatedBetweenEnd] = useState("");

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
        if (h === "organisation") return "organization";
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

  const importFromCSV = useCallback(() => {
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

    resetStateAndClose();
  }, [dispatch, parsedRows, fileName]);

  const importFromPMS = useCallback(async () => {
    if (!token) {
      setError("You are not authenticated.");
      return;
    }
    setIsImporting(true);
    setError(null);
    try {
      // Validate ranges if partially filled
      if ((updatedBetweenStart && !updatedBetweenEnd) || (!updatedBetweenStart && updatedBetweenEnd)) {
        throw new Error("Please provide both start and end dates for Updated Between.");
      }
      if ((createdBetweenStart && !createdBetweenEnd) || (!createdBetweenStart && createdBetweenEnd)) {
        throw new Error("Please provide both start and end dates for Created Between.");
      }

      const pmsFilters: any = {};
      if (districtID) pmsFilters.districtID = districtID;
      if (interventionID) pmsFilters.interventionID = interventionID;
      if (partnerID) pmsFilters.partnerID = partnerID;
      if (updatedAfter) pmsFilters.updatedAfter = updatedAfter;
      if (createdAfter) pmsFilters.createdAfter = createdAfter;
      if (updatedBetweenStart && updatedBetweenEnd) pmsFilters.updatedBetween = { from: updatedBetweenStart, to: updatedBetweenEnd };
      if (createdBetweenStart && createdBetweenEnd) pmsFilters.createdBetween = { from: createdBetweenStart, to: createdBetweenEnd };

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.BENEFICIARIES.PMS_IMPORT);
      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ filters: pmsFilters }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to import from PMS");
      }
      const data = await response.json();
      const imported = data?.data?.beneficiaries || data?.beneficiaries || [];
      const importedCount = data?.data?.imported_count || data?.imported_count || imported.length || 0;

      if (Array.isArray(imported) && imported.length > 0) {
        dispatch(addBeneficiaries(imported));
      } else {
        await dispatch(fetchBeneficiaries({}));
      }

      dispatch(addAlert({
        type: "success",
        title: "PMS Import Complete",
        message: `${importedCount} beneficiaries imported from PMS using selected filters.`,
      }));
      resetStateAndClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import from PMS");
    } finally {
      setIsImporting(false);
    }
  }, [dispatch, token, districtID, interventionID, partnerID, updatedAfter, createdAfter, updatedBetweenStart, updatedBetweenEnd, createdBetweenStart, createdBetweenEnd]);

  const handleImport = useCallback(() => {
    if (importSource === "csv") {
      importFromCSV();
    } else {
      importFromPMS();
    }
  }, [importSource, importFromCSV, importFromPMS]);

  const resetStateAndClose = useCallback(() => {
    setFileName("");
    setParsedHeaders([]);
    setParsedRows([]);
    setError(null);
    setImportSource("csv");
    // Reset PMS filters
    setDistrictID("");
    setInterventionID("");
    setPartnerID("");
    setUpdatedAfter("");
    setCreatedAfter("");
    setUpdatedBetweenStart("");
    setUpdatedBetweenEnd("");
    setCreatedBetweenStart("");
    setCreatedBetweenEnd("");
    onHide();
  }, [onHide]);

  const previewRows = useMemo(() => parsedRows.slice(0, 5), [parsedRows]);

  // Load lookups when switching to PMS
  useEffect(() => {
    if (!show || importSource !== 'pms') return;
    if (!token) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLookupLoading(true);
        setLookupError(null);
        const [dRes, iRes, pRes] = await Promise.all([
          fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOOKUPS.DISTRICTS), { headers: getAuthHeaders(token) }),
          fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOOKUPS.INTERVENTIONS), { headers: getAuthHeaders(token) }),
          fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOOKUPS.PARTNERS), { headers: getAuthHeaders(token) }),
        ]);
        if (!dRes.ok || !iRes.ok || !pRes.ok) {
          throw new Error('Failed to load lookup lists');
        }
        const [dData, iData, pData] = await Promise.all([dRes.json(), iRes.json(), pRes.json()]);
        if (cancelled) return;
        const mapItems = (raw: any): LookupItem[] => {
          const arr = raw?.data || raw || [];
          return Array.isArray(arr) ? arr.map((x: any) => ({ id: String(x.id), name: x.name || x.title || x.label || String(x.id) })) : [];
        };
        setDistricts(mapItems(dData));
        setInterventions(mapItems(iData));
        setPartners(mapItems(pData));
      } catch (e) {
        if (!cancelled) setLookupError(e instanceof Error ? e.message : 'Lookup load failed');
      } finally {
        if (!cancelled) setLookupLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [show, importSource, token]);

  return (
    <Modal
      show={show}
      onHide={resetStateAndClose}
      size="lg"
      centered
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <Modal.Header closeButton className="border-top border-3 border-info" style={{ borderRadius: 0 }}>
        <Modal.Title>
          <i className="bx bx-file-import me-2"></i>
          Import Beneficiaries
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="importSource" id="importCSV" value="csv" checked={importSource === "csv"} onChange={() => setImportSource("csv")} />
            <label className="form-check-label" htmlFor="importCSV">CSV</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="importSource" id="importPMS" value="pms" checked={importSource === "pms"} onChange={() => setImportSource("pms")} />
            <label className="form-check-label" htmlFor="importPMS">PMS</label>
          </div>
        </div>

        {importSource === "csv" ? (
          <>
            <Form.Group controlId="importFile">
              <Form.Label>Choose CSV File</Form.Label>
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
                      {parsedRows.slice(0, 5).map((r, idx) => (
                        <tr key={idx}>
                          {parsedHeaders.map((h) => (
                            <td key={h}>{r[h] || ""}</td>
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
          </>
        ) : (
          <>
            {lookupError && (
              <Alert variant="danger" className="mb-3">{lookupError}</Alert>
            )}
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>District</Form.Label>
                  <Form.Select value={districtID} onChange={(e) => setDistrictID(e.target.value)} disabled={lookupLoading}>
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Intervention</Form.Label>
                  <Form.Select value={interventionID} onChange={(e) => setInterventionID(e.target.value)} disabled={lookupLoading}>
                    <option value="">Select Intervention</option>
                    {interventions.map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Select value={partnerID} onChange={(e) => setPartnerID(e.target.value)} disabled={lookupLoading}>
                    <option value="">Select Partner</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Updated After</Form.Label>
                  <Form.Control type="date" value={updatedAfter} onChange={(e) => setUpdatedAfter(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Created After</Form.Label>
                  <Form.Control type="date" value={createdAfter} onChange={(e) => setCreatedAfter(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Updated Between (From)</Form.Label>
                  <Form.Control type="date" value={updatedBetweenStart} onChange={(e) => setUpdatedBetweenStart(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Updated Between (To)</Form.Label>
                  <Form.Control type="date" value={updatedBetweenEnd} onChange={(e) => setUpdatedBetweenEnd(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Created Between (From)</Form.Label>
                  <Form.Control type="date" value={createdBetweenStart} onChange={(e) => setCreatedBetweenStart(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Created Between (To)</Form.Label>
                  <Form.Control type="date" value={createdBetweenEnd} onChange={(e) => setCreatedBetweenEnd(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <button type="button" className="btn btn-light" onClick={resetStateAndClose} disabled={isImporting}>
          <i className="bx bx-x me-2"></i>
          Cancel
        </button>
        <div>
          <button
            type="button"
            className={`btn ${importSource === "csv" ? "btn-grd-info" : "btn-grd-primary"}`}
            onClick={handleImport}
            disabled={importSource === "csv" ? parsedRows.length === 0 : isImporting}
          >
            <i className="material-icons-outlined me-1">file_upload</i>
            {importSource === "csv" ? "Import" : (isImporting ? "Importing..." : "Import from PMS")}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportBeneficiariesModal;
