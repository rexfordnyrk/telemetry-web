import React, { useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import {
  createBeneficiary,
  fetchSimilarBeneficiaries,
  Beneficiary,
} from "../store/slices/beneficiarySlice";
import { validateBeneficiaryCreate } from "../utils/beneficiaryValidation";
import SimilarBeneficiaryConfirmModal from "./SimilarBeneficiaryConfirmModal";

interface NewBeneficiaryModalProps {
  show: boolean;
  onHide: () => void;
  onCreated?: () => void;
}

const NewBeneficiaryModal: React.FC<NewBeneficiaryModalProps> = ({
  show,
  onHide,
  onCreated,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    district: "",
    programme: "",
    date_enrolled: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [similarMatches, setSimilarMatches] = useState<Beneficiary[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const doCreate = async () => {
    setSubmitting(true);
    try {
      await dispatch(createBeneficiary({ ...formData })).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Beneficiary Added",
          message: `${formData.name} has been successfully enrolled as a beneficiary.`,
        }),
      );
      handleReset();
      onHide();
      if (onCreated) onCreated();
    } catch (err) {
      const message = typeof err === "string" ? err : "Failed to create beneficiary";
      dispatch(
        addAlert({
          type: "danger",
          title: "Create Failed",
          message,
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateBeneficiaryCreate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check for similar beneficiaries before creating
    try {
      const matches = await dispatch(
        fetchSimilarBeneficiaries({ phone: formData.phone, email: formData.email }),
      ).unwrap();

      if (matches && matches.length > 0) {
        setSimilarMatches(matches);
        setShowConfirm(true);
      } else {
        await doCreate();
      }
    } catch {
      // If similar check fails, proceed with creation
      await doCreate();
    }
  };

  const handleConfirmCreate = async () => {
    setShowConfirm(false);
    setSimilarMatches([]);
    await doCreate();
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setSimilarMatches([]);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      district: "",
      programme: "",
      date_enrolled: new Date().toISOString().slice(0, 10),
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onHide();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Modal.Header
          closeButton
          className="border-top border-3 border-success"
          style={{ borderRadius: 0 }}
        >
          <Modal.Title>
            <i className="bx bx-user-plus me-2"></i>
            New Beneficiary Registration
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    District <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Enter district"
                    isInvalid={!!errors.district}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.district}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Partner Organization <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="Enter partner organization"
                    isInvalid={!!errors.organization}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organization}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Intervention Programme <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="programme"
                    value={formData.programme}
                    onChange={handleInputChange}
                    placeholder="Enter intervention programme"
                    isInvalid={!!errors.programme}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.programme}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date Enrolled</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_enrolled"
                    value={formData.date_enrolled}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 text-center">
              <p className="text-muted mb-0">
                <i className="bx bx-info-circle me-1"></i>
                All fields marked with <span className="text-danger">*</span> are
                required
              </p>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <button type="button" className="btn btn-light" onClick={handleClose}>
            <i className="bx bx-x me-2"></i>
            Cancel
          </button>
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={handleReset}
              disabled={submitting}
            >
              <i className="bx bx-reset me-2"></i>
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <i className="bx bx-user-plus me-2"></i>
              {submitting ? "Registering..." : "Register Beneficiary"}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <SimilarBeneficiaryConfirmModal
        show={showConfirm}
        matches={similarMatches}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmCreate}
      />
    </>
  );
};

export default NewBeneficiaryModal;
