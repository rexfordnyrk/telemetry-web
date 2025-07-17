# Widget Mapping for Telemetry Dashboard

This document maps the available widgets from the Maxton template to the telemetry data points, including suggested text changes and required data structures.

## Overview Dashboard Widgets

### 1. Welcome/Summary Card (Large Card)
**Page**: `maxton/index.html` (Lines 1000-1050)
**Original**: Welcome back card with sales target
**Telemetry Use**: Device & Participant Summary
**Text Changes**:
- "Welcome back" → "Telemetry Overview"
- "You are the best seller of this month" → "Active data collection across all devices"
- "$168.5K" → "1,247" (Total Active Devices)
- "58% of sales target" → "89% of devices reporting data"
- "View Details" → "View Analytics"

**Data Structure**:
```json
{
  "totalActiveDevices": 1247,
  "totalBeneficiaries": 1156,
  "dataCollectionRate": 89.2,
  "lastSyncStatus": "2 hours ago",
  "trend": "+12.5%"
}
```

### 2. Metric Cards (Small Cards with Charts)
**Page**: `maxton/index.html` (Lines 1050-1100), `maxton/index2.html` (Lines 1040-1100), `maxton/widgets-data.html` (Lines 1150-1400)
**Original**: Total Orders, Total Sales, Total Visits, Bounce Rate
**Telemetry Use**: Key Performance Indicators

#### Card 1: Active Devices
**Text Changes**:
- "Total Orders" → "Active Devices"
- "248k" → "1,247"
- Icon: `shopping_cart` → `devices`

**Data Structure**:
```json
{
  "value": 1247,
  "label": "Active Devices",
  "trend": "+24%",
  "chartData": [/* time series data */],
  "icon": "devices"
}
```

#### Card 2: Data Usage
**Text Changes**:
- "Total Sales" → "Data Usage"
- "$47.6k" → "2.4TB"
- Icon: `attach_money` → `data_usage`

**Data Structure**:
```json
{
  "value": "2.4TB",
  "label": "Data Usage",
  "trend": "+14%",
  "chartData": [/* time series data */],
  "icon": "data_usage"
}
```

#### Card 3: App Sessions
**Text Changes**:
- "Total Visits" → "App Sessions"
- "189K" → "45,892"
- Icon: `visibility` → `apps`

**Data Structure**:
```json
{
  "value": 45892,
  "label": "App Sessions",
  "trend": "-35%",
  "chartData": [/* time series data */],
  "icon": "apps"
}
```

#### Card 4: Sync Success Rate
**Text Changes**:
- "Bounce Rate" → "Sync Success Rate"
- "24.6%" → "94.2%"
- Icon: `leaderboard` → `sync`

**Data Structure**:
```json
{
  "value": "94.2%",
  "label": "Sync Success Rate",
  "trend": "+18%",
  "chartData": [/* time series data */],
  "icon": "sync"
}
```

### 3. Pie Chart Widget
**Page**: `maxton/index.html` (Lines 1200-1250), `maxton/index2.html` (Lines 1200-1250), `maxton/widgets-data.html` (Lines 1400-1450)
**Original**: Order Status pie chart
**Telemetry Use**: App Usage Distribution
**Text Changes**:
- "Order Status" → "App Usage Distribution"
- "Total Sales" → "Total Usage"
- "68%" → "42%"
- Legend items: "Sales/Product/Income" → "Educational/Games/Social/Other"

**Data Structure**:
```json
{
  "title": "App Usage Distribution",
  "totalValue": "42%",
  "totalLabel": "Total Usage",
  "sections": [
    {
      "name": "Educational",
      "percentage": 42,
      "color": "primary"
    },
    {
      "name": "Games",
      "percentage": 28,
      "color": "danger"
    },
    {
      "name": "Social",
      "percentage": 18,
      "color": "success"
    },
    {
      "name": "Other",
      "percentage": 12,
      "color": "warning"
    }
  ]
}
```

### 4. Line Chart Widget
**Page**: `maxton/index.html` (Lines 1250-1300), `maxton/index2.html` (Lines 1250-1300), `maxton/widgets-data.html` (Lines 1450-1500)
**Original**: Sales & Views chart
**Telemetry Use**: Usage Trends Over Time
**Text Changes**:
- "Sales & Views" → "Usage Trends"
- Chart legend: "Sales/Views" → "App Sessions/Network Usage/Screen Time"

