import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Row, Col, Form, Badge, Button, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDevices } from '../store/slices/deviceSlice';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Interface for device location data
interface DeviceLocation {
  id: string;
  device_name: string;
  latitude: number;
  longitude: number;
  last_seen: string;
  battery_level?: number;
  network_type?: string;
  is_active: boolean;
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
  
  // Get devices from Redux store
  const { devices } = useAppSelector((state) => state.devices);
  
  // State for tracking data and filters
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  
  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);

  // Fetch devices on component mount
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // Generate mock location data for devices
  useEffect(() => {
    if (devices.length > 0) {
      // Create mock location data for each device
      const mockLocations: DeviceLocation[] = devices.map((device, index) => {
        // Generate different locations for demonstration
        const baseLat = 40.7128 + (index * 0.01); // Spread devices around NYC
        const baseLng = -74.0060 + (index * 0.01);
        
        // Randomize status for demo
        const statuses: ('online' | 'offline' | 'warning')[] = ['online', 'offline', 'warning'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: device.id,
          device_name: device.device_name,
          latitude: baseLat + (Math.random() - 0.5) * 0.02, // Add some randomness
          longitude: baseLng + (Math.random() - 0.5) * 0.02,
          last_seen: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time within last hour
          battery_level: Math.floor(Math.random() * 100) + 1,
          network_type: ['4G', '3G', 'WiFi'][Math.floor(Math.random() * 3)],
          is_active: device.is_active,
          organization: device.organization,
          programme: device.programme,
          status
        };
      });
      
      setDeviceLocations(mockLocations);
      
      // Set map center to average of all device locations
      if (mockLocations.length > 0) {
        const avgLat = mockLocations.reduce((sum, loc) => sum + loc.latitude, 0) / mockLocations.length;
        const avgLng = mockLocations.reduce((sum, loc) => sum + loc.longitude, 0) / mockLocations.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(10);
      }
    }
  }, [devices]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // In a real application, this would fetch updated location data
      console.log('Refreshing device locations...');
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

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
                    onClick={() => {
                      // In a real app, this would refresh the data
                      console.log('Manual refresh triggered');
                    }}
                  >
                    <i className="material-icons-outlined">refresh</i>
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
                        {device.battery_level && <p><strong>Battery:</strong> {device.battery_level}%</p>}
                        {device.network_type && <p><strong>Network:</strong> {device.network_type}</p>}
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
                    <th>Location</th>
                    <th>Battery</th>
                    <th>Network</th>
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
                      <td>
                        {device.battery_level ? (
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                              <div 
                                className={`progress-bar ${device.battery_level > 20 ? 'bg-success' : 'bg-danger'}`}
                                style={{ width: `${device.battery_level}%` }}
                              ></div>
                            </div>
                            <small>{device.battery_level}%</small>
                          </div>
                        ) : '-'}
                      </td>
                      <td>{device.network_type || '-'}</td>
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
