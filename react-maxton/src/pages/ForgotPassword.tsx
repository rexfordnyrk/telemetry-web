import React, { useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl, API_CONFIG } from "../config/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setErrorMessage(
          data.error_description ||
            data.description ||
            "Too many password reset requests. Please try again later.",
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          data.error_description ||
            data.description ||
            "Unable to process request. Please try again.",
        );
        return;
      }

      setSuccessMessage(
        data.message ||
          "If an account exists for that email, a reset link has been sent.",
      );
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-forgot-password">
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
                  <h4 className="fw-bold">Forgot Password?</h4>
                  <p className="mb-0">
                    Enter your registered email ID to reset the password
                  </p>

                  {successMessage && (
                    <div className="alert alert-success mt-4 mb-0" role="alert">
                      {successMessage}
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
                        <label className="form-label">Email id</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="example@user.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="col-12">
                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="btn btn-grd-primary"
                            disabled={loading}
                          >
                            {loading ? "Sending..." : "Send"}
                          </button>
                          <Link to="/login" className="btn btn-light">
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

export default ForgotPassword;