**Data Structure**:
```json
{
  "title": "Usage Trends",
  "chartData": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "datasets": [
      {
        "label": "App Sessions",
        "data": [1200, 1350, 1100, 1400, 1600, 1800],
        "color": "#0d6efd"
      },
      {
        "label": "Network Usage (GB)",
        "data": [45, 52, 48, 58, 65, 72],
        "color": "#198754"
      },
      {
        "label": "Screen Time (hrs)",
        "data": [120, 135, 110, 140, 160, 180],
        "color": "#fd7e14"
      }
    ]
  }
}
```

### 5. Campaign Stats Widget
**Page**: `maxton/index.html` (Lines 1300-1400)
**Original**: Campaign performance metrics
**Telemetry Use**: Sync Performance Metrics
**Text Changes**:
- "Campaign Stats" → "Sync Performance"
- "Campaigns" → "Successful Syncs"
- "Emailed" → "Failed Syncs"
- "Opened" → "Pending Syncs"
- "Clicked" → "Data Records"
- "Subscribed" → "Active Devices"
- "Spam Message" → "Offline Devices"
- "Views Mails" → "Total Records"

**Data Structure**:
```json
{
  "title": "Sync Performance",
  "metrics": [
    {
      "name": "Successful Syncs",
      "value": 54,
      "trend": "+28%",
      "icon": "sync",
      "color": "primary"
    },
    {
      "name": "Failed Syncs",
      "value": 245,
      "trend": "-15%",
      "icon": "error",
      "color": "success"
    },
    {
      "name": "Pending Syncs",
      "value": 54,
      "trend": "+30.5%",
      "icon": "pending",
      "color": "branding"
    },
    {
      "name": "Data Records",
      "value": 859,
      "trend": "-34.6%",
      "icon": "data_usage",
      "color": "warning"
    },
    {
      "name": "Active Devices",
      "value": 24758,
      "trend": "+53%",
      "icon": "devices",
      "color": "info"
    },
    {
      "name": "Offline Devices",
      "value": 548,
      "trend": "-47%",
      "icon": "offline",
      "color": "danger"
    },
    {
      "name": "Total Records",
      "value": 9845,
      "trend": "+68%",
      "icon": "database",
      "color": "deep-blue"
    }
  ]
}
```

### 6. Progress Bar Widget
**Page**: `maxton/index.html` (Lines 1400-1450)
**Original**: Visitors Growth with progress bars
**Telemetry Use**: Usage Metrics with Progress
**Text Changes**:
- "Visitors Growth" → "Usage Metrics"
- "36.7%" → "78.4%"
- "34.5%" → "12.5%"
- "Clicks/Likes/Upvotes" → "App Sessions/Network Usage/Screen Time"

**Data Structure**:
```json
{
  "title": "Usage Metrics",
  "mainValue": "78.4%",
  "trend": "+12.5%",
  "description": "Average daily usage across all devices",
  "metrics": [
    {
      "name": "App Sessions",
      "value": 2589,
      "percentage": 65,
      "color": "primary"
    },
    {
      "name": "Network Usage (MB)",
      "value": 6748,
      "percentage": 55,
      "color": "warning"
    },
    {
      "name": "Screen Time (hrs)",
      "value": 9842,
      "percentage": 45,
      "color": "info"
    }
  ]
}
```

### 7. Social Leads Widget
**Page**: `maxton/index.html` (Lines 1450-1550)
**Original**: Social media platform performance
**Telemetry Use**: App Category Performance
**Text Changes**:
- "Social Leads" → "App Categories"
- Platform names → App category names
- Performance percentages → Usage percentages

