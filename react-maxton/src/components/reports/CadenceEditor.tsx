import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export type Cadence = {
  kind: 'daily' | 'weekly' | 'monthly';
  time: string;         // HH:MM
  timezone: string;     // IANA
  weekday?: number;     // 0..6
  dayOfMonth?: number;  // 1..28
};

export interface CadenceEditorProps {
  value: Cadence;
  onChange: (v: Cadence) => void;
}

const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FALLBACK_TIMEZONES = [
  'UTC', 'Europe/London', 'America/New_York', 'America/Los_Angeles',
  'Africa/Accra', 'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
  'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney',
];

const listTimezones = (): string[] => {
  try {
    const anyIntl = Intl as any;
    if (typeof anyIntl.supportedValuesOf === 'function') {
      return anyIntl.supportedValuesOf('timeZone');
    }
  } catch { /* fall through */ }
  return FALLBACK_TIMEZONES;
};

const CadenceEditor: React.FC<CadenceEditorProps> = ({ value, onChange }) => {
  const timezones = React.useMemo(listTimezones, []);
  const setField = <K extends keyof Cadence>(k: K, v: Cadence[K]) => onChange({ ...value, [k]: v });
  return (
    <Row className="g-3">
      <Col md={3}>
        <Form.Group>
          <Form.Label>Frequency</Form.Label>
          <Form.Select
            value={value.kind}
            onChange={(e) => setField('kind', e.target.value as Cadence['kind'])}
            aria-label="Cadence kind"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group>
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={value.time}
            onChange={(e) => setField('time', e.target.value)}
            aria-label="Cadence time"
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group>
          <Form.Label>Timezone</Form.Label>
          <Form.Select
            value={value.timezone}
            onChange={(e) => setField('timezone', e.target.value)}
            aria-label="Cadence timezone"
          >
            {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
      {value.kind === 'weekly' && (
        <Col md={3}>
          <Form.Group>
            <Form.Label>Weekday</Form.Label>
            <Form.Select
              value={value.weekday ?? 1}
              onChange={(e) => setField('weekday', parseInt(e.target.value, 10))}
              aria-label="Cadence weekday"
            >
              {WEEKDAY_LABELS.map((label, i) => <option key={i} value={i}>{label}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      )}
      {value.kind === 'monthly' && (
        <Col md={3}>
          <Form.Group>
            <Form.Label>Day of month</Form.Label>
            <Form.Select
              value={value.dayOfMonth ?? 1}
              onChange={(e) => setField('dayOfMonth', parseInt(e.target.value, 10))}
              aria-label="Cadence day of month"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      )}
    </Row>
  );
};

export default CadenceEditor;
