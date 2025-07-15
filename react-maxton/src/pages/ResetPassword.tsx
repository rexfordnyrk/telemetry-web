import React, { useState } from "react";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
                    src="/assets/images/logo1.png"
                    className="mb-4"
                    width="145"
                    alt=""
                  />
                  <h4 className="fw-bold">Genrate New Password</h4>
                  <p className="mb-0">
                    We received your reset password request. Please enter your
                    new password!
                  </p>
                  <div className="form-body mt-4">
                    <form className="row g-4" onSubmit={handleSubmit}>
                      <div className="col-12">
                        <label className="form-label" htmlFor="NewPassword">
                          New Password
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="NewPassword"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label" htmlFor="ConfirmPassword">
                          Confirm Password
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ConfirmPassword"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <div className="d-grid gap-2">
                          <button type="submit" className="btn btn-grd-info">
                            Change Password
                          </button>
                          <a
                            href="/auth/basic/login"
                            className="btn btn-grd-royal"
                          >
                            Back to Login
                          </a>
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
