import React from 'react';
import { Form } from 'react-bootstrap';

export interface ForecastToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  horizonDays?: number;
  label?: string;
}

const ForecastToggle: React.FC<ForecastToggleProps> = ({
  value, onChange, horizonDays = 14, label,
}) => (
  <Form.Check
    type="switch"
    id="forecast-toggle"
    className="small text-muted"
    checked={value}
    onChange={(e) => onChange(e.target.checked)}
    label={label ?? `Forecast (${horizonDays}d)`}
  />
);

export default ForecastToggle;
