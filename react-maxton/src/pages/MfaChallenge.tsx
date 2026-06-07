import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import {
  mfaVerify,
  sendEmailOTP,
  clearError,
  clearMfaState,
} from "../store/slices/authSlice";

type VerifyMethod = "totp" | "email" | "backup";

const MfaChallenge: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    loading,
    error,
    isAuthenticated,
    mfaToken,
    mfaMethods,
    mfaPending,
    mfaEmailOtpSent,
  } = useSelector((state: RootState) => state.auth);

  const hasTotp = mfaMethods.includes("totp");
  const hasEmail = mfaMethods.includes("email");
  const emailOnly = hasEmail && !hasTotp;

  const [method, setMethod] = useState<VerifyMethod>(
    hasTotp ? "totp" : hasEmail ? "email" : "backup"
  );
  const [code, setCode] = useState("");
  const [emailSent, setEmailSent] = useState(mfaEmailOtpSent);
  const [resendLoading, setResendLoading] = useState(false);
  const autoSendAttempted = useRef(false);

  useEffect(() => {
    if (!mfaPending || !mfaToken) {
      navigate("/login", { replace: true });
    }
  }, [mfaPending, mfaToken, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "blue-theme");
  }, []);

  useEffect(() => {
    setEmailSent(mfaEmailOtpSent);
  }, [mfaEmailOtpSent]);

  const sendEmailCode = useCallback(async () => {
    if (!mfaToken || !hasEmail) return false;
    setResendLoading(true);
    dispatch(clearError());
    try {
      await dispatch(sendEmailOTP(mfaToken)).unwrap();
      setEmailSent(true);
      return true;
    } catch {
      return false;
    } finally {
      setResendLoading(false);
    }
  }, [dispatch, mfaToken, hasEmail]);

  // Email-only MFA: ensure OTP is sent if login did not already send it
  useEffect(() => {
    if (!emailOnly || !mfaToken || mfaEmailOtpSent || autoSendAttempted.current) {
      return;
    }
    autoSendAttempted.current = true;
    void sendEmailCode();
  }, [emailOnly, mfaToken, mfaEmailOtpSent, sendEmailCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaToken || !code.trim()) return;

    dispatch(clearError());
    try {
      await dispatch(
        mfaVerify({
          mfa_token: mfaToken,
          method,
          code: code.trim(),
        })
      ).unwrap();
      navigate("/dashboard");
    } catch {
      // error shown via Redux state
    }
  };

  const handleUseEmail = async () => {
    if (!mfaToken || !hasEmail) return;
    setMethod("email");
    setCode("");
    await sendEmailCode();
  };

  const handleResendEmail = async () => {
    if (!mfaToken || !hasEmail || method !== "email") return;
    await sendEmailCode();
  };

  const handleUseBackup = () => {
    setMethod("backup");
    setCode("");
    dispatch(clearError());
  };

  const handleBackToTotp = () => {
    if (hasTotp) {
      setMethod("totp");
      setCode("");
      dispatch(clearError());
    }
  };

  const handleBackToEmail = () => {
    if (hasEmail) {
      setMethod("email");
      setCode("");
      dispatch(clearError());
    }
  };

  const handleCancel = () => {
    dispatch(clearMfaState());
    navigate("/login");
  };

  const methodLabel =
    method === "totp"
      ? "Authenticator code"
      : method === "email"
        ? "Email verification code"
        : "Backup code";

  const subtitle = emailOnly
    ? "Enter the verification code sent to your email."
    : method === "totp"
      ? "Enter the code from your authenticator app."
      : "Enter your verification code to complete sign in.";

  return (
    <div className="auth-basic-wrapper d-flex align-items-center justify-content-center">
      <div className="container-fluid my-5 my-lg-0">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
            <div className="card rounded-4 mb-0 border-top border-4 border-primary border-gradient-1">
              <div className="card-body p-5">
                <img
                  src="/assets/images/logo.png"
                  className="mb-4"
                  width="300"
                  alt="Company Logo"
                />
                <h4 className="fw-bold">Two-Factor Authentication</h4>
                <p className="mb-0">{subtitle}</p>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {emailSent && method === "email" && (
                  <div className="alert alert-info mt-3" role="alert">
                    A verification code has been sent to your email.
                  </div>
                )}

                <div className="form-body my-5">
                  <form className="row g-3" onSubmit={handleSubmit} noValidate>
                    <div className="col-12">
                      <label htmlFor="mfaCode" className="form-label">
                        {methodLabel}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mfaCode"
                        name="mfaCode"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={
                          method === "backup"
                            ? "Enter backup code"
                            : "Enter 6-digit code"
                        }
                        disabled={loading}
                        autoComplete="one-time-code"
                        inputMode={method === "backup" ? "text" : "numeric"}
                        required
                      />
                    </div>

                    <div className="col-12 d-flex flex-column gap-2">
                      {method === "email" && hasEmail && (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start"
                          onClick={handleResendEmail}
                          disabled={loading || resendLoading}
                        >
                          {resendLoading ? "Sending code..." : "Resend code"}
                        </button>
                      )}
                      {method === "totp" && hasEmail && (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start"
                          onClick={handleUseEmail}
                          disabled={loading || resendLoading}
                        >
                          Use email instead
                        </button>
                      )}
                      {hasTotp && method !== "backup" && (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start"
                          onClick={handleUseBackup}
                          disabled={loading}
                        >
                          Use a backup code
                        </button>
                      )}
                      {method === "backup" && hasTotp && (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start"
                          onClick={handleBackToTotp}
                          disabled={loading}
                        >
                          Back to authenticator app
                        </button>
                      )}
                      {method === "backup" && hasEmail && !hasTotp && (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-start"
                          onClick={handleBackToEmail}
                          disabled={loading}
                        >
                          Back to email verification
                        </button>
                      )}
                    </div>

                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-grd-primary"
                          disabled={loading || !code.trim()}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              />
                              Verifying...
                            </>
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Back to login
                      </button>
                    </div>
                  </form>
                </div>

                <p className="text-center mb-0">
                  <Link to="/login">Return to login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaChallenge;
