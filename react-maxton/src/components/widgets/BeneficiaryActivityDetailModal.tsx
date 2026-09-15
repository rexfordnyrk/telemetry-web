import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { useAppSelector } from '../../store/hooks';
import { serializeForApi } from '../../types/period';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import { WidgetShell, WidgetState } from '../dashboard/WidgetShell';
import { renderLastSynced, renderMostUsedApp } from './beneficiaryActivityHelpers';

export interface BeneficiaryActivityDetailModalProps {
  show: boolean;
  onHide: () => void;
}

interface Row {
  name: string;
  most_used_app: { name: string; package: string } | null;
  last_synced_at: string | null;
}

const BeneficiaryActivityDetailModal: React.FC<BeneficiaryActivityDetailModalProps> = ({ show, onHide }) => {
  const g = useAppSelector((s: any) => s.globalFilters);
  const token = useAppSelector((s: any) => s.auth?.token);
  const [state, setState] = useState<WidgetState>('loading');
  const [rows, setRows] = useState<Row[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setState('loading');
    try {
      const url = buildApiUrl('/api/v1/analytics/dashboard/overview');
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('full', '1');
      urlWithParams.searchParams.append('period', serializeForApi(g.period));
      urlWithParams.searchParams.append('programme', g.programme);
      urlWithParams.searchParams.append('organisation', g.organisation);
      urlWithParams.searchParams.append('district', g.district);

      const res = await fetch(urlWithParams.toString(), {
        headers: getAuthHeaders(token),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rs: Row[] = json?.data?.widgets?.beneficiary_activity_rows ?? [];
      setRows(rs);
      setState(rs.length === 0 ? 'empty' : 'ok');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load');
      setState('error');
    }
  }, [g, token]);

  useEffect(() => {
    if (show) { fetchData(); }
  }, [show, fetchData]);

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>Beneficiary Activity — full details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WidgetShell
          state={state}
          emptyMessage="No beneficiary activity in this period."
          errorMessage={errorMessage}
          onRetry={fetchData}
        >
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Most Used App</th>
                  <th>Last Synced</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.name}-${i}`} className="py-2">
                    <td>{r.name}</td>
                    <td>{renderMostUsedApp(r.most_used_app)}</td>
                    <td>{renderLastSynced(r.last_synced_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </WidgetShell>
      </Modal.Body>
    </Modal>
  );
};

export default BeneficiaryActivityDetailModal;
