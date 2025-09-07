# Device Assignment Feature

This document explains the device assignment functionality that allows administrators to assign devices to beneficiaries.

## Overview

The device assignment feature provides a comprehensive interface for managing the relationship between devices and beneficiaries. Administrators can view all current assignments, assign devices to beneficiaries, and unassign devices from their current beneficiaries.

## Features

### 1. Device Assignment Management
- **View Assignments**: Display all device assignments in a table format with filtering and search capabilities
- **Assign Devices**: Assign available devices to beneficiaries through a user-friendly modal
- **Unassign Devices**: Remove devices from their current beneficiaries
- **Real-time Updates**: Automatic refresh of data after assignment operations

### 2. Statistics Dashboard
- **Total Assignments**: Count of all device assignments
- **Active Assignments**: Count of currently active assignments
- **Available Devices**: Count of devices not currently assigned
- **Available Beneficiaries**: Count of beneficiaries not currently assigned to devices

### 3. Search and Filtering
- **Search**: Search assignments by device name, MAC address, beneficiary name, or email
- **Status Filter**: Filter by active, inactive, or all assignments
- **Real-time Filtering**: Instant results as you type

## Components

### 1. DeviceAssignments Page (`/device-management/device-assignments`)
The main page component that displays all device assignments with:
- **MainLayout Integration**: Uses the standard MainLayout with sidebar and header
- **Breadcrumb Navigation**: Proper breadcrumb showing "Device Management > Device Assignments"
- **Statistics Cards**: Shows key metrics (total assignments, active assignments, available devices, available beneficiaries)
- **Search and Filter Controls**: Real-time search and status filtering
- **Assignment Table**: Displays device and beneficiary information with action buttons
- **Action Buttons**: Unassign devices with confirmation

### 2. DeviceAssignmentModal Component
A modal component that handles both assignment and unassignment operations:
- **Assign Mode**: Select device and beneficiary from dropdowns
- **Unassign Mode**: Confirm unassignment with optional notes
- **Form Validation**: Ensures required fields are selected
- **Error Handling**: Displays API errors and validation messages

### 3. Redux State Management
- **deviceAssignmentSlice**: Manages assignment state and API operations
- **API Integration**: Handles all CRUD operations for assignments
- **Error Handling**: Consistent error handling across all operations

## API Endpoints

The feature uses the following API endpoints:

```
GET    /api/v1/devices/assignments         # Get all assignments
POST   /api/v1/devices/assignments         # Create new assignment (assign device to beneficiary)
PUT    /api/v1/devices/assignments/:id     # Update assignment
DELETE /api/v1/devices/assignments/:id     # Delete assignment
POST   /api/v1/devices/assignments/:id/unassign # Unassign device from beneficiary
```

### API Request/Response Format

**Get Assignments Response:**
```json
{
  "data": [
    {
      "id": "assignment-uuid",
      "device_id": "device-uuid", 
      "beneficiary_id": "beneficiary-uuid",
      "assigned_at": "2024-01-15T10:30:00Z",
      "unassigned_at": null,
      "assigned_by": "admin@example.com",
      "notes": "Device assigned for study",
      "is_active": true,
      "device": { /* device object */ },
      "beneficiary": { /* beneficiary object */ }
    }
  ],
  "pagination": {
    "limit": 10,
    "page": 1,
    "total": 0
  }
}
```

**Create Assignment Request:**
```json
{
  "assigned_by": "admin@example.com",
  "beneficiary_id": "44ea187e-fc3d-4663-afc6-4ce2518afbc5",
  "device_id": "1b60bf60-f88c-4fc3-9109-5f98cea1bb2f",
  "notes": "Device assigned for digital literacy study"
}
```

**Unassign Device Request:**
```json
{
  "note": "the unassignment note"
}
```

## Data Models

### DeviceAssignment Interface
```typescript
interface DeviceAssignment {
  id: string;
  device_id: string;
  beneficiary_id: string;
  assigned_at: string;
  unassigned_at?: string | null;
  assigned_by: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  device?: Device;
  beneficiary?: Beneficiary;
}
```

## Usage

### Assigning a Device
1. Navigate to Device Management > Device Assignments
2. Click "Assign Device" button
3. Select a device from the dropdown (only unassigned devices are shown)
4. Select a beneficiary from the dropdown (only unassigned beneficiaries are shown)
5. Add optional notes
6. Click "Assign Device" to confirm

### Unassigning a Device
1. Find the assignment in the table
2. Click the unassign button (warning icon) in the Actions column
3. Add optional notes explaining the reason for unassignment
4. Click "Unassign Device" to confirm

### Viewing Assignments
- Use the search box to find specific assignments
- Use the status filter to show only active or inactive assignments
- View assignment details including dates, notes, and related device/beneficiary information

## Error Handling

The feature includes comprehensive error handling:
- **API Errors**: Displayed to users with clear error messages
- **Validation Errors**: Form validation prevents invalid submissions
- **Loading States**: Visual feedback during API operations
- **Success Feedback**: Confirmation when operations complete successfully

## Security

- All operations require authentication [[memory:3876780]]
- API requests include proper authentication headers
- Form validation prevents invalid data submission
- Error messages don't expose sensitive information

## Responsive Design

The interface is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

All components use Bootstrap classes for consistent styling and responsive behavior.

## Future Enhancements

Potential improvements for future versions:
- Bulk assignment operations
- Assignment history tracking
- Email notifications for assignments
- Assignment scheduling
- Advanced reporting and analytics
