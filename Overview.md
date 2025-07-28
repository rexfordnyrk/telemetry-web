# Overview Dashboard - Complete Widget Documentation

This document provides a comprehensive overview of all widgets on the Overview dashboard page, their purposes, and the exact data structures required to initialize them through API calls.

## Dashboard Layout Structure

The Overview dashboard is organized into 4 main rows with responsive column layouts:

### Global Filter Controls
**Purpose**: Provides dashboard-wide filtering capabilities for time periods and programme selection.
**Features**: 
- Time period selection (Today, Last Week, Last Month, Last Year)
- Programme filtering (All Programmes, Digital Literacy, Skills Training, Financial Education, Health Awareness, Youth Development)
- Apply button to trigger filter updates across all widgets

---

## Widget Details & Arrangement

### **Row 1: Primary Metrics Dashboard** (5 widgets)

#### 1. ConfigurableWelcomeCard - Active Devices Overview
**Position**: Col xxl={4} (left column, spans 4/12 width)
**Purpose**: Primary welcome interface displaying user information and key device metrics
**Features**: 
- User greeting with avatar display
- Active device count with progress visualization
- Sync success rate percentage with progress bar
- Customizable labels and optional welcome imagery
- Real-time progress indicators for system health

#### 2. IconAreaChartWidget - Average Screentime
**Position**: Col xl={6} xxl={2} (responsive column)
**Purpose**: Tracks and visualizes average daily screentime across all monitored devices
**Features**:
- Area chart showing screentime progression over 9-month period
- Percentage change indicator with directional arrows
- Material icon integration for visual context
- Monthly trend analysis with color-coded progress
- Responsive design for different screen sizes

#### 3. IconAreaChartWidget - Average Network Usage
**Position**: Col xl={6} xxl={2} (responsive column)
**Purpose**: Monitors data consumption patterns and network usage trends
**Features**:
- Area chart visualization for data usage over time
- GB-based metrics with precise measurements
- Growth percentage tracking with trend indicators
- Network-specific icon styling and branding
- Monthly consumption comparison analytics

#### 4. IconAreaChartWidget - Most Used Application
**Position**: Col xl={6} xxl={2} (responsive column)
**Purpose**: Highlights the application with highest usage time and displays usage trends
**Features**:
- Custom application icon/image display (WhatsApp example)
- Usage time tracking in hours with detailed metrics
- Monthly change tracking with percentage growth
- Application-specific branding colors and styling
- Integration with app usage analytics

#### 5. IconRadialChartWidget - App Sessions Synced
**Position**: Col xl={6} xxl={2} (responsive column)
**Purpose**: Displays synchronization success rate for application session data
**Features**:
- Radial progress chart showing sync completion percentage
- Session count display with formatted numbers (42.5K format)
- Company logo/branding integration
- Sync performance metrics with growth indicators
- Real-time synchronization status monitoring

---

### **Row 2: Advanced Analytics Section** (4 widgets)

#### 6. UsageStatsByProgrammeWidget - Programme Analytics
**Position**: Col xxl={8} lg={12} (main content area, 8/12 width)
**Purpose**: Advanced analytics widget for usage statistics filtered by programmes and data points
**Features**:
- Multi-select programme filtering with toggle behavior
- Single data point selection (App Sessions, Network Usage, Screentime)
- Bar chart visualization with programme-specific colors
- Peity donut chart summaries for quick insights
- Apply-to-update functionality with real-time chart updates
- Responsive layout adaptation for different selection counts
- Custom dropdown interface with visual selection indicators

#### 7. IconBarChartWidget - Most Visited Application
**Position**: Col md={6} (nested in row, half-width)
**Purpose**: Tracks which application receives the most user visits/opens
**Features**:
- Bar chart progression showing visit frequency
- Visit count metrics with precise measurements
- Monthly comparison data with trend analysis
- Material icon integration for app identification
- Percentage change tracking with directional indicators