**Data Structure**:
```json
{
  "title": "App Categories",
  "categories": [
    {
      "name": "Educational",
      "percentage": 55,
      "icon": "school",
      "color": "#0d6efd"
    },
    {
      "name": "Games",
      "percentage": 67,
      "icon": "sports_esports",
      "color": "#fc185a"
    },
    {
      "name": "Social Media",
      "percentage": 78,
      "icon": "share",
      "color": "#02c27a"
    },
    {
      "name": "Productivity",
      "percentage": 46,
      "icon": "work",
      "color": "#fd7e14"
    },
    {
      "name": "Entertainment",
      "percentage": 38,
      "icon": "movie",
      "color": "#0dcaf0"
    },
    {
      "name": "Utilities",
      "percentage": 15,
      "icon": "build",
      "color": "#6f42c1"
    },
    {
      "name": "Other",
      "percentage": 12,
      "icon": "more_horiz",
      "color": "#ff00b3"
    }
  ]
}
```

### 8. Monthly Revenue Widget
**Page**: `maxton/index.html` (Lines 1100-1150)
**Original**: Monthly revenue chart
**Telemetry Use**: Monthly Usage Summary
**Text Changes**:
- "Monthly Revenue" → "Monthly Usage"
- "Average monthly sale for every author" → "Average monthly usage per device"
- "68.9%" → "76.3%"
- "34.5%" → "18.7%"

**Data Structure**:
```json
{
  "title": "Monthly Usage",
  "description": "Average monthly usage per device",
  "mainValue": "76.3%",
  "trend": "+18.7%",
  "chartData": [/* monthly usage data */]
}
```

### 9. Device Type Widget
**Page**: `maxton/index.html` (Lines 1150-1200)
**Original**: Device type distribution
**Telemetry Use**: App Category Distribution
**Text Changes**:
- "Device Type" → "App Categories"
- "Total Views" → "Total Usage"
- "Desktop/Tablet/Mobile" → "Educational/Games/Social"

**Data Structure**:
```json
{
  "title": "App Categories",
  "totalValue": "68%",
  "totalLabel": "Total Usage",
  "categories": [
    {
      "name": "Educational",
      "percentage": 35,
      "icon": "school",
      "color": "primary"
    },
    {
      "name": "Games",
      "percentage": 48,
      "icon": "sports_esports",
      "color": "danger"
    },
    {
      "name": "Social",
      "percentage": 27,
      "icon": "share",
      "color": "success"
    }
  ]
}
```

### 10. Total Accounts Widget
**Page**: `maxton/index.html` (Lines 1550-1600)
**Original**: Total accounts with chart
**Telemetry Use**: Total Devices with Activity Chart
**Text Changes**:
- "Total Accounts" → "Total Devices"
- "85,247" → "1,247"
- "23.7%" → "15.3%"

**Data Structure**:
```json
{
  "title": "Total Devices",
  "value": 1247,
  "trend": "-15.3%",
  "chartData": [/* device activity data */]
}
```

## Analytics Page Widgets

### 11. Data Table Widget
**Page**: `maxton/index.html` (Lines 1600-1700) - Can be adapted from existing table structures
**Original**: Order/product tables
**Telemetry Use**: Device/Beneficiary/App tables
**Text Changes**:
- Table headers → Telemetry-specific headers
- Data rows → Telemetry data rows

**Data Structure**:
```json
{
  "title": "Device List",
  "headers": ["Device ID", "Beneficiary", "Last Sync", "Status", "Actions"],
  "data": [
    {
      "deviceId": "DEV-001",
      "beneficiary": "John Doe",
      "lastSync": "2 hours ago",
      "status": "Online",
      "actions": ["View", "Edit", "Delete"]
    }
    // ... more rows
  ]
}
```

### 12. Advanced Charts
**Page**: `maxton/widgets-data.html` (Lines 1500-1600) - Multiple chart implementations
**Original**: Various chart types
**Telemetry Use**: Advanced analytics charts

#### Time Series Chart
**Data Structure**:
```json
{
  "title": "Usage Over Time",
  "chartType": "line",
  "data": {
    "labels": ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    "datasets": [
      {
        "label": "App Sessions",
        "data": [120, 80, 200, 350, 280, 180],
        "color": "#0d6efd"
      }
    ]
  }
}
```

#### Bar Chart
**Data Structure**:
```json
{
  "title": "Top Apps by Usage",
  "chartType": "bar",
  "data": {
    "labels": ["App 1", "App 2", "App 3", "App 4", "App 5"],
    "datasets": [
      {
        "label": "Session Count",
        "data": [1200, 980, 850, 720, 650],
        "color": "#198754"
      }
    ]
  }
}
```

