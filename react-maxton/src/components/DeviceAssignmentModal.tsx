import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Device } from '../store/slices/deviceSlice';
import { Beneficiary } from '../store/slices/beneficiarySlice';
import { createDeviceAssignment, unassignDevice } from '../store/slices/deviceAssignmentSlice';
import { fetchDevices } from '../store/slices/deviceSlice';
import { fetchBeneficiaries } from '../store/slices/beneficiarySlice';

/**
 * Props interface for the DeviceAssignmentModal component
 */
interface DeviceAssignmentModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'assign' | 'unassign';
  device?: Device | null;
  beneficiary?: Beneficiary | null;
  onSuccess?: () => void;
}

/**
 * Device Assignment Modal Component
 * 
 * This modal allows users to assign devices to beneficiaries or unassign devices
 * from their current beneficiaries. It provides a user-friendly interface for
 * managing device assignments with proper validation and error handling.
 * 
 * Features:
 * - Assign mode: Select a device and beneficiary to create an assignment
 * - Unassign mode: Remove a device from its current beneficiary
 * - Form validation and error handling
 * - Loading states and success feedback
 * - Responsive design with Bootstrap components
 */
const DeviceAssignmentModal: React.FC<DeviceAssignmentModalProps> = ({
  show,
  onHide,
  mode,
  device,
  beneficiary,
  onSuccess
}) => {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { devices, loading: devicesLoading } = useAppSelector(state => state.devices);
  const { beneficiaries, loading: beneficiariesLoading } = useAppSelector(state => state.beneficiaries);
  const { assignments, loading: assignmentLoading, error: assignmentError } = useAppSelector(state => state.deviceAssignments);
  const { user } = useAppSelector(state => state.auth);

  // Local state for form data
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (show) {
      setSelectedDeviceId(device?.id || '');
      setSelectedBeneficiaryId(beneficiary?.id || '');
      setNotes('');
      setValidationErrors({});
    }
  }, [show, mode, device, beneficiary]);

  // Load data when modal opens
  useEffect(() => {
    if (show) {
      if (devices.length === 0) {
        dispatch(fetchDevices());
      }
      if (beneficiaries.length === 0) {
        dispatch(fetchBeneficiaries());
      }
    }
  }, [show, dispatch, devices.length, beneficiaries.length]);

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'assign') {
      if (!selectedDeviceId) {
        errors.device = 'Please select a device';
      }
      if (!selectedBeneficiaryId) {
        errors.beneficiary = 'Please select a beneficiary';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'assign') {
        await dispatch(createDeviceAssignment({
          deviceId: selectedDeviceId,
          beneficiaryId: selectedBeneficiaryId,
          assignedBy: user?.email || 'unknown@example.com',
          notes: notes.trim()
        })).unwrap();
      } else if (mode === 'unassign' && device) {
        // Find the assignment ID from the current assignment
        const assignment = assignments.find(a => a.device_id === device.id && a.is_active);
        if (assignment) {
          await dispatch(unassignDevice({
            assignmentId: assignment.id,
            note: notes.trim()
          })).unwrap();
        }
      }

      // Call success callback and close modal
      onSuccess?.();
      onHide();
    } catch (error) {
      // Error is handled by Redux state
      console.error('Assignment operation failed:', error);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setValidationErrors({});
    onHide();
  };

  // Filter devices and beneficiaries based on current assignments
  const availableDevices = devices.filter(d => !d.current_beneficiary_id && d.is_active);
  const availableBeneficiaries = beneficiaries.filter(b => !b.current_device_id && b.is_active);

  // Get device and beneficiary names for display
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  const selectedBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'assign' ? 'Assign Device to Beneficiary' : 'Unassign Device'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Error Alert */}
          {assignmentError && (
            <Alert variant="danger" className="mb-3">
              {assignmentError}
            </Alert>
          )}

          {/* Unassign Mode - Show current assignment info */}
          {mode === 'unassign' && device && device.current_beneficiary && (
            <Alert variant="info" className="mb-3">
              <strong>Current Assignment:</strong><br />
              <strong>Device:</strong> {device.device_name} ({device.mac_address})<br />
              <strong>Beneficiary:</strong> {device.current_beneficiary.name} ({device.current_beneficiary.email})
            </Alert>
          )}

          {/* Assign Mode - Device Selection */}
          {mode === 'assign' && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Device *</Form.Label>
                  <Form.Select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    isInvalid={!!validationErrors.device}
                    disabled={devicesLoading}
                  >
                    <option value="">Choose a device...</option>
                    {availableDevices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.device_name} ({device.mac_address}) - {device.organization}
                      </option>
                    ))}
                  </Form.Select>
                  {validationErrors.device && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.device}
                    </Form.Control.Feedback>
                  )}
                  {devicesLoading && (
                    <Form.Text className="text-muted">Loading devices...</Form.Text>
                  )}
                  {!devicesLoading && availableDevices.length === 0 && (
                    <Form.Text className="text-muted">No available devices found</Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Beneficiary *</Form.Label>
                  <Form.Select
                    value={selectedBeneficiaryId}
                    onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                    isInvalid={!!validationErrors.beneficiary}
                    disabled={beneficiariesLoading}
                  >
                    <option value="">Choose a beneficiary...</option>
                    {availableBeneficiaries.map(beneficiary => (
                      <option key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.name} ({beneficiary.email}) - {beneficiary.organization}
                      </option>
                    ))}
                  </Form.Select>
                  {validationErrors.beneficiary && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.beneficiary}
                    </Form.Control.Feedback>
                  )}
                  {beneficiariesLoading && (
                    <Form.Text className="text-muted">Loading beneficiaries...</Form.Text>
                  )}
                  {!beneficiariesLoading && availableBeneficiaries.length === 0 && (
                    <Form.Text className="text-muted">No available beneficiaries found</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* Notes Field */}
          <Form.Group className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this assignment..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {notes.length}/500 characters
            </Form.Text>
          </Form.Group>

          {/* Assignment Preview for Assign Mode */}
          {mode === 'assign' && selectedDevice && selectedBeneficiary && (
            <Alert variant="success" className="mb-3">
              <strong>Assignment Preview:</strong><br />
              <strong>Device:</strong> {selectedDevice.device_name} ({selectedDevice.mac_address})<br />
              <strong>Beneficiary:</strong> {selectedBeneficiary.name} ({selectedBeneficiary.email})
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={assignmentLoading}>
            Cancel
          </Button>
          <Button
            variant={mode === 'assign' ? 'primary' : 'warning'}
            type="submit"
            disabled={assignmentLoading || (mode === 'assign' && (!selectedDeviceId || !selectedBeneficiaryId))}
          >
            {assignmentLoading ? 'Processing...' : (mode === 'assign' ? 'Assign Device' : 'Unassign Device')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeviceAssignmentModal;
