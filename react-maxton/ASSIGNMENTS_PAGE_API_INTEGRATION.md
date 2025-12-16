# Device Assignments Page API Integration

## Overview

This document describes the integration of the new Device Assignments Page API (`/api/v1/devices/assignments/page`) into the React frontend application.

## API Endpoint

**Endpoint:** `GET /api/v1/devices/assignments/page`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100, max: 100)

## Integration Changes

### 1. API Configuration (`src/config/api.ts`)

Added new endpoint to the `DEVICE_ASSIGNMENTS` section:
```typescript
DEVICE_ASSIGNMENTS: {
  // ... existing endpoints
  PAGE: '/api/v1/devices/assignments/page', // New endpoint
  // ... other endpoints
}
```

### 2. Redux Store (`src/store/slices/deviceAssignmentSlice.ts`)

#### New Types Added:
- `AssignmentPageData`: Comprehensive assignment data from the new API
- `BasicStats`: Statistics data (total_assignments, active_assignments, etc.)
- `AssignmentPagination`: Pagination metadata
- `AssignmentsPageResponse`: Complete API response structure

#### New State Properties:
- `pageData`: Array of `AssignmentPageData` objects
- `basicStats`: `BasicStats` object with key metrics
- `pagePagination`: `AssignmentPagination` object

#### New Thunk:
- `fetchAssignmentsPage`: Fetches data from the new API endpoint

#### New Selectors:
- `selectAssignmentsPageData`: Get page data
- `selectBasicStats`: Get statistics
- `selectPagePagination`: Get pagination info
- `selectActivePageAssignments`: Get active assignments from page data

### 3. UI Component (`src/pages/DeviceAssignments.tsx`)

#### Updated Data Loading:
- Now uses `fetchAssignmentsPage` instead of `fetchDeviceAssignments`
- Loads comprehensive data in a single API call

#### Enhanced Statistics Cards:
- Uses `basicStats` from API instead of calculating from local data
- Shows: Total Assignments, Active Assignments, Available Devices, Unassigned Participants

#### Improved Table Display:
- Uses `pageData` with comprehensive assignment information
- Shows additional device details (Android version, app version)
- Shows additional beneficiary details (organization, district)
- Shows organization and programme information
- Displays last sync time instead of unassigned date

#### Updated Pagination:
- Uses `pagePagination` with proper has_next/has_prev flags
- More efficient pagination controls

## API Response Structure

The new API returns comprehensive data in a single request:

```json
{
  "data": {
    "basic_stats": {
      "total_assignments": 150,
      "active_assignments": 120,
      "available_devices": 30,
      "unassigned_participants": 25
    },
    "assignments": [
      {
        "assignment_id": "uuid",
        "device_id": "uuid",
        "beneficiary_id": "uuid",
        "assigned_at": "2024-01-15T10:30:00Z",
        "unassigned_at": null,
        "assigned_by": "admin@example.com",
        "assignment_notes": "Notes about assignment",
        "assignment_is_active": true,
        // ... comprehensive device and beneficiary data
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 150,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## Benefits of the New Integration

1. **Performance**: Single API call loads all necessary data
2. **Comprehensive Data**: Rich device and beneficiary information in one request
3. **Better Statistics**: Server-calculated statistics are more accurate
4. **Efficient Pagination**: Proper pagination metadata with navigation flags
5. **Reduced Network Requests**: No need for separate calls to get device/beneficiary details

## Usage

The integration is automatically used when the DeviceAssignments page loads. The page will:

1. Load comprehensive assignment data with statistics
2. Display rich information about devices and beneficiaries
3. Show accurate statistics from the server
4. Provide efficient pagination controls
5. Support assignment and unassignment operations

## Backward Compatibility

The old `fetchDeviceAssignments` thunk and related selectors are still available for other parts of the application that might need them. The new integration is specifically for the assignments page UI.


