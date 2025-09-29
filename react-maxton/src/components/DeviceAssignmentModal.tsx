import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Device } from '../store/slices/deviceSlice';
import { Beneficiary } from '../store/slices/beneficiarySlice';
import { createDeviceAssignment, unassignDevice } from '../store/slices/deviceAssignmentSlice';
import { fetchUnassignedDevices } from '../store/slices/deviceSlice';
import { fetchUnassignedBeneficiaries } from '../store/slices/beneficiarySlice';
import SearchableDropdown from './SearchableDropdown';

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
  const { unassignedDevices, unassignedLoading: devicesLoading } = useAppSelector(state => state.devices);
  const { unassignedBeneficiaries, unassignedLoading: beneficiariesLoading } = useAppSelector(state => state.beneficiaries);
  const { assignments, loading: assignmentLoading, error: assignmentError } = useAppSelector(state => state.deviceAssignments);
  const { user } = useAppSelector(state => state.auth);

  // Local state for form data
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (show) {
      setSelectedDevice(device || null);
      setSelectedBeneficiary(beneficiary || null);
      setNotes('');
      setValidationErrors({});
    }
  }, [show, mode, device, beneficiary]);

  // Load unassigned data when modal opens
  useEffect(() => {
    if (show) {
      dispatch(fetchUnassignedDevices(''));
      dispatch(fetchUnassignedBeneficiaries(''));
    }
  }, [show, dispatch]);

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'assign') {
      if (!selectedDevice) {
        errors.device = 'Please select a device';
      }
      if (!selectedBeneficiary) {
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
      if (mode === 'assign' && selectedDevice && selectedBeneficiary) {
        await dispatch(createDeviceAssignment({
          deviceId: selectedDevice.id,
          beneficiaryId: selectedBeneficiary.id,
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

  // Use unassigned devices and beneficiaries directly
  const availableDevices = unassignedDevices;
  const availableBeneficiaries = unassignedBeneficiaries;

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
                  <SearchableDropdown
                    items={availableDevices.map(device => ({
                      ...device,
                      id: device.id,
                      name: device.device_name,
                      subtitle: `${device.mac_address} - ${device.organization}`
                    }))}
                    selectedItem={selectedDevice}
                    onSelect={setSelectedDevice}
                    placeholder="Choose a device..."
                    loading={devicesLoading}
                    error={validationErrors.device}
                    searchPlaceholder="Search devices..."
                    noResultsText="No available devices found"
                    displayKey="name"
                    subtitleKey="subtitle"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Beneficiary *</Form.Label>
                  <SearchableDropdown
                    items={availableBeneficiaries.map(beneficiary => ({
                      ...beneficiary,
                      id: beneficiary.id,
                      name: beneficiary.name,
                      subtitle: `${beneficiary.email} - ${beneficiary.organization}`
                    }))}
                    selectedItem={selectedBeneficiary}
                    onSelect={setSelectedBeneficiary}
                    placeholder="Choose a beneficiary..."
                    loading={beneficiariesLoading}
                    error={validationErrors.beneficiary}
                    searchPlaceholder="Search beneficiaries..."
                    noResultsText="No available beneficiaries found"
                    displayKey="name"
                    subtitleKey="subtitle"
                  />
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
            disabled={assignmentLoading || (mode === 'assign' && (!selectedDevice || !selectedBeneficiary))}
          >
            {assignmentLoading ? 'Processing...' : (mode === 'assign' ? 'Assign Device' : 'Unassign Device')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeviceAssignmentModal;
