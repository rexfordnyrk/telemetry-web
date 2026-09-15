import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import CadenceEditor, { Cadence } from '../../components/reports/CadenceEditor';
import RecipientInput, { Recipient, RecipientUser } from '../../components/reports/RecipientInput';
import { PeriodValue, serializeForApi, PERIOD_LABELS } from '../../types/period';
import { useAppSelector } from '../../store/hooks';
import { buildApiUrl, getAuthHeaders } from '../../config/api';

const REPORT_TYPES = [
  { value: 'beneficiary_activity', label: 'Beneficiary activity' },
  { value: 'connectivity',         label: 'Connectivity' },
  { value: 'programme_breakdown',  label: 'Programme breakdown' },
  { value: 'summary',              label: 'Summary' },
];

const FORMATS = [
  { value: 'csv',  label: 'CSV' },
  { value: 'xlsx', label: 'XLSX (Excel)' },
  // PDF intentionally deferred (§7.7 phase-3 part-2 ruling).
];

const COLUMNS_BY_TYPE: Record<string, string[]> = {
  beneficiary_activity: ['name', 'most_used_app', 'last_synced', 'sessions', 'data_usage'],
  connectivity: ['device_mac', 'beneficiary_name', 'programme', 'organisation', 'district',
                 'rx_bytes', 'tx_bytes', 'sync_count', 'failed_sync_count', 'last_sync_at'],
  programme_breakdown: ['programme', 'beneficiaries', 'active_devices', 'data_usage', 'sync_rate'],
  summary: ['metric', 'value'],
};

export interface ReportDefinitionInput {
  name: string;
  report_type: string;
  filters: { period: string; programme: string; organisation: string; district: string };
  columns: string[];
  format: string;
  cadence: Cadence;
  recipients: Recipient[];
  is_enabled: boolean;
}

export interface ExistingDefinition extends ReportDefinitionInput {
  id: string;
}

export interface ScheduleReportModalProps {
  show: boolean;
  onHide: () => void;
  initial?: ExistingDefinition;   // when editing
  onSaved: (def: ExistingDefinition) => void;
}

const DEFAULT_CADENCE: Cadence = { kind: 'daily', time: '09:00', timezone: 'UTC' };
const DEFAULT_FILTERS = { period: 'week', programme: 'All', organisation: 'All', district: 'All' };

