import React from 'react';

export interface SyncHistoryErrorRowProps {
  colSpan: number;
  errorMessage: string | null | undefined;
  warningMessage: string | null | undefined;
}

export const SyncHistoryErrorRow: React.FC<SyncHistoryErrorRowProps> = ({
  colSpan,
  errorMessage,
  warningMessage,
}) => {
  if (!errorMessage && !warningMessage) return null;

  const isError = Boolean(errorMessage);
  const label = isError ? 'Error' : 'Warning';
  const text = errorMessage ?? warningMessage ?? '';
  // Note: intentionally NOT 'error'/'warning' — those ligature names collide
  // (as literal DOM text) with the "Error"/"Warning" label text below, which
  // breaks text-based accessibility queries (two elements would read the same
  // word). 'report' / 'priority_high' are standard Material Symbols glyphs
  // that convey the same meaning without the lexical collision.
  const iconName = isError ? 'report' : 'priority_high';
  const bgClass = isError ? 'bg-danger' : 'bg-warning';
  const textClass = isError ? 'text-danger' : 'text-warning-emphasis';

  return (
    <tr className="sync-history-details-row">
      <td colSpan={colSpan} className="py-2 px-3 bg-light">
        <div className="d-flex align-items-start gap-2">
          <span
            className={`d-inline-flex align-items-center justify-content-center rounded-2 ${bgClass} bg-opacity-10 p-1`}
            aria-hidden="true"
          >
            <i className={`material-symbols-outlined ${textClass}`} style={{ fontSize: 18 }}>
              {iconName}
            </i>
          </span>
          <div className="flex-grow-1">
            <div className={`fw-semibold ${textClass}`}>{label}</div>
            <div className="text-body-secondary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {text}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
