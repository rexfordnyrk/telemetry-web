import React, { useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";

interface NewBeneficiaryModalProps {
  show: boolean;
  onHide: () => void;
}

const NewBeneficiaryModal: React.FC<NewBeneficiaryModalProps> = ({
  show,
  onHide,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    district: "",
    programme: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.programme.trim()) {
      newErrors.programme = "Programme is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create new beneficiary object
    const newBeneficiary = {
      id: crypto.randomUUID(),
      ...formData,
      date_enrolled: new Date().toISOString(),
      is_active: true,
      current_device: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    // TODO: Implement addBeneficiary action
    console.log("New Beneficiary:", newBeneficiary);

    dispatch(
      addAlert({
        type: "success",
        title: "Beneficiary Added",
        message: `${formData.name} has been successfully enrolled as a beneficiary.`,
      }),
    );

    handleReset();
    onHide();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      district: "",
      programme: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onHide();
  };

  return (
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
          >
            <i className="bx bx-reset me-2"></i>
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            <i className="bx bx-user-plus me-2"></i>
            Register Beneficiary
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default NewBeneficiaryModal;
