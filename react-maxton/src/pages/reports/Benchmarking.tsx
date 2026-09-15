import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import MainLayout from '../../layouts/MainLayout';
import FiltersButton from '../../components/FiltersButton';
import SafeApexChart from '../../components/SafeApexChart';
import { WidgetShell, WidgetState } from '../../components/dashboard/WidgetShell';
import { useAppSelector } from '../../store/hooks';
import { serializeForApi } from '../../types/period';
import { buildApiUrl, getAuthHeaders } from '../../config/api';

const METRIC_OPTIONS = [
  { value: 'avg_screen_time', label: 'Average screen time' },
  { value: 'data_usage',      label: 'Data usage' },
  { value: 'sync_count',      label: 'Sync count' },
  { value: 'failed_syncs',    label: 'Failed syncs' },
  { value: 'app_sessions',    label: 'App sessions' },
] as const;

interface Row { programme: string; value: number; all_programmes_avg: number }

const Benchmarking: React.FC = () => {
  const g = useAppSelector((s: any) => s.globalFilters);
  const token = useAppSelector((s: any) => s.auth?.token);
  const [metric, setMetric] = useState<string>('sync_count');
  const [state, setState] = useState<WidgetState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [rows, setRows] = useState<Row[]>([]);

  const fetchData = useCallback(async () => {
    setState('loading');
    try {
      const params = new URLSearchParams();
      params.set('metric', metric);
      params.set('period', serializeForApi(g.period));
      params.set('programme', g.programme);
      params.set('organisation', g.organisation);
      params.set('district', g.district);
      const url = buildApiUrl('/api/v1/analytics/benchmark') + '?' + params.toString();
      const res = await fetch(url, { headers: getAuthHeaders(token) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rs = (json?.data ?? []) as Row[];
      setRows(rs);
      setState(rs.length === 0 ? 'empty' : 'ok');
    } catch (e: any) {
      setErrorMessage(String(e?.message ?? e));
      setState('error');
    }
  }, [metric, g, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const avg = rows.length > 0 ? rows[0].all_programmes_avg : 0;

  const series = useMemo(() => (
    [{ name: labelFor(metric), data: rows.map((r) => r.value) }]
  ), [rows, metric]);

  const options = useMemo(() => ({
    chart: { type: 'bar', toolbar: { show: true }, animations: { enabled: false } },
    xaxis: { categories: rows.map((r) => r.programme) },
    plotOptions: { bar: { borderRadius: 4 } },
    dataLabels: { enabled: false },
    annotations: {
      yaxis: rows.length > 0 ? [{
        y: avg,
        borderColor: '#0d6efd',
        strokeDashArray: 4,
        label: {
          borderColor: '#0d6efd',
          style: { color: '#fff', background: '#0d6efd' },
          text: `Avg ${avg.toFixed(1)}`,
        },
      }] : [],
    },
  } as any), [rows, avg]);

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Programme benchmarking</h4>
        <FiltersButton />
      </div>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Metric</Form.Label>
            <Form.Select value={metric} onChange={(e) => setMetric(e.target.value)} aria-label="Metric">
              {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Card className="rounded-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Programmes</span>
          <span className="text-muted small">All-programmes avg = <strong>{avg.toFixed(1)}</strong></span>
        </Card.Header>
        <Card.Body>
          <WidgetShell
            state={state}
            errorMessage={errorMessage}
            emptyMessage="No programme data for this filter."
            onRetry={fetchData}
          >
            <SafeApexChart type="bar" height={400} series={series} options={options} />
          </WidgetShell>
        </Card.Body>
      </Card>
    </MainLayout>
  );
};

function labelFor(id: string): string {
  return METRIC_OPTIONS.find((m) => m.value === id)?.label ?? id;
}

export default Benchmarking;