#### Donut Chart
**Data Structure**:
```json
{
  "title": "Network Usage by App",
  "chartType": "doughnut",
  "data": {
    "labels": ["Educational", "Games", "Social", "Other"],
    "datasets": [
      {
        "data": [45, 25, 20, 10],
        "colors": ["#0d6efd", "#dc3545", "#198754", "#ffc107"]
      }
    ]
  }
}
```

## Real-time Widgets

### 13. Live Activity Feed
**Page**: `maxton/index.html` (Lines 1700-1800) - Notification dropdown structure
**Original**: Notification/activity feeds
**Telemetry Use**: Real-time device activity
**Text Changes**:
- Activity types → Device events
- Timestamps → Real-time timestamps

**Data Structure**:
```json
{
  "title": "Live Activity",
  "activities": [
    {
      "deviceId": "DEV-001",
      "event": "App Session Started",
      "app": "Educational App",
      "timestamp": "2 minutes ago",
      "type": "session_start"
    },
    {
      "deviceId": "DEV-002",
      "event": "Sync Completed",
      "records": 45,
      "timestamp": "5 minutes ago",
      "type": "sync_success"
    }
    // ... more activities
  ]
}
```

### 14. Status Cards
**Page**: `maxton/index.html` (Lines 1800-1900) - Can be adapted from existing card structures
**Original**: Status indicators
**Telemetry Use**: Device/System status
**Text Changes**:
- Status types → Telemetry status types

**Data Structure**:
```json
{
  "statuses": [
    {
      "name": "Online Devices",
      "count": 1247,
      "status": "online",
      "icon": "wifi"
    },
    {
      "name": "Offline Devices",
      "count": 23,
      "status": "offline",
      "icon": "wifi_off"
    },
    {
      "name": "Syncing",
      "count": 45,
      "status": "syncing",
      "icon": "sync"
    }
  ]
}
```

## API Response Structure

### Overview Dashboard API
```json
{
  "overview": {
    "totalActiveDevices": 1247,
    "totalBeneficiaries": 1156,
    "dataCollectionRate": 89.2,
    "lastSyncStatus": "2 hours ago",
    "trend": "+12.5%"
  },
  "metrics": [
    {
      "id": "active_devices",
      "value": 1247,
      "label": "Active Devices",
      "trend": "+24%",
      "chartData": [/* time series */],
      "icon": "devices"
    }
    // ... more metrics
  ],
  "charts": {
    "usageDistribution": {
      "title": "App Usage Distribution",
      "data": [/* pie chart data */]
    },
    "usageTrends": {
      "title": "Usage Trends",
      "data": [/* line chart data */]
    }
  },
  "performance": {
    "title": "Sync Performance",
    "metrics": [/* performance metrics */]
  }
}
```

### Analytics Page API
```json
{
  "analytics": {
    "timeSeries": {
      "title": "Usage Over Time",
      "data": [/* time series data */]
    },
    "topApps": {
      "title": "Top Apps by Usage",
      "data": [/* bar chart data */]
    },
    "networkUsage": {
      "title": "Network Usage by App",
      "data": [/* donut chart data */]
    }
  },
  "tables": {
    "devices": {
      "title": "Device List",
      "data": [/* table data */]
    },
    "beneficiaries": {
      "title": "Beneficiary List",
      "data": [/* table data */]
    }
  }
}
```

## Implementation Notes

1. **Chart Libraries**: The template uses ApexCharts and Chart.js. Choose based on requirements.
2. **Real-time Updates**: Use WebSocket connections for live data updates.
3. **Responsive Design**: All widgets are responsive and mobile-friendly.
4. **Theme Support**: Widgets support light/dark themes and color variations.
5. **Data Refresh**: Implement automatic data refresh every 30-60 seconds.
6. **Error Handling**: Add error states for failed API calls.
7. **Loading States**: Show loading spinners during data fetch.
8. **Filtering**: Add date range and device/beneficiary filters.
9. **Export**: Add export functionality for charts and tables.
10. **Drill-down**: Enable clicking on charts for detailed views. 