const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({ show, onHide, initial, onSaved }) => {
  const token = useAppSelector((s: any) => s.auth?.token);
  const [name, setName] = useState('');
  const [reportType, setReportType] = useState('beneficiary_activity');
  const [format, setFormat] = useState('csv');
  const [cadence, setCadence] = useState<Cadence>(DEFAULT_CADENCE);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [users, setUsers] = useState<RecipientUser[]>([]);
  const [period, setPeriod] = useState<string>('week'); // stored as slug or as serialized custom range
  const [programme, setProgramme] = useState('All');
  const [organisation, setOrganisation] = useState('All');
  const [district, setDistrict] = useState('All');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Hydrate on open / initial change.
  useEffect(() => {
    if (!show) return;
    if (initial) {
      setName(initial.name);
      setReportType(initial.report_type);
      setFormat(initial.format === 'pdf' ? 'csv' : initial.format);
      setCadence(initial.cadence);
      setRecipients(initial.recipients);
      setPeriod(initial.filters.period);
      setProgramme(initial.filters.programme);
      setOrganisation(initial.filters.organisation);
      setDistrict(initial.filters.district);
      setSelectedColumns(initial.columns);
      setEnabled(initial.is_enabled);
    } else {
      setName('');
      setReportType('beneficiary_activity');
      setFormat('csv');
      setCadence(DEFAULT_CADENCE);
      setRecipients([]);
      setPeriod('week');
      setProgramme('All');
      setOrganisation('All');
      setDistrict('All');
      setSelectedColumns(COLUMNS_BY_TYPE['beneficiary_activity'] ?? []);
      setEnabled(true);
    }
    setServerError(null);
    setFieldError(null);
  }, [show, initial]);

  // Fetch users (for RecipientInput) once when modal opens.
  useEffect(() => {
    if (!show) return;
    fetch(buildApiUrl('/api/v1/users'), { headers: getAuthHeaders(token) })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Users HTTP ${r.status}`)))
      .then((json) => {
        const items = (json?.data ?? json?.users ?? []) as any[];
        setUsers(items.map((u) => ({
          id: String(u.id),
          name: (u.first_name && u.last_name) ? `${u.first_name} ${u.last_name}` : (u.name ?? u.email ?? String(u.id)),
          email: u.email ?? '',
        })));
      })
      .catch(() => setUsers([]));
  }, [show, token]);

  // When reportType changes and no columns are picked yet, seed with defaults.
  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedColumns(COLUMNS_BY_TYPE[reportType] ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  const availableColumns = COLUMNS_BY_TYPE[reportType] ?? [];
  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) => prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]);
  };

  const buildPayload = (): ReportDefinitionInput => ({
    name: name.trim(),
    report_type: reportType,
    filters: { period, programme, organisation, district },
    columns: selectedColumns,
    format,
    cadence,
    recipients,
    is_enabled: enabled,
  });

  const submit = async () => {
    setServerError(null);
    setFieldError(null);
    if (!name.trim()) { setFieldError('Name is required'); return; }
    if (recipients.length === 0) { setFieldError('Add at least one recipient'); return; }
    const payload = buildPayload();
    setSaving(true);
    try {
      const url = initial
        ? buildApiUrl(`/api/v1/reports/schedules/${initial.id}`)
        : buildApiUrl('/api/v1/reports/schedules');
      const res = await fetch(url, {
        method: initial ? 'PUT' : 'POST',
        headers: { ...getAuthHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.error ?? `Save failed (HTTP ${res.status})`);
        setSaving(false);
        return;
      }
      const json = await res.json();
      onSaved((json?.data ?? {}) as ExistingDefinition);
      onHide();
    } catch (e: any) {
      setServerError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit scheduled report' : 'New scheduled report'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(serverError || fieldError) && (
          <Alert variant="danger">{serverError ?? fieldError}</Alert>
        )}
        <h6 className="text-muted text-uppercase small mt-1">Basics</h6>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} aria-label="Report name" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={reportType} onChange={(e) => { setReportType(e.target.value); setSelectedColumns([]); }} aria-label="Report type">
                {REPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Format</Form.Label>
              <Form.Select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Report format">
                {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <h6 className="text-muted text-uppercase small mt-4">Filters</h6>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Period</Form.Label>
              <Form.Select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Filter period">
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Programme</Form.Label>
              <Form.Control value={programme} onChange={(e) => setProgramme(e.target.value)} aria-label="Programme" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Organisation</Form.Label>
              <Form.Control value={organisation} onChange={(e) => setOrganisation(e.target.value)} aria-label="Organisation" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>District</Form.Label>
              <Form.Control value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District" />
            </Form.Group>
          </Col>
        </Row>

        <h6 className="text-muted text-uppercase small mt-4">Columns</h6>
        <div className="d-flex flex-wrap gap-3">
          {availableColumns.map((col) => (
            <Form.Check
              key={col}
              type="checkbox"
              id={`col-${col}`}
              label={col}
              checked={selectedColumns.includes(col)}
              onChange={() => toggleColumn(col)}
              aria-label={`Column ${col}`}
            />
          ))}
        </div>

        <h6 className="text-muted text-uppercase small mt-4">Cadence</h6>
        <CadenceEditor value={cadence} onChange={setCadence} />

        <h6 className="text-muted text-uppercase small mt-4">Recipients</h6>
        <RecipientInput value={recipients} onChange={setRecipients} users={users} />

        <Form.Check
          className="mt-4"
          type="switch"
          id="report-enabled"
          label="Enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={saving}>
          {saving && <Spinner as="span" size="sm" animation="border" role="status" className="me-2" />}
          {initial ? 'Save changes' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleReportModal;
