import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Row, Col, Form, Badge, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDevices } from '../store/slices/deviceSlice';
import { buildApiUrl, getAuthHeaders } from '../config/api';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Interface for API response
interface LastKnownLocationResponse {
  success: boolean;
  message: string;
  count: number;
  data: DeviceLocationData[];
}

// Interface for individual device location data from API
interface DeviceLocationData {
  device_id: string;
  device_name: string;
  location: {
    id: number;
    device_id: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    speed: number;
    direction: number | null;
    timestamp: string;
    country: string;
    administrative_area: string;
    locality: string;
    sub_locality: string;
    street: string;
    postal_code: string;
    display_name: string;
  };
  last_seen: string;
  is_online: boolean;
}

// Interface for processed device location data for UI
interface DeviceLocation {
  id: string;
  device_name: string;
  latitude: number;
  longitude: number;
  last_seen: string;
  accuracy: number;
  altitude: number;
  speed: number;
  direction: number | null;
  country: string;
  administrative_area: string;
  locality: string;
  sub_locality: string;
  street: string;
  postal_code: string;
  display_name: string;
  is_online: boolean;
  organization: string;
  programme: string;
  status: 'online' | 'offline' | 'warning';
}

// Component to handle map view updates
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const DeviceTracking: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get devices and token from Redux store
  const { devices } = useAppSelector((state) => state.devices);
  const token = useAppSelector((state) => state.auth.token);
  
  // State for tracking data and filters
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);

  // Fetch devices on component mount
  useEffect(() => {
    dispatch(fetchDevices({}));
  }, [dispatch]);

  // Fetch last known locations from API
  const fetchLastKnownLocations = useCallback(async () => {
    if (!token) {
      console.log('DeviceTracking: No authentication token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = buildApiUrl('/api/v1/location-analytics/devices/last-known');
      const headers = getAuthHeaders(token);
      console.log('DeviceTracking: Making API request to:', url);
      console.log('DeviceTracking: Using token:', token.substring(0, 20) + '...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: LastKnownLocationResponse = await response.json();
      
      if (data.success && data.data) {
        // Process API data to match our UI interface
        const processedLocations: DeviceLocation[] = data.data.map((item) => {
          // Find corresponding device info from Redux store
          const deviceInfo = devices.find(d => d.id === item.device_id);
          
          // Determine status based on is_online and last_seen
          let status: 'online' | 'offline' | 'warning' = 'offline';
          if (item.is_online) {
            status = 'online';
          } else {
            // Check if last seen is within last 5 minutes for warning status
            const lastSeenTime = new Date(item.last_seen).getTime();
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            if (lastSeenTime > fiveMinutesAgo) {
              status = 'warning';
            }
          }
          
          return {
            id: item.device_id,
            device_name: item.device_name,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            last_seen: item.last_seen,
            accuracy: item.location.accuracy,
            altitude: item.location.altitude,
            speed: item.location.speed,
            direction: item.location.direction,
            country: item.location.country,
            administrative_area: item.location.administrative_area,
            locality: item.location.locality,
            sub_locality: item.location.sub_locality,
            street: item.location.street,
            postal_code: item.location.postal_code,
            display_name: item.location.display_name,
            is_online: item.is_online,
            organization: deviceInfo?.organization || 'Unknown',
            programme: deviceInfo?.programme || 'Unknown',
            status
          };
        });
        
        setDeviceLocations(processedLocations);
        
        // Set map center to average of all device locations
        if (processedLocations.length > 0) {
          const avgLat = processedLocations.reduce((sum, loc) => sum + loc.latitude, 0) / processedLocations.length;
          const avgLng = processedLocations.reduce((sum, loc) => sum + loc.longitude, 0) / processedLocations.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(10);
        }
      } else {
        setError('Failed to fetch device locations');
      }
    } catch (err) {
      console.error('Error fetching last known locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch device locations');
    } finally {
      setLoading(false);
    }
  }, [token, devices]);

  // Fetch location data when component mounts and when devices are loaded
  useEffect(() => {
    if (devices.length > 0) {
      fetchLastKnownLocations();
    }
  }, [devices, fetchLastKnownLocations]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing device locations...');
      fetchLastKnownLocations();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchLastKnownLocations]);

  // Filter devices based on selected criteria
  const filteredDevices = deviceLocations.filter(device => {
    if (selectedOrganization && device.organization !== selectedOrganization) return false;
    if (selectedProgramme && device.programme !== selectedProgramme) return false;
    if (selectedStatus && device.status !== selectedStatus) return false;
    return true;
  });

  // Get unique organizations and programmes for filters
  const organizations = Array.from(new Set(deviceLocations.map(d => d.organization)));
  const programmes = Array.from(new Set(deviceLocations.map(d => d.programme)));

  // Get status counts
  const statusCounts = {
    online: deviceLocations.filter(d => d.status === 'online').length,
    offline: deviceLocations.filter(d => d.status === 'offline').length,
    warning: deviceLocations.filter(d => d.status === 'warning').length,
  };



  // Create custom marker icon
  const createCustomIcon = (status: string) => {
    return new Icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      className: `device-marker-${status}`,
    });
  };

  // Show loading state
  if (loading && deviceLocations.length === 0) {
    return (
      <MainLayout>
        <div className="main-content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="text-center">
              <Spinner animation="border" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
              <h5>Loading device locations...</h5>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="main-content">
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error Loading Device Locations</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={fetchLastKnownLocations}>
              Try Again
            </Button>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="main-content">
        {/* Page Header */}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="breadcrumb-title pe-3">Device Tracking</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/">
                      <i className="bx bx-home-alt"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/device-management/devices">Device Management</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Device Tracking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Status Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-success">
              <Card.Body className="text-center">
                <h4 className="text-success mb-1">{statusCounts.online}</h4>
                <p className="text-muted mb-0">Online Devices</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-danger">
              <Card.Body className="text-center">
                <h4 className="text-danger mb-1">{statusCounts.offline}</h4>
                <p className="text-muted mb-0">Offline Devices</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-warning">
              <Card.Body className="text-center">
                <h4 className="text-warning mb-1">{statusCounts.warning}</h4>
                <p className="text-muted mb-0">Warning Devices</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-info">
              <Card.Body className="text-center">
                <h4 className="text-info mb-1">{deviceLocations.length}</h4>
                <p className="text-muted mb-0">Total Devices</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Controls */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Organization</Form.Label>
                  <Form.Select 
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                  >
                    <option value="">All Organizations</option>
                    {organizations.map(org => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Programme</Form.Label>
                  <Form.Select 
                    value={selectedProgramme}
                    onChange={(e) => setSelectedProgramme(e.target.value)}
                  >
                    <option value="">All Programmes</option>
                    {programmes.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="warning">Warning</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Auto Refresh</Form.Label>
                  <Form.Select 
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <div>
                    <Form.Check
                      type="switch"
                      id="auto-refresh-switch"
                      label="Auto Refresh"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <div className="text-end">
                  <Badge bg="info" className="me-2">
                    {filteredDevices.length} Devices
                  </Badge>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={fetchLastKnownLocations}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="material-icons-outlined">refresh</i> Refresh
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Map Container */}
        <Card>
          <Card.Body className="p-0">
            <div style={{ height: '600px', width: '100%' }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="device-tracking-map"
              >
                <MapUpdater center={mapCenter} zoom={mapZoom} />
                
                {/* OpenStreetMap tiles */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Device markers */}
                {filteredDevices.map((device) => (
                  <Marker
                    key={device.id}
                    position={[device.latitude, device.longitude]}
                    icon={createCustomIcon(device.status)}
                  >
                    <Popup>
                      <div className="device-popup">
                        <h6>{device.device_name}</h6>
                        <p><strong>Status:</strong> 
                          <Badge 
                            bg={device.status === 'online' ? 'success' : device.status === 'offline' ? 'danger' : 'warning'}
                            className="ms-2"
                          >
                            {device.status}
                          </Badge>
                        </p>
                        <p><strong>Last Seen:</strong> {format(new Date(device.last_seen), 'MMM dd, yyyy HH:mm:ss')}</p>
                        <p><strong>Coordinates:</strong> {device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}</p>
                        <p><strong>Accuracy:</strong> {device.accuracy}m</p>
                        <p><strong>Speed:</strong> {device.speed} m/s</p>
                        {device.direction !== null && <p><strong>Direction:</strong> {device.direction}°</p>}
                        <p><strong>Location:</strong> {device.display_name}</p>
                        <p><strong>Organization:</strong> {device.organization}</p>
                        <p><strong>Programme:</strong> {device.programme}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Device List Table */}
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Device Locations</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table className="table table-hover">
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                    <th>Coordinates</th>
                    <th>Accuracy</th>
                    <th>Speed</th>
                    <th>Direction</th>
                    <th>Location</th>
                    <th>Organization</th>
                    <th>Programme</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <strong>{device.device_name}</strong>
                      </td>
                      <td>
                        <Badge 
                          bg={device.status === 'online' ? 'success' : device.status === 'offline' ? 'danger' : 'warning'}
                        >
                          {device.status}
                        </Badge>
                      </td>
                      <td>{format(new Date(device.last_seen), 'MMM dd, yyyy HH:mm:ss')}</td>
                      <td>
                        {device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}
                      </td>
                      <td>{device.accuracy}m</td>
                      <td>{device.speed} m/s</td>
                      <td>{device.direction !== null ? `${device.direction}°` : '-'}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={device.display_name}>
                          {device.display_name}
                        </div>
                      </td>
                      <td>{device.organization}</td>
                      <td>{device.programme}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DeviceTracking;
