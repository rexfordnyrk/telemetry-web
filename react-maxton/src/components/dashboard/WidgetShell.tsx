import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';

export type WidgetState = 'loading' | 'error' | 'empty' | 'ok';

export interface WidgetShellProps {
  state: WidgetState;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const WidgetShell: React.FC<WidgetShellProps> = ({
  state, emptyMessage = 'No data.', errorMessage = 'Failed to load.', onRetry, children,
}) => {
  if (state === 'loading') {
    return (
      <div className="widget-shell d-flex justify-content-center align-items-center"
           style={{ minHeight: 120 }}>
        <Spinner animation="border" size="sm" role="status" />
      </div>
    );
  }
  if (state === 'error') {
    return (
      <Alert variant="warning" className="mb-0">
        <span className="me-2">{errorMessage}</span>
        {onRetry && (
          <Button variant="link" size="sm" onClick={onRetry} aria-label="Retry">Retry</Button>
        )}
      </Alert>
    );
  }
  if (state === 'empty') {
    return (
      <div className="widget-shell d-flex justify-content-center align-items-center text-muted"
           style={{ minHeight: 120 }}>{emptyMessage}</div>
    );
  }
  return <>{children}</>;
};
