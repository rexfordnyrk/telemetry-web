import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const BeneficiaryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Sample beneficiaries data (would come from store in real app) - memoized to prevent re-renders
  const beneficiaries = useMemo(
    () => [
      {
        id: "f854c2a8-12ff-4075-95f6-abf2ad6d61de",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        organization: "Research Institute",
        district: "Central District",
        programme: "Digital Literacy Study",
        date_enrolled: "2025-05-15T03:06:24.730291Z",
        is_active: true,
        current_device: {
          id: "8c07e7e2-944f-4fb6-8817-2cf53a5bd952",
          device_name: "Pixel 7",
          android_version: "Android 13",
          app_version: "1.2.3",
        },
        participation_history: [
          {
            date: "2025-01-15",
            activity: "Survey Completed",
            status: "Success",
          },
          {
            date: "2025-01-10",
            activity: "Training Session",
            status: "Attended",
          },
          {
            date: "2025-01-05",
            activity: "App Installation",
            status: "Success",
          },
          {
            date: "2024-12-20",
            activity: "Initial Onboarding",
            status: "Completed",
          },
        ],
        performance_metrics: {
          surveys_completed: 15,
          training_sessions_attended: 8,
          avg_app_usage_hours: 2.5,
          compliance_rate: 92,
        },
      },
    ],
    [],
  );

  // Find beneficiary by ID - memoized to prevent infinite re-renders
  const beneficiary = useMemo(
    () => beneficiaries.find((b) => b.id === id),
    [id],
  );

  // Form state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: beneficiary?.name || "",
    email: beneficiary?.email || "",
    phone: beneficiary?.phone || "",
    organization: beneficiary?.organization || "",
    district: beneficiary?.district || "",
    programme: beneficiary?.programme || "",
    is_active: beneficiary?.is_active || false,
  });

  // Update form data when beneficiary changes
  React.useEffect(() => {
    if (beneficiary) {
      setFormData({
        name: beneficiary.name,
        email: beneficiary.email,
        phone: beneficiary.phone,
        organization: beneficiary.organization,
        district: beneficiary.district,
        programme: beneficiary.programme,
        is_active: beneficiary.is_active,
      });
    }
  }, [beneficiary]);

  if (!beneficiary) {
    return (
      <MainLayout>
        <div className="page-content">
          <div className="alert alert-danger">Beneficiary not found</div>
        </div>
      </MainLayout>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement updateBeneficiary action
    dispatch(
      addAlert({
        type: "success",
        title: "Profile Updated",
        message: "Beneficiary profile has been updated successfully.",
      }),
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: beneficiary.name,
      email: beneficiary.email,
      phone: beneficiary.phone,
      organization: beneficiary.organization,
      district: beneficiary.district,
      programme: beneficiary.programme,
      is_active: beneficiary.is_active,
    });
    setIsEditing(false);
  };

  const handleNavigateToDevice = () => {
    if (beneficiary.current_device) {
      navigate(`/device-management/devices/${beneficiary.current_device.id}`);
    }
  };

  return (
    <MainLayout>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Beneficiary Management</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/beneficiary-management/beneficiaries">
                    Beneficiaries
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {beneficiary.name}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-12 col-xl-8">
            {/* Profile Information */}
            <div className="card rounded-4 border-top border-4 border-primary border-gradient-1">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h5 className="mb-0 fw-bold">Beneficiary Profile</h5>
                  </div>
                  <div>
                    {!isEditing ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bx bx-edit me-2"></i>Edit Profile
                      </button>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          form="beneficiary-form"
                          className="btn btn-primary btn-sm"
                        >
                          <i className="bx bx-save me-2"></i>Save
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div
                    className="avatar-circle me-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {beneficiary.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="mb-0">{beneficiary.name}</h4>
                    <p className="text-muted mb-0">{beneficiary.email}</p>
                    <span
                      className={`badge ${
                        beneficiary.is_active ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {beneficiary.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <form
                  id="beneficiary-form"
                  className="row g-4"
                  onSubmit={handleSubmit}
                >
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="district" className="form-label">
                      District
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="organization" className="form-label">
                      Partner Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="programme" className="form-label">
                      Intervention Programme
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="programme"
                      name="programme"
                      value={formData.programme}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-12 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <label className="form-check-label" htmlFor="is_active">
                        Active Participant
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="card rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3 fw-bold">Performance Metrics</h5>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="text-center">
                      <h3 className="text-primary mb-1">
                        {beneficiary.performance_metrics?.surveys_completed ||
                          0}
                      </h3>
                      <p className="text-muted mb-0">Surveys Completed</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h3 className="text-success mb-1">
                        {beneficiary.performance_metrics
                          ?.training_sessions_attended || 0}
                      </h3>
                      <p className="text-muted mb-0">Training Sessions</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h3 className="text-info mb-1">
                        {beneficiary.performance_metrics?.avg_app_usage_hours ||
                          0}
                        h
                      </h3>
                      <p className="text-muted mb-0">Avg Daily Usage</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h3 className="text-warning mb-1">
                        {beneficiary.performance_metrics?.compliance_rate || 0}%
                      </h3>
                      <p className="text-muted mb-0">Compliance Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Participation History */}
            <div className="card rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3 fw-bold">Recent Activity</h5>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Activity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiary.participation_history?.map(
                        (activity, index) => (
                          <tr key={index}>
                            <td>
                              {new Date(activity.date).toLocaleDateString()}
                            </td>
                            <td>{activity.activity}</td>
                            <td>
                              <span
                                className={`badge ${
                                  activity.status === "Success" ||
                                  activity.status === "Completed" ||
                                  activity.status === "Attended"
                                    ? "bg-success"
                                    : "bg-warning"
                                }`}
                              >
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-12 col-xl-4">
            {/* Enrollment Information */}
            <div className="card rounded-4 mb-3">
              <div className="card-body">
                <h5 className="mb-3 fw-bold">Enrollment Information</h5>
                <div className="mb-3">
                  <span className="text-muted">Status:</span>
                  <span
                    className={`badge ms-2 ${
                      beneficiary.is_active ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {beneficiary.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-muted">Date Enrolled:</span>
                  <p className="mb-0 mt-1">
                    {new Date(beneficiary.date_enrolled).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-3">
                  <span className="text-muted">District:</span>
                  <p className="mb-0 mt-1">{beneficiary.district}</p>
                </div>
                <div className="mb-3">
                  <span className="text-muted">Organization:</span>
                  <p className="mb-0 mt-1">{beneficiary.organization}</p>
                </div>
                <div>
                  <span className="text-muted">Programme:</span>
                  <p className="mb-0 mt-1">{beneficiary.programme}</p>
                </div>
              </div>
            </div>

            {/* Assigned Device */}
            <div className="card rounded-4">
              <div className="card-body">
                <h5 className="mb-3 fw-bold">Assigned Device</h5>
                {beneficiary.current_device ? (
                  <div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bx bx-mobile-alt text-primary me-2 fs-4"></i>
                        <h6 className="mb-0">
                          {beneficiary.current_device.device_name}
                        </h6>
                      </div>
                      <p className="text-muted mb-1">
                        <strong>OS:</strong>{" "}
                        {beneficiary.current_device.android_version}
                      </p>
                      <p className="text-muted mb-0">
                        <strong>App Version:</strong>{" "}
                        {beneficiary.current_device.app_version}
                      </p>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={handleNavigateToDevice}
                    >
                      View Device Details
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <i className="bx bx-mobile-alt display-6 mb-2"></i>
                    <p>No device assigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BeneficiaryDetails;
