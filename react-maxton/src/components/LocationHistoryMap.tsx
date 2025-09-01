import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Row, Col, Form, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Interface for location data points
interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  speed?: number;
  altitude?: number;
  battery_level?: number;
  network_type?: string;
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
  // State for location data and filters
  const [locationData, setLocationData] = useState<LocationPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  
  // Default center (can be updated based on actual device location)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);

  // Initialize with mock data and set map center
  useEffect(() => {
    // Mock location data for demonstration
    // In a real application, this would come from an API call
    const mockLocationData: LocationPoint[] = [
      {
        id: '1',
        latitude: 40.7128,
        longitude: -74.0060,
        timestamp: '2024-01-15T10:00:00Z',
        accuracy: 10,
        speed: 25,
        altitude: 100,
        battery_level: 85,
        network_type: '4G'
      },
      {
        id: '2',
        latitude: 40.7140,
        longitude: -74.0080,
        timestamp: '2024-01-15T10:15:00Z',
        accuracy: 15,
        speed: 30,
        altitude: 105,
        battery_level: 83,
        network_type: '4G'
      },
      {
        id: '3',
        latitude: 40.7160,
        longitude: -74.0100,
        timestamp: '2024-01-15T10:30:00Z',
        accuracy: 12,
        speed: 0,
        altitude: 110,
        battery_level: 80,
        network_type: '4G'
      }
    ];

    if (mockLocationData.length > 0) {
      setLocationData(mockLocationData);
      setMapCenter([mockLocationData[0].latitude, mockLocationData[0].longitude]);
      setMapZoom(13);
    }
  }, []);

  // Handle time range selection
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    
    // In a real application, this would trigger an API call to fetch location data
    // based on the selected time range
    console.log('Time range changed to:', range);
  };

  // Generate polyline coordinates for the route
  const routeCoordinates: LatLngExpression[] = locationData.map(point => [
    point.latitude,
    point.longitude
  ]);

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
              <div className="text-end">
                <Badge bg="info" className="me-2">
                  {locationData.length} Points
                </Badge>
                <Badge bg="success">
                  Route Displayed
                </Badge>
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
                      {point.accuracy && <p><strong>Accuracy:</strong> {point.accuracy}m</p>}
                      {point.speed !== undefined && <p><strong>Speed:</strong> {point.speed} km/h</p>}
                      {point.altitude && <p><strong>Altitude:</strong> {point.altitude}m</p>}
                      {point.battery_level && <p><strong>Battery:</strong> {point.battery_level}%</p>}
                      {point.network_type && <p><strong>Network:</strong> {point.network_type}</p>}
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
                  <th>Battery</th>
                  <th>Network</th>
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
                    <td>{point.accuracy ? `${point.accuracy}m` : '-'}</td>
                    <td>{point.speed !== undefined ? `${point.speed} km/h` : '-'}</td>
                    <td>{point.altitude ? `${point.altitude}m` : '-'}</td>
                    <td>{point.battery_level ? `${point.battery_level}%` : '-'}</td>
                    <td>{point.network_type || '-'}</td>
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
