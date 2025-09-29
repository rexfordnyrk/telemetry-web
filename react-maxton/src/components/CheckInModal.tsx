import React, { useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { upsertVisit, Visit } from "../store/slices/visitSlice";

interface CheckInModalProps {
  show: boolean;
  onHide: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ show, onHide }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    cic: "",
    name: "",
    programme: "",
    activity: "",
    assisted_by: "",
    notes: "",
    check_in: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm for datetime-local
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: { [k: string]: string } = {};
    if (!formData.cic.trim()) next.cic = "CIC is required";
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.programme.trim()) next.programme = "Intervention is required";
    if (!formData.activity.trim()) next.activity = "Activity is required";
    if (!formData.check_in.trim()) next.check_in = "Check-In is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toIso = (local: string) => {
    if (!local) return new Date().toISOString();
    const d = new Date(local);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nowIso = new Date().toISOString();
    const visit: Visit = {
      id: crypto.randomUUID(),
      cic: formData.cic.trim(),
      name: formData.name.trim(),
      programme: formData.programme.trim(),
      activity: formData.activity.trim(),
      assisted_by: formData.assisted_by.trim() ? formData.assisted_by.trim() : null,
      notes: formData.notes.trim(),
      check_in: toIso(formData.check_in),
      check_out: null,
      duration_minutes: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    dispatch(upsertVisit(visit));
    dispatch(
      addAlert({
        type: "success",
        title: "Checked In",
        message: `${visit.name} checked in at ${new Date(visit.check_in).toLocaleString()}.`,
      })
    );
    onHide();
  };

  const handleClose = () => {
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
      <Modal.Header closeButton className="border-top border-3 border-primary" style={{ borderRadius: 0 }}>
        <Modal.Title>
          <i className="bx bx-log-in me-2"></i>
          Check-In
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  CIC <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="cic"
                  value={formData.cic}
                  onChange={handleInputChange}
                  placeholder="Enter CIC"
                  isInvalid={!!errors.cic}
                />
                <Form.Control.Feedback type="invalid">{errors.cic}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter beneficiary name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Intervention <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="programme"
                  value={formData.programme}
                  onChange={handleInputChange}
                  placeholder="Enter intervention"
                  isInvalid={!!errors.programme}
                />
                <Form.Control.Feedback type="invalid">{errors.programme}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Activity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                  placeholder="Enter activity"
                  isInvalid={!!errors.activity}
                />
                <Form.Control.Feedback type="invalid">{errors.activity}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Assisted By
                </Form.Label>
                <Form.Control
                  type="text"
                  name="assisted_by"
                  value={formData.assisted_by}
                  onChange={handleInputChange}
                  placeholder="Enter staff name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Check-In <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleInputChange}
                  isInvalid={!!errors.check_in}
                />
                <Form.Control.Feedback type="invalid">{errors.check_in}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Notes / Follow Up</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes or follow up details"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light" onClick={handleClose}>
              <i className="bx bx-x me-2"></i>
              Cancel
            </button>
            <button type="submit" className="btn btn-grd-primary">
              <i className="material-icons-outlined me-1">login</i>
              Check-In
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckInModal;
