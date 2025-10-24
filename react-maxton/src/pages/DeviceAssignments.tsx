import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Form, InputGroup, Pagination } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchDeviceAssignments, 
  fetchAssignmentsPage,
  selectDeviceAssignments, 
  selectDeviceAssignmentsLoading, 
  selectDeviceAssignmentsError,
  selectActiveDeviceAssignments,
  selectDeviceAssignmentsSearchParams,
  selectDeviceAssignmentsPagination,
  selectAssignmentsPageData,
  selectBasicStats,
  selectPagePagination,
  selectActivePageAssignments,
  clearSearchParams
} from '../store/slices/deviceAssignmentSlice';
import { fetchDevices, fetchUnassignedDevices } from '../store/slices/deviceSlice';
import { fetchBeneficiaries, fetchUnassignedBeneficiaries } from '../store/slices/beneficiarySlice';
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
  const pageData = useAppSelector(selectAssignmentsPageData);
  const basicStats = useAppSelector(selectBasicStats);
  const pagePagination = useAppSelector(selectPagePagination);
  const activeAssignments = useAppSelector(selectActivePageAssignments);
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
    dispatch(fetchAssignmentsPage({ page: 1, limit: 100 }));
    dispatch(fetchDevices({}));
    dispatch(fetchBeneficiaries({}));
    // Fetch unassigned devices and beneficiaries for assignment modal
    dispatch(fetchUnassignedDevices(''));
    dispatch(fetchUnassignedBeneficiaries(''));
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
    dispatch(fetchAssignmentsPage({ page, limit: 100 }));
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setQuickSearch('');
    dispatch(clearSearchParams());
    dispatch(fetchAssignmentsPage({ page: 1, limit: 100 }));
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
    // Create a device object from the assignment data
    const deviceObj = {
      id: assignment.device_id,
      device_name: assignment.device_name,
      mac_address: assignment.mac_address,
      current_beneficiary: {
        id: assignment.beneficiary_id,
        name: assignment.beneficiary_name,
        email: assignment.beneficiary_email
      }
    };
    
    // Create a beneficiary object from the assignment data
    const beneficiaryObj = {
      id: assignment.beneficiary_id,
      name: assignment.beneficiary_name,
      email: assignment.beneficiary_email
    };
    
    setSelectedDevice(deviceObj as any);
    setSelectedBeneficiary(beneficiaryObj as any);
    setShowUnassignModal(true);
  };

  /**
   * Handle successful assignment/unassignment
   */
  const handleAssignmentSuccess = () => {
    // Refresh assignments data
    dispatch(fetchAssignmentsPage({ page: 1, limit: 100 }));
    dispatch(fetchDevices({}));
    dispatch(fetchBeneficiaries({}));
    // Refresh unassigned data for assignment modal
    dispatch(fetchUnassignedDevices(''));
    dispatch(fetchUnassignedBeneficiaries(''));
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
                    <h4 className="mb-0">{basicStats?.total_assignments || 0}</h4>
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
                    <h4 className="mb-0">{basicStats?.active_assignments || 0}</h4>
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
                    <h4 className="mb-0">{basicStats?.available_devices || 0}</h4>
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
                    <p className="text-uppercase fw-medium text-muted mb-0">Unassigned Participants</p>
                    <h4 className="mb-0">{basicStats?.unassigned_participants || 0}</h4>
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
                ) : pageData.length === 0 ? (
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
                            <th>Organization</th>
                            <th>Assigned Date</th>
                            <th>Last Synced</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageData.map((assignment) => (
                          <tr key={assignment.assignment_id}>
                            <td>
                              <div>
                                <strong>{assignment.device_name || 'Unknown Device'}</strong>
                                <br />
                                <small className="text-muted">
                                  {assignment.mac_address || 'N/A'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {assignment.android_version} • {assignment.app_version}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{assignment.beneficiary_name || 'No beneficiary'}</strong>
                                <br />
                                <small className="text-muted">
                                  {assignment.beneficiary_email || 'N/A'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {assignment.beneficiary_district}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{assignment.device_organization}</strong>
                                <br />
                                <small className="text-muted">
                                  {assignment.device_programme}
                                </small>
                              </div>
                            </td>
                            <td>
                              {formatDate(assignment.assigned_at)}
                            </td>
                            <td>
                              {assignment.last_synced ? formatDate(assignment.last_synced) : '-'}
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(assignment.assignment_is_active)}>
                                {assignment.assignment_is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <div style={{ maxWidth: '200px' }}>
                                {assignment.assignment_notes ? (
                                  <span 
                                    className="text-truncate d-inline-block" 
                                    style={{ maxWidth: '100%' }}
                                    title={assignment.assignment_notes}
                                  >
                                    {assignment.assignment_notes}
                                  </span>
                                ) : (
                                  <span className="text-muted">No notes</span>
                                )}
                              </div>
                            </td>
                            <td>
                              {assignment.assignment_is_active && (
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
                    {pagePagination && pagePagination.total > pagePagination.limit && (
                      <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                          <Pagination.First 
                            onClick={() => handlePageChange(1)}
                            disabled={!pagePagination.has_prev}
                          />
                          <Pagination.Prev 
                            onClick={() => handlePageChange(pagePagination.page - 1)}
                            disabled={!pagePagination.has_prev}
                          />
                          
                          {/* Page numbers */}
                          {Array.from({ length: pagePagination.total_pages }, (_, i) => i + 1)
                            .filter(page => {
                              const current = pagePagination.page;
                              return page === 1 || page === pagePagination.total_pages || 
                                     (page >= current - 2 && page <= current + 2);
                            })
                            .map((page, index, array) => {
                              if (index > 0 && page - array[index - 1] > 1) {
                                return (
                                  <React.Fragment key={`ellipsis-${page}`}>
                                    <Pagination.Ellipsis />
                                    <Pagination.Item 
                                      active={page === pagePagination.page}
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
                                  active={page === pagePagination.page}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </Pagination.Item>
                              );
                            })}
                          
                          <Pagination.Next 
                            onClick={() => handlePageChange(pagePagination.page + 1)}
                            disabled={!pagePagination.has_next}
                          />
                          <Pagination.Last 
                            onClick={() => handlePageChange(pagePagination.total_pages)}
                            disabled={!pagePagination.has_next}
                          />
                        </Pagination>
                      </div>
                    )}

                    {/* Results info */}
                    {pagePagination && (
                      <div className="text-center text-muted mt-2">
                        Showing {((pagePagination.page - 1) * pagePagination.limit) + 1} to {Math.min(pagePagination.page * pagePagination.limit, pagePagination.total)} of {pagePagination.total} results
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
