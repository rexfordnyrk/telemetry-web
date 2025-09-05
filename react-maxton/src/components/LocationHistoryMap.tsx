import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Row, Col, Form, Badge, Alert, Spinner, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import { useAppSelector } from '../store/hooks';
import { buildApiUrl, getAuthHeaders } from '../config/api';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Interface for API response
interface LocationHistoryResponse {
  success: boolean;
  message: string;
  device_id: string;
  data: LocationPoint[];
  count: number;
}

// Interface for location data points (matches API response)
interface LocationPoint {
  id: number;
  device_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  direction: number;
  timestamp: string;
  country: string;
  administrative_area: string;
  locality: string;
  sub_locality: string;
  street: string;
  postal_code: string;
  display_name: string;
}

// Interface for component props
interface LocationHistoryMapProps {
  deviceId: string;
  deviceName: string;
}

// Component to handle map view updates
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const LocationHistoryMap: React.FC<LocationHistoryMapProps> = ({ deviceId, deviceName }) => {
  // Get authentication token from Redux store
  const token = useAppSelector((state) => state.auth.token);
  
  // State for location data and filters
  const [locationData, setLocationData] = useState<LocationPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [pointLimit, setPointLimit] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default center (can be updated based on actual device location)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);

  // Fetch location history data from API
  const fetchLocationHistory = useCallback(async () => {
    if (!deviceId || !token) {
      console.log('LocationHistoryMap: Missing deviceId or token', { deviceId, token: !!token });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = buildApiUrl(`/api/v1/location-analytics/devices/${deviceId}/history?limit=${pointLimit}`);
      const headers = getAuthHeaders(token);
      console.log('LocationHistoryMap: Making API request to:', url);
      console.log('LocationHistoryMap: Using token:', token.substring(0, 20) + '...');
      console.log('LocationHistoryMap: Headers:', headers);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: LocationHistoryResponse = await response.json();
      
      if (data.success && data.data) {
        setLocationData(data.data);
        
        // Set map center to first location point if available
        if (data.data.length > 0) {
          setMapCenter([data.data[0].latitude, data.data[0].longitude]);
          setMapZoom(13);
        }
      } else {
        setError('Failed to fetch location history data');
      }
    } catch (err) {
      console.error('Error fetching location history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch location history');
    } finally {
      setLoading(false);
    }
  }, [deviceId, token, pointLimit]);

  // Fetch data on component mount and when deviceId changes
  useEffect(() => {
    fetchLocationHistory();
  }, [fetchLocationHistory]);

  // Handle time range selection
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    
    // Trigger a new API call with the selected time range
    // Note: The current API doesn't support time filtering, but this is ready for future implementation
    fetchLocationHistory();
  };

  // Handle point limit change
  const handlePointLimitChange = (limit: number) => {
    setPointLimit(limit);
    // The useEffect will automatically trigger a new API call due to pointLimit dependency
  };

  // Generate polyline coordinates for the route
  const routeCoordinates: LatLngExpression[] = locationData.map(point => [
    point.latitude,
    point.longitude
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="location-history-map">
        <Card className="text-center">
          <Card.Body className="p-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Loading Location History...</h5>
            <p className="text-muted">Fetching device location data</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="location-history-map">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error Loading Location History</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-outline-danger" 
              onClick={fetchLocationHistory}
            >
              Try Again
            </button>
          </div>
        </Alert>
      </div>
    );
  }

  // Show no data state
  if (locationData.length === 0) {
    return (
      <div className="location-history-map">
        <Card className="text-center">
          <Card.Body className="p-5">
            <i className="material-icons-outlined display-1 text-muted mb-3">
              location_off
            </i>
            <h4 className="text-muted">No Location Data</h4>
            <p className="text-muted">
              No location history found for this device. Location data will appear here once the device starts reporting its position.
            </p>
            <button 
              className="btn btn-outline-primary" 
              onClick={fetchLocationHistory}
            >
              Refresh
            </button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="location-history-map">
      {/* Filters and Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Time Range</Form.Label>
                <Form.Select 
                  value={selectedTimeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Point Limit</Form.Label>
                <Form.Select 
                  value={pointLimit}
                  onChange={(e) => handlePointLimitChange(Number(e.target.value))}
                >
                  <option value={10}>10 Points</option>
                  <option value={20}>20 Points</option>
                  <option value={50}>50 Points</option>
                  <option value={100}>100 Points</option>
                  <option value={200}>200 Points</option>
                  <option value={500}>500 Points</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <div className="text-end">
                <Badge bg="info" className="me-2">
                  {locationData.length} Points
                </Badge>
                <Badge bg="success">
                  Route Displayed
                </Badge>
              </div>
            </Col>
            
            <Col md={3}>
              <div className="text-end">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={fetchLocationHistory}
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
              className="location-map"
            >
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              
              {/* OpenStreetMap tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Route line */}
              {routeCoordinates.length > 1 && (
                <Polyline
                  positions={routeCoordinates}
                  color="#007bff"
                  weight={3}
                  opacity={0.8}
                />
              )}
              
              {/* Location markers */}
              {locationData.map((point, index) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                  icon={new Icon({
                    iconUrl: require('leaflet/dist/images/marker-icon.png'),
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                  })}
                >
                  <Popup>
                    <div className="location-popup">
                      <h6>Location Point #{index + 1}</h6>
                      <p><strong>Time:</strong> {format(new Date(point.timestamp), 'MMM dd, yyyy HH:mm:ss')}</p>
                      <p><strong>Coordinates:</strong> {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}</p>
                      <p><strong>Accuracy:</strong> {point.accuracy}m</p>
                      <p><strong>Speed:</strong> {point.speed} km/h</p>
                      <p><strong>Altitude:</strong> {point.altitude}m</p>
                      <p><strong>Direction:</strong> {point.direction}°</p>
                      <p><strong>Location:</strong> {point.display_name}</p>
                      <p><strong>Country:</strong> {point.country}</p>
                      <p><strong>Region:</strong> {point.administrative_area}</p>
                      <p><strong>City:</strong> {point.locality}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Location Data Table */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Location History Details</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Coordinates</th>
                  <th>Accuracy</th>
                  <th>Speed</th>
                  <th>Altitude</th>
                  <th>Direction</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {locationData.map((point, index) => (
                  <tr key={point.id}>
                    <td>{index + 1}</td>
                    <td>{format(new Date(point.timestamp), 'MMM dd, yyyy HH:mm:ss')}</td>
                    <td>
                      {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                    </td>
                    <td>{point.accuracy}m</td>
                    <td>{point.speed} km/h</td>
                    <td>{point.altitude}m</td>
                    <td>{point.direction}°</td>
                    <td>{point.display_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LocationHistoryMap;
