# Device Tracking with Multi-Device Map

This document describes the new Device Tracking page that displays the current location of multiple devices simultaneously on a single interactive map.

## Overview

The Device Tracking page provides a comprehensive view of all devices' current locations using Leaflet.js with OpenStreetMap tiles. It's designed for real-time monitoring and management of device fleets.

## Features

### 🗺️ Interactive Multi-Device Map
- **Real-time Location Display**: Shows all devices on a single map
- **Status-based Markers**: Different colored markers for online, offline, and warning status
- **Detailed Popups**: Click on markers to see device information
- **Responsive Design**: Works on desktop and mobile devices

### 📊 Status Dashboard
- **Real-time Counts**: Live counts of online, offline, and warning devices
- **Total Device Count**: Overview of all tracked devices
- **Visual Status Cards**: Color-coded cards for quick status overview

### 🔍 Advanced Filtering
- **Organization Filter**: Filter devices by organization
- **Programme Filter**: Filter devices by programme
- **Status Filter**: Filter by device status (online/offline/warning)
- **Auto-refresh**: Configurable refresh intervals (10s, 30s, 1min, 5min)

### 📋 Device Information Table
- **Comprehensive List**: All device locations in tabular format
- **Battery Level Indicators**: Visual progress bars for battery status
- **Network Information**: Current network type for each device
- **Last Seen Timestamps**: When each device was last active

## Technical Implementation

### Dependencies
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@types/leaflet": "^1.9.20"
}
```

### Components
- **DeviceTracking**: Main page component
- **MapContainer**: Leaflet map container
- **TileLayer**: OpenStreetMap tile layer
- **Marker**: Individual device markers
- **Popup**: Device information display
- **Status Cards**: Dashboard summary cards
- **Filter Controls**: Advanced filtering interface

### Data Structure
```typescript
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
```

## Usage

### Accessing the Feature
1. Navigate to Device Management in the sidebar
2. Click on "Device Tracking"
3. The interactive map will load with all device locations

### Interacting with the Map
- **Zoom**: Use mouse wheel or zoom controls
- **Pan**: Click and drag to move around the map
- **Markers**: Click on device markers to see detailed information
- **Filters**: Use the filter controls to narrow down devices

### Understanding Device Status
- **🟢 Online**: Device is actively connected and reporting
- **🔴 Offline**: Device is not responding or disconnected
- **🟡 Warning**: Device has issues (low battery, poor signal, etc.)

## Features in Detail

### Auto-Refresh Functionality
- **Configurable Intervals**: 10 seconds, 30 seconds, 1 minute, or 5 minutes
- **Toggle Control**: Enable/disable auto-refresh as needed
- **Manual Refresh**: Click the refresh button for immediate updates

### Filtering Capabilities
- **Organization Filter**: Show devices from specific organizations
- **Programme Filter**: Filter by specific programmes
- **Status Filter**: Show only devices with specific status
- **Combined Filters**: Use multiple filters simultaneously

### Device Information Display
Each device marker shows:
- Device name and status
- Last seen timestamp
- GPS coordinates
- Battery level (with visual indicator)
- Network type
- Organization and programme

## Integration

### Route Configuration
The page is accessible at `/device-management/device-tracking` and is already integrated into the navigation menu under Device Management.

### Redux Integration
- Uses existing device data from Redux store
- Fetches device list on component mount
- Ready for real-time data integration

### Mock Data
Currently uses mock location data for demonstration:
- Generates random locations around New York City
- Randomizes device status, battery levels, and network types
- Updates last seen timestamps dynamically

## Customization

### Adding Real Data
To integrate with real location data:

1. **API Integration**: Replace mock data generation with API calls
2. **Real-time Updates**: Implement WebSocket or polling for live updates
3. **Location Services**: Connect to actual GPS/location services
4. **Status Monitoring**: Implement real device status monitoring

### Styling Customization
- CSS classes available in `src/index.css`
- Customize marker colors and styles
- Modify popup appearance
- Adjust map appearance and behavior

### Map Configuration
- Change default center coordinates
- Adjust zoom levels
- Modify tile layer sources
- Customize marker behavior

## Future Enhancements

### Planned Features
- **Real-time Location Updates**: Live GPS tracking
- **Geofencing**: Define and monitor geographic boundaries
- **Device Clustering**: Group nearby devices for better visualization
- **Historical Tracking**: View device movement over time
- **Export Functionality**: Download location data
- **Alert System**: Notifications for device status changes

### Performance Optimizations
- **Data Pagination**: Handle large device fleets efficiently
- **Lazy Loading**: Load map tiles on demand
- **Caching**: Cache frequently accessed location data
- **Compression**: Optimize data transfer

## Troubleshooting

### Common Issues
1. **Map Not Loading**: Check if Leaflet CSS is imported
2. **Markers Not Visible**: Verify marker icon paths
3. **Performance Issues**: Consider reducing refresh frequency for large device fleets
4. **Mobile Responsiveness**: Test on various screen sizes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers supported
- Internet Explorer not supported

## Dependencies and Setup

### Installation
The required packages are already installed:
```bash
npm install leaflet react-leaflet @types/leaflet
```

### CSS Import
Leaflet CSS is imported in the component:
```typescript
import 'leaflet/dist/leaflet.css';
```

### TypeScript Support
Full TypeScript support with proper type definitions for all Leaflet components.

## Contributing

When adding new features to the device tracking:

1. Follow the existing component structure
2. Add proper TypeScript interfaces
3. Include comprehensive error handling
4. Test on different devices and screen sizes
5. Update this documentation

## Support

For technical support or questions about the device tracking feature:
- Check the component code in `src/pages/DeviceTracking.tsx`
- Review the route configuration in `src/App.tsx`
- Refer to Leaflet.js documentation for advanced map features

The Device Tracking feature is now fully integrated and ready for use!
