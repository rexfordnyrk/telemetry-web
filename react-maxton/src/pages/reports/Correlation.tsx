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

interface CorrelationPair { x: number; y: number; label: string }
interface CorrelationResult {
  pairs: CorrelationPair[];
  pearson: number | null;
  spearman: number | null;
}

const Correlation: React.FC = () => {
  const g = useAppSelector((s: any) => s.globalFilters);
  const token = useAppSelector((s: any) => s.auth?.token);
  const [metricA, setMetricA] = useState<string>('avg_screen_time');
  const [metricB, setMetricB] = useState<string>('data_usage');
  const [state, setState] = useState<WidgetState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [result, setResult] = useState<CorrelationResult | null>(null);

  const fetchData = useCallback(async () => {
    setState('loading');
    try {
      const params = new URLSearchParams();
      params.set('a', metricA);
      params.set('b', metricB);
      params.set('period', serializeForApi(g.period));
      params.set('programme', g.programme);
      params.set('organisation', g.organisation);
      params.set('district', g.district);
      const url = buildApiUrl('/api/v1/analytics/correlate') + '?' + params.toString();
      const res = await fetch(url, { headers: getAuthHeaders(token) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = (json?.data ?? null) as CorrelationResult | null;
      setResult(data);
      if (!data || data.pearson == null) {
        setState('empty');
      } else {
        setState('ok');
      }
    } catch (e: any) {
      setErrorMessage(String(e?.message ?? e));
      setState('error');
    }
  }, [metricA, metricB, g, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const chartData = useMemo(() => {
    const pairs = result?.pairs ?? [];
    return [{ name: 'Beneficiaries', data: pairs.map((p) => ({ x: p.x, y: p.y, label: p.label })) }];
  }, [result]);

  const options = useMemo(() => ({
    chart: { type: 'scatter', toolbar: { show: true }, animations: { enabled: false } },
    xaxis: { title: { text: labelFor(metricA) } },
    yaxis: { title: { text: labelFor(metricB) } },
    tooltip: {
      custom: ({ dataPointIndex, w }: any) => {
        const p = w?.config?.series?.[0]?.data?.[dataPointIndex];
        if (!p) return '';
        return `<div class="p-2"><strong>${p.label ?? ''}</strong><br/>${labelFor(metricA)}: ${p.x}<br/>${labelFor(metricB)}: ${p.y}</div>`;
      },
    },
    markers: { size: 5 },
  } as any), [metricA, metricB]);

  const pearsonText = result?.pearson == null ? '—' : result.pearson.toFixed(3);

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Correlation</h4>
        <FiltersButton />
      </div>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Metric A (x)</Form.Label>
            <Form.Select value={metricA} onChange={(e) => setMetricA(e.target.value)} aria-label="Metric A">
              {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Metric B (y)</Form.Label>
            <Form.Select value={metricB} onChange={(e) => setMetricB(e.target.value)} aria-label="Metric B">
              {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Card className="rounded-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Scatter</span>
          <span className="text-muted small">Pearson r = <strong>{pearsonText}</strong></span>
        </Card.Header>
        <Card.Body>
          <WidgetShell
            state={state}
            errorMessage={errorMessage}
            emptyMessage="Not enough data for correlation."
            onRetry={fetchData}
          >
            <SafeApexChart type="scatter" height={400} series={chartData} options={options} />
          </WidgetShell>
        </Card.Body>
      </Card>
    </MainLayout>
  );
};

function labelFor(id: string): string {
  return METRIC_OPTIONS.find((m) => m.value === id)?.label ?? id;
}

export default Correlation;
