import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const BeneficiaryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Sample beneficiaries data (would come from store in real app)
  const beneficiaries = [
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
    },
  ];

  // Find beneficiary by ID
  const beneficiary = beneficiaries.find((b) => b.id === id);

  // Initialize form data with beneficiary data or empty values
  const [formData, setFormData] = useState({
    name: beneficiary?.name || "",
    email: beneficiary?.email || "",
    phone: beneficiary?.phone || "",
    organization: beneficiary?.organization || "",
    district: beneficiary?.district || "",
    programme: beneficiary?.programme || "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update beneficiary data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedBeneficiary = {
      ...beneficiary,
      ...formData,
      updated_at: new Date().toISOString(),
    };

    // TODO: Implement updateBeneficiary action
    dispatch(
      addAlert({
        type: "success",
        title: "Profile Updated",
        message: "Beneficiary profile has been updated successfully.",
      }),
    );
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
          {/* Left Column - Edit Profile */}
          <div className="col-12 col-xl-8">
            <div className="card rounded-4 border-top border-4 border-primary border-gradient-1">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Edit Beneficiary Profile</h5>
                  </div>
                </div>
                <form className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-12">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="organization" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      placeholder="Organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="district" className="form-label">
                      District
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      placeholder="District"
                      value={formData.district}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="programme" className="form-label">
                      Programme
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="programme"
                      name="programme"
                      placeholder="Programme"
                      value={formData.programme}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="d-md-flex d-grid align-items-center gap-3">
                      <button
                        type="submit"
                        className="btn btn-grd-primary px-4"
                      >
                        Update Profile
                      </button>
                      <button type="button" className="btn btn-light px-4">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Beneficiary Info */}
          <div className="col-12 col-xl-4">
            <div className="card rounded-4 mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0 fw-bold">Beneficiary Information</h5>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3">Current Status</h6>
                  <span
                    className={`badge ${beneficiary.is_active ? "bg-success" : "bg-danger"}`}
                  >
                    {beneficiary.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3">Enrollment Date</h6>
                  <p className="text-muted">
                    {new Date(beneficiary.date_enrolled).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BeneficiaryDetails;