#### 8. IconLineChartWidget - Top Data Consumer
**Position**: Col sm={6} (nested in row, half-width)
**Purpose**: Identifies the application consuming the most network data
**Features**:
- Line chart trend visualization for data consumption
- Data consumption measurements in GB format
- Percentage change tracking with monthly comparisons
- Application-specific icon integration
- Trend analysis with color-coded growth indicators

#### 9. StatCard - Highest Participant Screentime
**Position**: Below nested widgets in Row 2
**Purpose**: Highlights the individual participant with maximum device usage time
**Features**:
- Individual participant focus with personal metrics
- Embedded area chart for usage trend visualization
- Time-based metrics with precise hour tracking
- Personal achievement and usage pattern tracking
- ApexCharts integration for detailed analytics

---

### **Row 3: Top Rankings & System Metrics** (3 widgets)

#### 10. SocialRevenueWidget - Top 5 Used Applications
**Position**: Col xl={6} xxl={4} (left column, 4/12 width)
**Purpose**: Ranks the five most frequently used applications with detailed usage metrics
**Features**:
- Application ranking list with custom icons
- Usage time per application with precise measurements
- Application category classification
- Change percentage tracking with up/down trend indicators
- Total usage summary with monthly change indicators
- Individual app performance metrics

#### 11. DataConsumerAppsWidget - Top 5 Data Consumer Applications
**Position**: Col xl={6} xxl={4} (center column, 4/12 width)
**Purpose**: Lists applications that consume the most network data with consumption analytics
**Features**:
- Data consumption ranking in GB format
- Application icons and category classification
- Consumption trend analysis with percentage changes
- Total data consumption summary
- Monthly growth/decline tracking per application
- Network usage optimization insights

#### 12. CampaignStatsWidget - Device Sync Statistics
**Position**: Col xl={6} xxl={4} (right column, 4/12 width)
**Purpose**: Comprehensive grid displaying various device synchronization and performance metrics
**Features**:
- Multi-metric display (7 different sync statistics)
- Percentage-based progress indicators for each metric
- Color-coded performance status (success/warning/danger)
- Material icon representation for each metric type
- Grid layout for optimal space utilization
- Real-time sync performance monitoring

---

### **Row 4: Usage Distribution & Activity Monitoring** (2 widgets)

#### 13. DeviceTypeWidget - App vs Background Usage Analysis
**Position**: Col xl={6} xxl={4} (left column, 4/12 width)
**Purpose**: Analyzes the distribution between active application usage and background data consumption
**Features**:
- Donut chart visualization for usage distribution
- Percentage split display between active and background usage
- Total data usage summary with precise measurements
- Active vs passive usage comparison analytics
- Color-coded segments for visual distinction
- Usage pattern optimization insights

#### 14. BeneficiaryActivityWidget - Participant Activity Overview
**Position**: Col xxl={8} lg={12} (main content area, 8/12 width)
**Purpose**: Displays comprehensive participant activity and engagement overview in tabular format
**Features**:
- Participant list with detailed activity metrics
- Most used app tracking with screentime measurements
- Most visited app analysis with visit counts
- Top data consuming app identification
- Last synchronization timestamp tracking
- Filterable and searchable table interface
- Individual participant performance analytics
- App icon integration for visual identification

---

## Filter System Integration

All widgets respond to the global filter controls:
- **Time Period Filter**: Affects data ranges for all temporal analytics
- **Programme Filter**: Impacts programme-specific widgets and multi-programme displays
- **Real-time Updates**: Widgets update automatically when filters are applied

## Responsive Design Features

- **Bootstrap Grid System**: All widgets use responsive column classes
- **Adaptive Layouts**: Widgets adjust to different screen sizes
- **Mobile Optimization**: Touch-friendly interfaces and responsive text sizing
- **Flexible Charts**: ApexCharts automatically resize based on container dimensions

## Technical Integration Points

- **ApexCharts**: Primary charting library for all visualizations
- **Peity Charts**: Used for small donut charts in summary sections
- **React Bootstrap**: Component library for UI elements
- **Material Icons**: Icon system for consistent visual language
- **Responsive Images**: Optimized app icons and avatars for performance
