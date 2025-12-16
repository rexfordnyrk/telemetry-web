import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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

                  <div className="form-body mt-4">
                    <form className="row g-4" onSubmit={handleSubmit}>
                      <div className="col-12">
                        <label className="form-label">Email id</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="example@user.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <div className="d-grid gap-2">
                          <button type="submit" className="btn btn-grd-primary">
                            Send
                          </button>
                          <a href="/login" className="btn btn-light">
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

export default ForgotPassword;
