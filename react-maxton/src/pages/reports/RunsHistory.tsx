import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { WidgetShell, WidgetState } from '../../components/dashboard/WidgetShell';
import { useAppSelector } from '../../store/hooks';
import { buildApiUrl, getAuthHeaders } from '../../config/api';

interface ReportRun {
  id: string;
  definition_id: string;
  fired_at: string;
  delivered_at: string | null;
  delivery_error: string | null;
  artifact_key: string | null;
  artifact_url_expires_at: string | null;
  recipient_snapshot: unknown;
  created_at: string;
}

interface ReportDefinition {
  id: string;
  name: string;
}

const PAGE_SIZE = 25;

const parseRecipients = (v: unknown): unknown[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { const parsed = JSON.parse(v); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
};

const RunsHistory: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const token = useAppSelector((s: any) => s.auth?.token);
  const [state, setState] = useState<WidgetState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [def, setDef] = useState<ReportDefinition | null>(null);
  const [runs, setRuns] = useState<ReportRun[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const now = Date.now();

  const fetchAll = useCallback(async (nextOffset: number) => {
    setState('loading');
    try {
      const [defRes, runsRes] = await Promise.all([
        fetch(buildApiUrl(`/api/v1/reports/schedules/${id}`), { headers: getAuthHeaders(token) }),
        fetch(buildApiUrl(`/api/v1/reports/schedules/${id}/runs?limit=${PAGE_SIZE}&offset=${nextOffset}`),
          { headers: getAuthHeaders(token) }),
      ]);
      if (!defRes.ok) throw new Error(`Definition HTTP ${defRes.status}`);
      if (!runsRes.ok) throw new Error(`Runs HTTP ${runsRes.status}`);
      const defJson = await defRes.json();
      const runsJson = await runsRes.json();
      setDef((defJson?.data ?? null) as ReportDefinition | null);
      const rs = (runsJson?.data ?? []) as ReportRun[];
      setRuns(rs);
      setHasMore(rs.length === PAGE_SIZE);
      setState(rs.length === 0 ? 'empty' : 'ok');
    } catch (e: any) {
      setErrorMessage(String(e?.message ?? e));
      setState('error');
    }
  }, [id, token]);

  useEffect(() => { fetchAll(offset); }, [fetchAll, offset]);

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="text-muted small">
            <Link to="/reports/schedules">&larr; Scheduled reports</Link>
          </div>
          <h4 className="mb-0">Runs — {def?.name ?? '…'}</h4>
        </div>
      </div>
      <Card className="rounded-4">
        <Card.Body>
          <WidgetShell state={state} emptyMessage="No runs." errorMessage={errorMessage} onRetry={() => fetchAll(offset)}>
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Fired at</th>
                  <th>Delivered at</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Artifact</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => {
                  const rs = parseRecipients(r.recipient_snapshot);
                  const expiredAt = r.artifact_url_expires_at ? Date.parse(r.artifact_url_expires_at) : 0;
                  const expired = expiredAt && expiredAt < now;
                  const delivered = !!r.delivered_at && !r.delivery_error;
                  return (
                    <tr key={r.id}>
                      <td>{new Date(r.fired_at).toLocaleString()}</td>
                      <td>{r.delivered_at ? new Date(r.delivered_at).toLocaleString() : '—'}</td>
                      <td>
                        {delivered
                          ? <span className="text-success">Delivered</span>
                          : <span className="text-danger" title={r.delivery_error ?? undefined}>Failed</span>}
                      </td>
                      <td>
                        <span title={JSON.stringify(rs, null, 2)}>{rs.length}</span>
                      </td>
                      <td>
                        {r.artifact_key
                          ? (expired
                              ? <span className="text-muted">Download expired</span>
                              : <span>{r.artifact_key}</span>)
                          : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </WidgetShell>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
              Showing {runs.length ? offset + 1 : 0}–{offset + runs.length}
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >Previous</Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={!hasMore}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >Next</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </MainLayout>
  );
};

export default RunsHistory;
