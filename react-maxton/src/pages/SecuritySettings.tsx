import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppSelector } from "../store/hooks";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../config/api";

export interface MFASettings {
  email_otp_enabled: boolean;
  totp_enabled: boolean;
  has_backup_codes: boolean;
}

const SecuritySettings: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [settings, setSettings] = useState<MFASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalAction, setPasswordModalAction] = useState<
    "email-toggle" | "regenerate-backup" | "disable-totp" | null
  >(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [totpDisableCode, setTotpDisableCode] = useState("");
  const [emailToggleTarget, setEmailToggleTarget] = useState<boolean | null>(
    null
  );

  const [enrollData, setEnrollData] = useState<{
    qr_url: string;
    secret: string;
  } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const loadSettings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_SETTINGS),
        { headers: getAuthHeaders(token) }
      );
      if (!response.ok) {
        throw new Error("Failed to load security settings");
      }
      const data: MFASettings = await response.json();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load security settings"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const openEmailToggleModal = (enabled: boolean) => {
    setEmailToggleTarget(enabled);
    setPasswordModalAction("email-toggle");
    setPasswordInput("");
    setShowPasswordModal(true);
  };

  const handleEmailToggle = async () => {
    if (!token || emailToggleTarget === null) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_EMAIL_OTP),
        {
          method: "PUT",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            password: passwordInput,
            enabled: emailToggleTarget,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update email OTP setting");
      }
      setShowPasswordModal(false);
      setPasswordInput("");
      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update email OTP setting"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateBackup = async () => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_BACKUP_CODES_REGENERATE),
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({ password: passwordInput }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to regenerate backup codes");
      }
      const data = await response.json();
      setBackupCodes(data.backup_codes ?? []);
      setShowPasswordModal(false);
      setPasswordInput("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate backup codes"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisableTotp = async () => {
    if (!token || !passwordInput || !totpDisableCode.trim()) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_TOTP),
        {
          method: "DELETE",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            password: passwordInput,
            code: totpDisableCode.trim(),
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error_description || data.Description || "Failed to disable TOTP"
        );
      }
      setShowPasswordModal(false);
      setPasswordInput("");
      setTotpDisableCode("");
      setBackupCodes(null);
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable TOTP");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordModalConfirm = async () => {
    if (passwordModalAction === "email-toggle") {
      await handleEmailToggle();
    } else if (passwordModalAction === "regenerate-backup") {
      await handleRegenerateBackup();
    } else if (passwordModalAction === "disable-totp") {
      await handleDisableTotp();
    }
  };

  const openDisableTotpModal = () => {
    setPasswordModalAction("disable-totp");
    setPasswordInput("");
    setTotpDisableCode("");
    setShowPasswordModal(true);
  };

  const handleStartTotpEnroll = async () => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    setBackupCodes(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_TOTP_ENROLL),
        {
          method: "POST",
          headers: getAuthHeaders(token),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to start TOTP enrollment");
      }
      const data = await response.json();
      setEnrollData({ qr_url: data.qr_url, secret: data.secret });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start TOTP enrollment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyTotpEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !totpVerifyCode.trim()) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.MFA_TOTP_VERIFY),
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({ code: totpVerifyCode.trim() }),
        }
      );
      if (!response.ok) {
        throw new Error("Invalid TOTP code");
      }
      const data = await response.json();
      setBackupCodes(data.backup_codes ?? []);
      setEnrollData(null);
      setTotpVerifyCode("");
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid TOTP code");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Profile</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Security Settings
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Multi-Factor Authentication</h5>

            {loading && (
              <div className="d-flex align-items-center py-3">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Loading settings...
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {!loading && settings && (
              <>
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Email OTP</h6>
                      <p className="text-muted mb-0 small">
                        Receive a verification code by email when signing in.
                      </p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="emailOtpToggle"
                        checked={settings.email_otp_enabled}
                        onChange={(e) =>
                          openEmailToggleModal(e.target.checked)
                        }
                        disabled={actionLoading}
                      />
                      <label className="form-check-label" htmlFor="emailOtpToggle">
                        {settings.email_otp_enabled ? "Enabled" : "Disabled"}
                      </label>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h6 className="mb-2">Authenticator App (TOTP)</h6>
                  {settings.totp_enabled ? (
                    <p className="text-success mb-2">
                      TOTP is enabled
                      {settings.has_backup_codes && " — backup codes on file"}
                    </p>
                  ) : (
                    <p className="text-muted mb-2">
                      Add an authenticator app for stronger protection.
                    </p>
                  )}

                  {!settings.totp_enabled && !enrollData && (
                    <button
                      type="button"
                      className="btn btn-grd-primary"
                      onClick={handleStartTotpEnroll}
                      disabled={actionLoading}
                    >
                      Enable TOTP
                    </button>
                  )}

                  {enrollData && (
                    <div data-testid="totp-qr-container" className="mt-3">
                      <p className="mb-2">
                        Scan this QR code with your authenticator app:
                      </p>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(enrollData.qr_url)}`}
                        alt="TOTP QR code"
                        width={200}
                        height={200}
                        className="mb-3 border"
                      />
                      <p className="small text-muted mb-3">
                        Manual entry key: <code>{enrollData.secret}</code>
                      </p>
                      <form onSubmit={handleVerifyTotpEnroll}>
                        <label htmlFor="totpVerifyCode" className="form-label">
                          Enter code from app
                        </label>
                        <div className="d-flex gap-2">
                          <input
                            type="text"
                            className="form-control"
                            id="totpVerifyCode"
                            value={totpVerifyCode}
                            onChange={(e) => setTotpVerifyCode(e.target.value)}
                            placeholder="6-digit code"
                            disabled={actionLoading}
                          />
                          <button
                            type="submit"
                            className="btn btn-grd-primary"
                            disabled={actionLoading || !totpVerifyCode.trim()}
                          >
                            Verify
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {settings.totp_enabled && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setPasswordModalAction("regenerate-backup");
                          setPasswordInput("");
                          setTotpDisableCode("");
                          setShowPasswordModal(true);
                        }}
                        disabled={actionLoading}
                      >
                        Regenerate backup codes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={openDisableTotpModal}
                        disabled={actionLoading}
                      >
                        Disable TOTP
                      </button>
                    </div>
                  )}
                </div>

                {backupCodes && backupCodes.length > 0 && (
                  <div
                    className="alert alert-warning"
                    role="alert"
                    data-testid="backup-codes-display"
                  >
                    <h6 className="alert-heading">Save your backup codes</h6>
                    <p className="mb-2 small">
                      These codes are shown once. Store them securely.
                    </p>
                    <ul className="mb-0 font-monospace">
                      {backupCodes.map((code) => (
                        <li key={code}>{code}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showPasswordModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="passwordConfirmTitle"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="passwordConfirmTitle">
                    Confirm your password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPasswordModal(false)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    {passwordModalAction === "disable-totp"
                      ? "Enter your password and a current authenticator or backup code to disable TOTP."
                      : "Enter your password to continue."}
                  </p>
                  <label htmlFor="confirmPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="confirmPassword"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={actionLoading}
                  />
                  {passwordModalAction === "disable-totp" && (
                    <>
                      <label htmlFor="totpDisableCode" className="form-label">
                        Authenticator or backup code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="totpDisableCode"
                        value={totpDisableCode}
                        onChange={(e) => setTotpDisableCode(e.target.value)}
                        placeholder="6-digit code or backup code"
                        disabled={actionLoading}
                        autoComplete="one-time-code"
                      />
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordModalConfirm}
                    disabled={
                      actionLoading ||
                      !passwordInput ||
                      (passwordModalAction === "disable-totp" &&
                        !totpDisableCode.trim())
                    }
                  >
                    {actionLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SecuritySettings;
