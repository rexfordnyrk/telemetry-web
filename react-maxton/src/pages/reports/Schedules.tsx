import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Form, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { WidgetShell, WidgetState } from '../../components/dashboard/WidgetShell';
import { useAppSelector } from '../../store/hooks';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import ScheduleReportModal, { ExistingDefinition } from './ScheduleReportModal';

export interface ReportDefinition {
  id: string;
  name: string;
  report_type: string;
  format: string;
  cadence: {
    kind: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
    weekday?: number;
    dayOfMonth?: number;
  };
  recipients: unknown[];
  is_enabled: boolean;
  next_run_at: string;
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatCadence = (c: ReportDefinition['cadence']): string => {
  if (c.kind === 'daily') return `Daily ${c.time} ${c.timezone}`;
  if (c.kind === 'weekly') return `Weekly ${WEEKDAY_SHORT[c.weekday ?? 1]} ${c.time} ${c.timezone}`;
  return `Monthly day ${c.dayOfMonth ?? 1} ${c.time} ${c.timezone}`;
};

const Schedules: React.FC = () => {
  const token = useAppSelector((s: any) => s.auth?.token);
  const [state, setState] = useState<WidgetState>('loading');
  const [rows, setRows] = useState<ReportDefinition[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<ReportDefinition | null>(null);
  const [modalDef, setModalDef] = useState<ExistingDefinition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDefs = useCallback(async () => {
    setState('loading');
    try {
      const url = buildApiUrl('/api/v1/reports/schedules');
      const res = await fetch(url, { headers: getAuthHeaders(token) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const defs = (json?.data ?? []) as ReportDefinition[];
      setRows(defs);
      setState(defs.length === 0 ? 'empty' : 'ok');
    } catch (e: any) {
      setErrorMessage(String(e?.message ?? e));
      setState('error');
    }
  }, [token]);

  useEffect(() => { fetchDefs(); }, [fetchDefs]);

  const toggleEnabled = async (def: ReportDefinition) => {
    // PUT expects a full ReportDefinitionInput; construct minimal payload from row.
    const url = buildApiUrl(`/api/v1/reports/schedules/${def.id}`);
    const body = {
      name: def.name,
      report_type: def.report_type,
      filters: {}, // server keeps whatever was there — but PUT replaces; skip precise field values for phase-3 part-3
      columns: [],
      format: def.format,
      cadence: def.cadence,
      recipients: def.recipients,
      is_enabled: !def.is_enabled,
    };
    // Because PUT replaces, refetch the full definition first to preserve fields.
    const getRes = await fetch(url, { headers: getAuthHeaders(token) });
    if (getRes.ok) {
      const full = (await getRes.json())?.data;
      if (full) {
        // Full row shape — reuse existing values, flip is_enabled.
        const payload = { ...full, is_enabled: !def.is_enabled };
        payload.filters = tryParse(full.filters);
        payload.columns = tryParse(full.columns);
        payload.cadence = tryParse(full.cadence);
        payload.recipients = tryParse(full.recipients);
        const putRes = await fetch(url, {
          method: 'PUT',
          headers: { ...getAuthHeaders(token), 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!putRes.ok) { window.alert(`Toggle failed: ${putRes.status}`); return; }
        fetchDefs();
        return;
      }
    }
    // fallback path — send the minimal body (server may reject)
    await fetch(url, {
      method: 'PUT',
      headers: { ...getAuthHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchDefs();
  };

  const runNow = async (def: ReportDefinition) => {
    const url = buildApiUrl(`/api/v1/reports/schedules/${def.id}/run`);
    const res = await fetch(url, { method: 'POST', headers: getAuthHeaders(token) });
    if (res.ok) {
      const json = await res.json();
      window.alert(`Run started. Download: ${json?.data?.artifact_url ?? '(no URL)'}`);
    } else {
      window.alert(`Run failed: ${res.status}`);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    const url = buildApiUrl(`/api/v1/reports/schedules/${confirmDelete.id}`);
    await fetch(url, { method: 'DELETE', headers: getAuthHeaders(token) });
    setConfirmDelete(null);
    fetchDefs();
  };

  const loadForEdit = async (def: ReportDefinition) => {
    try {
      const url = buildApiUrl(`/api/v1/reports/schedules/${def.id}`);
      const res = await fetch(url, { headers: getAuthHeaders(token) });
      if (!res.ok) {
        window.alert(`Failed to load definition: ${res.status}`);
        return;
      }
      const json = await res.json();
      const full = json?.data as any;
      if (full) {
        // Parse jsonb fields
        full.filters = tryParse(full.filters);
        full.columns = tryParse(full.columns);
        full.cadence = tryParse(full.cadence);
        full.recipients = tryParse(full.recipients);
        setModalDef(full as ExistingDefinition);
        setModalOpen(true);
      }
    } catch (e: any) {
      window.alert(`Error loading definition: ${e?.message ?? e}`);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Scheduled reports</h4>
        <Button variant="primary" onClick={() => { setModalDef(null); setModalOpen(true); }}>
          <i className="bx bx-plus"></i> New scheduled report
        </Button>
      </div>
      <Card className="rounded-4">
        <Card.Body>
          <WidgetShell state={state} emptyMessage="No scheduled reports" errorMessage={errorMessage} onRetry={fetchDefs}>
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Cadence</th>
                  <th>Next run</th>
                  <th className="text-center">Enabled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((def) => (
                  <tr key={def.id}>
                    <td>{def.name}</td>
                    <td>{def.report_type}</td>
                    <td className="text-uppercase">{def.format}</td>
                    <td>{formatCadence(def.cadence)}</td>
                    <td>{new Date(def.next_run_at).toLocaleString()}</td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        checked={def.is_enabled}
                        onChange={() => toggleEnabled(def)}
                        aria-label={`Toggle ${def.name}`}
                      />
                    </td>
                    <td className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline-primary" onClick={() => runNow(def)}>
                        <i className="bx bx-play"></i> Run now
                      </Button>
                      <Button size="sm" variant="outline-secondary" as={Link as any} to={`/reports/schedules/${def.id}/runs`}>
                        <i className="bx bx-history"></i> View runs
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => loadForEdit(def)}>
                        <i className="bx bx-edit"></i> Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => setConfirmDelete(def)}>
                        <i className="bx bx-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </WidgetShell>
        </Card.Body>
      </Card>

      <Modal show={!!confirmDelete} onHide={() => setConfirmDelete(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete scheduled report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{confirmDelete?.name}</strong>? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={doDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ScheduleReportModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        initial={modalDef ?? undefined}
        onSaved={() => fetchDefs()}
      />
    </MainLayout>
  );
};

// Server may return jsonb columns as either a JSON string or already-parsed object.
// tryParse handles both.
const tryParse = (v: any): any => {
  if (v == null) return v;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return v; } }
  return v;
};

export default Schedules;
