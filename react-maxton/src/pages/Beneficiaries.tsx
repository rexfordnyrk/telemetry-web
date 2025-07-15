import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

const Beneficiaries: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showNewBeneficiaryModal, setShowNewBeneficiaryModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"disable" | "delete">(
    "disable",
  );
  const [targetBeneficiary, setTargetBeneficiary] = useState<any>(null);

  // Sample beneficiaries data matching DataTable structure
  const beneficiaries = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0123",
      relationship: "Spouse",
      percentage: "50%",
      category: "Primary",
      address: "123 Main St, New York, NY",
      status: "active",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      name: "Emily Smith",
      email: "emily.smith@example.com",
      phone: "+1-555-0124",
      relationship: "Child",
      percentage: "30%",
      category: "Primary",
      address: "123 Main St, New York, NY",
      status: "active",
      created_at: "2024-01-20",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+1-555-0125",
      relationship: "Brother",
      percentage: "15%",
      category: "Secondary",
      address: "456 Oak Ave, Chicago, IL",
      status: "pending",
      created_at: "2024-02-01",
    },
    {
      id: "4",
      name: "Mary Wilson",
      email: "mary.wilson@example.com",
      phone: "+1-555-0126",
      relationship: "Mother",
      percentage: "5%",
      category: "Contingent",
      address: "789 Pine Rd, Los Angeles, CA",
      status: "inactive",
      created_at: "2024-02-10",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1-555-0127",
      relationship: "Friend",
      percentage: "0%",
      category: "Contingent",
      address: "321 Elm St, Miami, FL",
      status: "active",
      created_at: "2024-02-15",
    },
  ];

  const getStatusElement = (status: string) => {
    const statusConfig = {
      active: { bg: "success", text: "Active" },
      inactive: { bg: "danger", text: "Inactive" },
      pending: { bg: "warning", text: "Pending" },
      suspended: { bg: "secondary", text: "Suspended" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`dash-lable mb-0 bg-${config.bg} bg-opacity-10 text-${config.bg} rounded-2`}
      >
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      Primary: { bg: "primary", text: "Primary" },
      Secondary: { bg: "info", text: "Secondary" },
      Contingent: { bg: "warning", text: "Contingent" },
    };

    const config =
      categoryConfig[category as keyof typeof categoryConfig] ||
      categoryConfig.Primary;

    return (
      <span
        className={`badge bg-${config.bg} bg-opacity-10 text-${config.bg} border border-${config.bg}`}
      >
        {config.text}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleActionClick = (
    beneficiary: any,
    action: "disable" | "delete",
  ) => {
    setTargetBeneficiary(beneficiary);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been deleted.`,
        }),
      );
    } else {
      const newStatus =
        targetBeneficiary?.status === "inactive" ? "active" : "inactive";
      dispatch(
        addAlert({
          type: "success",
          title: "Success",
          message: `Beneficiary "${targetBeneficiary?.name}" has been ${newStatus}.`,
        }),
      );
    }

    setShowModal(false);
    setTargetBeneficiary(null);
  };

  return (
    <MainLayout>
      <div className="main-content">
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
                <li className="breadcrumb-item active" aria-current="page">
                  Beneficiaries
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-grd-primary px-4"
                onClick={() => setShowNewBeneficiaryModal(true)}
              >
                + | New Beneficiary
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="mb-0">DataTable Example</h6>
                  </div>
                  <div className="col-auto">
                    <div className="dropdown">
                      <a
                        href="javascript:;"
                        className="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <span className="material-icons-outlined">
                          more_vert
                        </span>
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Another action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered"
                    id="example"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  fontSize: "14px",
                                }}
                              >
                                {getInitials(beneficiary.name)}
                              </div>
                              <div>
                                <a
                                  href="#"
                                  className="text-decoration-none fw-bold text-dark"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  {beneficiary.name}
                                </a>
                                <div className="text-muted small">
                                  {beneficiary.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {beneficiary.relationship}
                            <div className="text-muted small">
                              {beneficiary.phone}
                            </div>
                          </td>
                          <td>
                            {getCategoryBadge(beneficiary.category)}
                            <div className="text-muted small mt-1">
                              {beneficiary.address}
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold">
                              {beneficiary.percentage}
                            </span>
                          </td>
                          <td>{getStatusElement(beneficiary.status)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <span>
                                {new Date(
                                  beneficiary.created_at,
                                ).toLocaleDateString()}
                              </span>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm p-1"
                                  title="Edit Beneficiary"
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                >
                                  <i className="material-icons-outlined text-primary">
                                    edit
                                  </i>
                                </button>
                                <button
                                  className="btn btn-sm p-1"
                                  title={
                                    beneficiary.status === "inactive"
                                      ? "Activate Beneficiary"
                                      : "Deactivate Beneficiary"
                                  }
                                  onClick={() =>
                                    handleActionClick(beneficiary, "disable")
                                  }
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                >
                                  <i className="material-icons-outlined text-warning">
                                    {beneficiary.status === "inactive"
                                      ? "check_circle"
                                      : "block"}
                                  </i>
                                </button>
                                <button
                                  className="btn btn-sm p-1"
                                  title="Delete Beneficiary"
                                  onClick={() =>
                                    handleActionClick(beneficiary, "delete")
                                  }
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                >
                                  <i className="material-icons-outlined text-danger">
                                    delete
                                  </i>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog">
            <div
              className={`card border-top border-3 ${modalAction === "delete" ? "border-danger" : "border-warning"} rounded-0`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header py-3 px-4">
                <h5
                  className={`mb-0 ${modalAction === "delete" ? "text-danger" : "text-warning"}`}
                >
                  Confirm {modalAction === "delete" ? "Delete" : "Deactivate"}{" "}
                  Beneficiary
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="card-body p-4">
                <p>
                  Are you sure you want to{" "}
                  {modalAction === "delete" ? "delete" : "deactivate"}{" "}
                  beneficiary <strong>{targetBeneficiary?.name}</strong>?
                  {modalAction === "delete" && (
                    <span className="text-danger d-block mt-2">
                      This action cannot be undone.
                    </span>
                  )}
                </p>
                <div className="d-md-flex d-grid align-items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-grd-royal px-4 rounded-0"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${modalAction === "delete" ? "btn-grd-danger" : "btn-grd-warning"} px-4 rounded-0`}
                    onClick={handleConfirmAction}
                  >
                    {modalAction === "delete" ? "Delete" : "Deactivate"}{" "}
                    Beneficiary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Beneficiaries;
