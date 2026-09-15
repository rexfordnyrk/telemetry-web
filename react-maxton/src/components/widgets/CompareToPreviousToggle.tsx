import React from 'react';
import { Form } from 'react-bootstrap';

export interface CompareToPreviousToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

const CompareToPreviousToggle: React.FC<CompareToPreviousToggleProps> = ({ value, onChange, label = 'Compare to previous' }) => (
  <Form.Check
    type="switch"
    id="compare-to-previous"
    className="small text-muted"
    checked={value}
    onChange={(e) => onChange(e.target.checked)}
    label={label}
  />
);

export default CompareToPreviousToggle;
