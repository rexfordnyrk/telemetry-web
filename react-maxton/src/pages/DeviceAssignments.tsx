import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Form, InputGroup } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchDeviceAssignments, 
  selectDeviceAssignments, 
  selectDeviceAssignmentsLoading, 
  selectDeviceAssignmentsError,
  selectActiveDeviceAssignments 
} from '../store/slices/deviceAssignmentSlice';
import { fetchDevices } from '../store/slices/deviceSlice';
import { fetchBeneficiaries } from '../store/slices/beneficiarySlice';
import DeviceAssignmentModal from '../components/DeviceAssignmentModal';
import { Device } from '../store/slices/deviceSlice';
import { Beneficiary } from '../store/slices/beneficiarySlice';

/**
 * Device Assignments Page Component
 * 
 * This page provides a comprehensive interface for managing device assignments.
 * Users can view all current assignments, assign devices to beneficiaries,
 * and unassign devices from their current beneficiaries.
 * 
 * Features:
 * - View all current device assignments in a table format
 * - Filter and search assignments by device or beneficiary
 * - Assign devices to beneficiaries
 * - Unassign devices from beneficiaries
 * - Real-time updates and loading states
 * - Responsive design with Bootstrap components
 */
const DeviceAssignments: React.FC = () => {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(selectDeviceAssignments);
  const activeAssignments = useAppSelector(selectActiveDeviceAssignments);
  const loading = useAppSelector(selectDeviceAssignmentsLoading);
  const error = useAppSelector(selectDeviceAssignmentsError);
  const { devices } = useAppSelector(state => state.devices);
  const { beneficiaries } = useAppSelector(state => state.beneficiaries);

  // Local state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchDeviceAssignments());
    dispatch(fetchDevices());
    dispatch(fetchBeneficiaries());
  }, [dispatch]);

  /**
   * Filter assignments based on search term and status
   */
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter(assignment => assignment.is_active);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(assignment => !assignment.is_active);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(assignment => 
        assignment.device?.device_name?.toLowerCase().includes(term) ||
        assignment.device?.mac_address?.toLowerCase().includes(term) ||
        assignment.beneficiary?.name?.toLowerCase().includes(term) ||
        assignment.beneficiary?.email?.toLowerCase().includes(term) ||
        assignment.notes?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [assignments, searchTerm, filterStatus]);

  /**
   * Handle assign button click
   */
  const handleAssignClick = () => {
    setSelectedDevice(null);
    setSelectedBeneficiary(null);
    setShowAssignModal(true);
  };

  /**
   * Handle unassign button click
   */
  const handleUnassignClick = (assignment: any) => {
    // Find the full device object from the devices list
    const fullDevice = devices.find(d => d.id === assignment.device_id);
    if (fullDevice) {
      setSelectedDevice(fullDevice);
      setSelectedBeneficiary(assignment.beneficiary || null);
      setShowUnassignModal(true);
    }
  };

  /**
   * Handle successful assignment/unassignment
   */
  const handleAssignmentSuccess = () => {
    // Refresh assignments data
    dispatch(fetchDeviceAssignments());
    dispatch(fetchDevices());
    dispatch(fetchBeneficiaries());
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge variant
   */
  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'success' : 'secondary';
  };

  return (
    <MainLayout>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Device Management</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Device Assignments
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleAssignClick}
              disabled={loading}
            >
              <i className="material-icons-outlined me-1">add</i>
              Assign Device
            </Button>
          </div>
        </div>

        <Container fluid>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="card-animate">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-0">Total Assignments</p>
                    <h4 className="mb-0">{assignments.length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <i className="material-icons-outlined text-primary" style={{ fontSize: '2rem' }}>
                      assignment
                    </i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-animate">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-0">Active Assignments</p>
                    <h4 className="mb-0">{activeAssignments.length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <i className="material-icons-outlined text-success" style={{ fontSize: '2rem' }}>
                      check_circle
                    </i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-animate">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-0">Available Devices</p>
                    <h4 className="mb-0">{devices.filter(d => !d.current_beneficiary_id && d.is_active).length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <i className="material-icons-outlined text-info" style={{ fontSize: '2rem' }}>
                      devices
                    </i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-animate">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-0">Available Beneficiaries</p>
                    <h4 className="mb-0">{beneficiaries.filter(b => !b.current_device_id && b.is_active).length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <i className="material-icons-outlined text-warning" style={{ fontSize: '2rem' }}>
                      people
                    </i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <i className="material-icons-outlined">search</i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">All Assignments</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="material-icons-outlined me-2">error</i>
            {error}
          </Alert>
        )}

        {/* Assignments Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="card-title mb-0">Device Assignments</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 mb-0">Loading assignments...</p>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="material-icons-outlined text-muted" style={{ fontSize: '3rem' }}>
                      assignment
                    </i>
                    <p className="text-muted mt-2 mb-0">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'No assignments match your filters' 
                        : 'No device assignments found'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Device</th>
                          <th>Beneficiary</th>
                          <th>Assigned Date</th>
                          <th>Unassigned Date</th>
                          <th>Status</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((assignment) => (
                          <tr key={assignment.id}>
                            <td>
                              <div>
                                <strong>{assignment.device?.device_name || 'Unknown Device'}</strong>
                                <br />
                                <small className="text-muted">
                                  {assignment.device?.mac_address || 'N/A'}
                                </small>
                              </div>
                            </td>
                            <td>
                              {assignment.beneficiary ? (
                                <div>
                                  <strong>{assignment.beneficiary.name}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {assignment.beneficiary.email}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">No beneficiary</span>
                              )}
                            </td>
                            <td>
                              {formatDate(assignment.assigned_at)}
                            </td>
                            <td>
                              {assignment.unassigned_at ? formatDate(assignment.unassigned_at) : '-'}
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(assignment.is_active)}>
                                {assignment.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <div style={{ maxWidth: '200px' }}>
                                {assignment.notes ? (
                                  <span 
                                    className="text-truncate d-inline-block" 
                                    style={{ maxWidth: '100%' }}
                                    title={assignment.notes}
                                  >
                                    {assignment.notes}
                                  </span>
                                ) : (
                                  <span className="text-muted">No notes</span>
                                )}
                              </div>
                            </td>
                            <td>
                              {assignment.is_active && assignment.device && (
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => handleUnassignClick(assignment)}
                                  title="Unassign device"
                                >
                                  <i className="material-icons-outlined">remove_circle</i>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Assignment Modal */}
        <DeviceAssignmentModal
          show={showAssignModal}
          onHide={() => setShowAssignModal(false)}
          mode="assign"
          onSuccess={handleAssignmentSuccess}
        />

        {/* Unassignment Modal */}
        <DeviceAssignmentModal
          show={showUnassignModal}
          onHide={() => setShowUnassignModal(false)}
          mode="unassign"
          device={selectedDevice}
          beneficiary={selectedBeneficiary}
          onSuccess={handleAssignmentSuccess}
        />
        </Container>
      </div>
    </MainLayout>
  );
};

export default DeviceAssignments;
