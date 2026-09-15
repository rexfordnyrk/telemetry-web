import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import MainLayout from '../../layouts/MainLayout';
import FiltersButton from '../../components/FiltersButton';
import { WidgetShell, WidgetState } from '../../components/dashboard/WidgetShell';
import { useAppSelector } from '../../store/hooks';
import { serializeForApi } from '../../types/period';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import { downloadCsv } from '../../utils/downloadCsv';
import { formatMB } from '../../utils/formatBytes';

interface ConnectivityRow {
  device_mac: string;
  programme: string;
  organisation: string;
  district: string;
  beneficiary_name: string;
  rx_bytes: number;
  tx_bytes: number;
  sync_count: number;
  failed_sync_count: number;
  last_sync_at: string | null;
}

const ConnectivityReport: React.FC = () => {
  const g = useAppSelector((s: any) => s.globalFilters);
  const token = useAppSelector((s: any) => s.auth?.token);
  const [state, setState] = useState<WidgetState>('loading');
  const [rows, setRows] = useState<ConnectivityRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set('period', serializeForApi(g.period));
    params.set('programme', g.programme);
    params.set('organisation', g.organisation);
    params.set('district', g.district);
    return params;
  }, [g]);

  const fetchData = useCallback(async () => {
    setState('loading');
    try {
      const params = buildParams();
      params.set('limit', '200');
      const url = buildApiUrl('/api/v1/analytics/connectivity') + '?' + params.toString();
      const res = await fetch(url, { headers: getAuthHeaders(token) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rs = (json?.data?.rows ?? []) as ConnectivityRow[];
      setRows(rs);
      setState(rs.length === 0 ? 'empty' : 'ok');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load');
      setState('error');
    }
  }, [buildParams, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = () => {
    downloadCsv('/api/v1/analytics/export/connectivity.csv', buildParams(), token);
  };

  return (
    <MainLayout>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Connectivity report</h4>
        <div className="d-flex gap-2">
          <FiltersButton />
          <Button variant="primary" onClick={handleExport} disabled={state === 'loading'}>Export CSV</Button>
        </div>
      </div>
      <Card className="rounded-4">
        <Card.Body>
          <WidgetShell
            state={state}
            emptyMessage="No connectivity data in this period."
            errorMessage={errorMessage}
            onRetry={fetchData}
          >
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 table-striped">
                <thead>
                  <tr>
                    <th>Device MAC</th>
                    <th>Programme</th>
                    <th>Organisation</th>
                    <th>District</th>
                    <th>Beneficiary</th>
                    <th className="text-end">Rx</th>
                    <th className="text-end">Tx</th>
                    <th className="text-end">Syncs</th>
                    <th className="text-end">Failed</th>
                    <th>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${r.device_mac}-${i}`}>
                      <td>{r.device_mac}</td>
                      <td>{r.programme}</td>
                      <td>{r.organisation}</td>
                      <td>{r.district}</td>
                      <td>{r.beneficiary_name}</td>
                      <td className="text-end">{formatMB(r.rx_bytes)}</td>
                      <td className="text-end">{formatMB(r.tx_bytes)}</td>
                      <td className="text-end">{r.sync_count.toLocaleString()}</td>
                      <td className="text-end">{r.failed_sync_count.toLocaleString()}</td>
                      <td>{r.last_sync_at ? new Date(r.last_sync_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </WidgetShell>
        </Card.Body>
      </Card>
    </MainLayout>
  );
};

export default ConnectivityReport;
