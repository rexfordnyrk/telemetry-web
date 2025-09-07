import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AssignmentSearchParams } from '../store/slices/deviceAssignmentSlice';

/**
 * Props interface for the AssignmentFilterModal component
 */
interface AssignmentFilterModalProps {
  show: boolean;
  onHide: () => void;
  onApplyFilters: (filters: AssignmentSearchParams) => void;
  currentFilters: AssignmentSearchParams;
}

/**
 * Assignment Filter Modal Component
 * 
 * This modal provides advanced search and filtering capabilities for device assignments.
 * Users can filter by device name, beneficiary name, organization, status, Android version,
 * district, MAC address, email, notes, and date ranges.
 * 
 * Features:
 * - Multiple filter options with proper form controls
 * - Date range picker for assignment dates
 * - Clear all filters functionality
 * - Form validation and error handling
 * - Responsive design with Bootstrap components
 */
const AssignmentFilterModal: React.FC<AssignmentFilterModalProps> = ({
  show,
  onHide,
  onApplyFilters,
  currentFilters
}) => {
  // Local state for form data
  const [filters, setFilters] = useState<AssignmentSearchParams>(currentFilters);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update local state when current filters change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof AssignmentSearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date range
    const errors: Record<string, string> = {};
    if (filters.assigned_after && filters.assigned_before) {
      const afterDate = new Date(filters.assigned_after);
      const beforeDate = new Date(filters.assigned_before);
      if (afterDate > beforeDate) {
        errors.assigned_before = 'End date must be after start date';
      }
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onApplyFilters(filters);
      onHide();
    }
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    const emptyFilters: AssignmentSearchParams = {};
    setFilters(emptyFilters);
    setValidationErrors({});
    onApplyFilters(emptyFilters);
    onHide();
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setValidationErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Assignments</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* General Search */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>General Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search across all fields..."
                  value={filters.search || ''}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                />
                <Form.Text className="text-muted">
                  Search across device names, beneficiary names, emails, and notes
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Device Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Device Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Samsung Galaxy"
                  value={filters.device_name || ''}
                  onChange={(e) => handleInputChange('device_name', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAC Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 00:11:22:33:44:55"
                  value={filters.device_mac_address || ''}
                  onChange={(e) => handleInputChange('device_mac_address', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Beneficiary Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Beneficiary Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., John Doe"
                  value={filters.beneficiary_name || ''}
                  onChange={(e) => handleInputChange('beneficiary_name', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Beneficiary Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="e.g., john@example.com"
                  value={filters.beneficiary_email || ''}
                  onChange={(e) => handleInputChange('beneficiary_email', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Organization and District */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Research Institute"
                  value={filters.organization || ''}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Accra Central"
                  value={filters.district || ''}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Android Version and Status */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Android Version</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Android 12"
                  value={filters.android_version || ''}
                  onChange={(e) => handleInputChange('android_version', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assignment Status</Form.Label>
                <Form.Select
                  value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                  onChange={(e) => handleInputChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Date Range */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assigned After</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.assigned_after || ''}
                  onChange={(e) => handleInputChange('assigned_after', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assigned Before</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.assigned_before || ''}
                  onChange={(e) => handleInputChange('assigned_before', e.target.value)}
                  isInvalid={!!validationErrors.assigned_before}
                />
                {validationErrors.assigned_before && (
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.assigned_before}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Notes Search */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Search in Notes</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., digital literacy"
                  value={filters.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Pagination */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Results per Page</Form.Label>
                <Form.Select
                  value={filters.limit || 20}
                  onChange={(e) => handleInputChange('limit', parseInt(e.target.value))}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Apply Filters
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AssignmentFilterModal;
