import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { buildApiUrl, API_CONFIG } from "../config/api";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!token) {
      setErrorMessage("Invalid or missing reset link. Please request a new one.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, new_password: newPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error_description || data.description || "Failed to reset password.",
        );
        return;
      }

      setSuccessMessage(
        data.message || "Password has been reset successfully.",
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-reset-password">
      <div className="auth-basic-wrapper d-flex align-items-center justify-content-center">
        <div className="container my-5 my-lg-0">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
              <div className="card rounded-4 mb-0 border-top border-4 border-primary border-gradient-1">
                <div className="card-body p-5">
                  <img
                    src="/assets/images/logo.png"
                    className="mb-4"
                    width="300"
                    alt=""
                  />
                  <h4 className="fw-bold">Generate New Password</h4>
                  <p className="mb-0">
                    We received your reset password request. Please enter your
                    new password!
                  </p>

                  {successMessage && (
                    <div className="alert alert-success mt-4 mb-0" role="alert">
                      {successMessage}{" "}
                      <Link to="/login">Go to login</Link>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="alert alert-danger mt-4 mb-0" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-body mt-4">
                    <form className="row g-4" onSubmit={handleSubmit}>
                      <div className="col-12">
                        <label className="form-label" htmlFor="NewPassword">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="NewPassword"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                          disabled={loading || !!successMessage}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label" htmlFor="ConfirmPassword">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="ConfirmPassword"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          disabled={loading || !!successMessage}
                        />
                      </div>
                      <div className="col-12">
                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="btn btn-grd-info"
                            disabled={loading || !!successMessage}
                          >
                            {loading ? "Changing..." : "Change Password"}
                          </button>
                          <Link to="/login" className="btn btn-grd-royal">
                            Back to Login
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
