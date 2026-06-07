import React from 'react';

interface SessionTimeoutWarningProps {
  warningMinutes: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  warningMinutes,
  onStayLoggedIn,
  onLogout,
}) => {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="sessionTimeoutLabel"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="sessionTimeoutLabel">
              Session Expiring Soon
            </h5>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Your session will expire in about {warningMinutes} minute
              {warningMinutes !== 1 ? 's' : ''} due to inactivity. Would you like
              to stay logged in?
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onLogout}>
              Log out
            </button>
            <button type="button" className="btn btn-primary" onClick={onStayLoggedIn}>
              Stay logged in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
