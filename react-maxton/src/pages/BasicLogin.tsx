import React, { useState, useEffect } from "react";

declare const $: any;

const BasicLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "12345678",
    rememberMe: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  useEffect(() => {
    // Set the theme to match original HTML
    document.documentElement.setAttribute("data-bs-theme", "blue-theme");
    document.documentElement.setAttribute("lang", "en");
  }, []);

  return (
    <div className="auth-basic-wrapper d-flex align-items-center justify-content-center">
      <div className="container-fluid my-5 my-lg-0">
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
                <h4 className="fw-bold">Get Started Now</h4>
                <p className="mb-0">
                  Enter your credentials to login your account
                </p>

                <div className="form-body my-5">
                  <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-12">
                      <label htmlFor="inputEmailAddress" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="inputEmailAddress"
                        name="email"
                        placeholder="jhon@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputChoosePassword"
                        className="form-label"
                      >
                        Password
                      </label>
                      <div className="input-group" id="show_hide_password">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control border-end-0"
                          id="inputChoosePassword"
                          name="password"
                          value={formData.password}
                          placeholder="Enter Password"
                          onChange={handleInputChange}
                        />
                        <a
                          href="javascript:;"
                          className="input-group-text bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          <i
                            className={`bi ${
                              showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                            }`}
                          ></i>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <a href="/auth/basic/forgot-password">
                        Forgot Password ?
                      </a>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button type="submit" className="btn btn-grd-primary">
                          Login
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="text-start">
                        <p className="mb-0">
                          Don't have an account yet?{" "}
                          <a href="/auth/basic/register">Sign up here</a>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="separator section-padding">
                  <div className="line"></div>
                  <p className="mb-0 fw-bold">OR SIGN IN WITH</p>
                  <div className="line"></div>
                </div>

                <div className="d-flex gap-3 justify-content-center mt-4">
                  <a
                    href="javascript:;"
                    className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger"
                  >
                    <i className="bi bi-google fs-5 text-white"></i>
                  </a>
                  <a
                    href="javascript:;"
                    className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-deep-blue"
                  >
                    <i className="bi bi-facebook fs-5 text-white"></i>
                  </a>
                  <a
                    href="javascript:;"
                    className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-info"
                  >
                    <i className="bi bi-linkedin fs-5 text-white"></i>
                  </a>
                  <a
                    href="javascript:;"
                    className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-royal"
                  >
                    <i className="bi bi-github fs-5 text-white"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicLogin;
