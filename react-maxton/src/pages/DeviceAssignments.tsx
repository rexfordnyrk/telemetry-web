import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Form, InputGroup, Pagination } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchDeviceAssignments, 
  selectDeviceAssignments, 
  selectDeviceAssignmentsLoading, 
  selectDeviceAssignmentsError,
  selectActiveDeviceAssignments,
  selectDeviceAssignmentsSearchParams,
  selectDeviceAssignmentsPagination,
  clearSearchParams
} from '../store/slices/deviceAssignmentSlice';
import { fetchDevices } from '../store/slices/deviceSlice';
import { fetchBeneficiaries } from '../store/slices/beneficiarySlice';
import DeviceAssignmentModal from '../components/DeviceAssignmentModal';
import AssignmentFilterModal from '../components/AssignmentFilterModal';
import { Device } from '../store/slices/deviceSlice';
import { Beneficiary } from '../store/slices/beneficiarySlice';
import { AssignmentSearchParams } from '../store/slices/deviceAssignmentSlice';

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
  const searchParams = useAppSelector(selectDeviceAssignmentsSearchParams);
  const pagination = useAppSelector(selectDeviceAssignmentsPagination);
  const { devices } = useAppSelector(state => state.devices);
  const { beneficiaries } = useAppSelector(state => state.beneficiaries);

  // Local state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [quickSearch, setQuickSearch] = useState('');

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchDeviceAssignments({}));
    dispatch(fetchDevices());
    dispatch(fetchBeneficiaries());
  }, [dispatch]);

  /**
   * Handle quick search
   */
  const handleQuickSearch = (searchTerm: string) => {
    setQuickSearch(searchTerm);
    const params: AssignmentSearchParams = {
      ...searchParams,
      search: searchTerm || undefined,
      page: 1 // Reset to first page when searching
    };
    dispatch(fetchDeviceAssignments(params));
  };

  /**
   * Handle advanced filters
   */
  const handleApplyFilters = (filters: AssignmentSearchParams) => {
    const params: AssignmentSearchParams = {
      ...filters,
      page: 1 // Reset to first page when applying filters
    };
    dispatch(fetchDeviceAssignments(params));
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    const params: AssignmentSearchParams = {
      ...searchParams,
      page
    };
    dispatch(fetchDeviceAssignments(params));
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setQuickSearch('');
    dispatch(clearSearchParams());
    dispatch(fetchDeviceAssignments({}));
  };

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
    dispatch(fetchDeviceAssignments(searchParams));
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
          <div className="ms-auto d-flex gap-2 align-items-center">
            <InputGroup style={{ width: '300px' }}>
              <InputGroup.Text>
                <i className="material-icons-outlined">search</i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Quick search across all fields..."
                value={quickSearch}
                onChange={(e) => handleQuickSearch(e.target.value)}
              />
            </InputGroup>
            <Button 
              variant="outline-primary" 
              onClick={() => setShowFilterModal(true)}
            >
              <i className="material-icons-outlined me-1">filter_list</i>
              Advanced Filters
            </Button>
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


        {/* Active Filters Display */}
        {Object.keys(searchParams).length > 0 && (
          <Row className="mb-3">
            <Col>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-primary">
                  Active Filters: {Object.keys(searchParams).length}
                </span>
                {Object.entries(searchParams).map(([key, value]) => {
                  if (value === undefined || value === null || value === '') return null;
                  return (
                    <span key={key} className="badge bg-secondary">
                      {key}: {value.toString()}
                    </span>
                  );
                })}
              </div>
            </Col>
          </Row>
        )}

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
                ) : assignments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="material-icons-outlined text-muted" style={{ fontSize: '3rem' }}>
                      assignment
                    </i>
                    <p className="text-muted mt-2 mb-0">
                      {Object.keys(searchParams).length > 0 
                        ? 'No assignments match your filters' 
                        : 'No device assignments found'
                      }
                    </p>
                  </div>
                ) : (
                  <>
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
                          {assignments.map((assignment) => (
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

                    {/* Pagination */}
                    {pagination && pagination.total > pagination.limit && (
                      <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                          <Pagination.First 
                            onClick={() => handlePageChange(1)}
                            disabled={pagination.page === 1}
                          />
                          <Pagination.Prev 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                          />
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                            .filter(page => {
                              const current = pagination.page;
                              return page === 1 || page === Math.ceil(pagination.total / pagination.limit) || 
                                     (page >= current - 2 && page <= current + 2);
                            })
                            .map((page, index, array) => {
                              if (index > 0 && page - array[index - 1] > 1) {
                                return (
                                  <React.Fragment key={`ellipsis-${page}`}>
                                    <Pagination.Ellipsis />
                                    <Pagination.Item 
                                      active={page === pagination.page}
                                      onClick={() => handlePageChange(page)}
                                    >
                                      {page}
                                    </Pagination.Item>
                                  </React.Fragment>
                                );
                              }
                              return (
                                <Pagination.Item 
                                  key={page}
                                  active={page === pagination.page}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </Pagination.Item>
                              );
                            })}
                          
                          <Pagination.Next 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                          />
                          <Pagination.Last 
                            onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.limit))}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                          />
                        </Pagination>
                      </div>
                    )}

                    {/* Results info */}
                    {pagination && (
                      <div className="text-center text-muted mt-2">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                      </div>
                    )}
                  </>
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

        {/* Filter Modal */}
        <AssignmentFilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={searchParams}
        />
        </Container>
      </div>
    </MainLayout>
  );
};

export default DeviceAssignments;
