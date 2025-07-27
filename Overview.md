# Overview Dashboard - Widget Documentation

This document provides a comprehensive overview of all widgets on the Overview dashboard page, their purposes, and the data structures required to initialize them.

## Dashboard Layout Structure

The Overview dashboard is organized into 4 main rows with responsive column layouts:

### Row 1: Primary Metrics (5 widgets)
1. **Active Devices Card** - Main welcome card with device statistics
2. **Average Screentime** - Area chart showing screentime trends  
3. **Average Network Usage** - Area chart displaying data consumption
4. **Most Used App** - Area chart for top application usage
5. **App Sessions Synced** - Radial chart for session synchronization stats

### Row 2: Detailed Analytics (4 widgets)
6. **Usage Stats by Programme** - Complex multi-selection analytics widget
7. **Most Visited App** - Bar chart for app visit frequency
8. **Top Data Consumer** - Line chart for data consumption leader
9. **Highest Participant Screentime** - Stat card with area chart

### Row 3: Top Lists & Device Stats (3 widgets)
10. **Top 5 Used Apps** - Social revenue style list widget
11. **Top 5 Data Consumer Apps** - Data consumption ranking widget
12. **Device Sync Stats** - Campaign stats grid for sync metrics

### Row 4: Usage Analysis & Activity (2 widgets)
13. **App vs Background Usage** - Donut chart for usage distribution
14. **Beneficiary Activity Overview** - Table widget for participant activity

---

## Widget Details & Purposes

### 1. ConfigurableWelcomeCard
**Purpose**: Primary dashboard greeting with key device metrics and sync success rates.
**Features**: 
- Displays user name and avatar
- Shows active device count and sync success percentage
- Progress bars for visual metrics
- Optional welcome image

### 2. IconAreaChartWidget (Average Screentime)
**Purpose**: Tracks average daily screentime across all devices with trend visualization.
**Features**:
- Area chart showing screentime progression
- Percentage change indicator
- Material icon for visual context
- Monthly comparison data

### 3. IconAreaChartWidget (Average Network Usage) 
**Purpose**: Monitors data consumption patterns and trends.
**Features**:
- Area chart for data usage visualization
- GB-based metrics display
- Growth percentage tracking
- Network-specific styling

### 4. IconAreaChartWidget (Most Used App)
**Purpose**: Highlights the application with highest usage time and trends.
**Features**:
- App-specific icon/image display
- Usage time in hours
- Monthly change tracking
- Custom app branding colors

### 5. IconRadialChartWidget (App Sessions Synced)
**Purpose**: Shows synchronization success rate for app session data.
**Features**:
- Radial progress indicator
- Session count display
- Logo/branding integration
- Sync performance metrics

### 6. UsageStatsByProgrammeWidget
**Purpose**: Advanced analytics for usage statistics filtered by programmes and data points.
**Features**:
- Multi-select programme filtering
- Single data point selection
- Bar chart visualization
- Peity donut summaries
- Apply-to-update functionality

### 7. IconBarChartWidget (Most Visited App)
**Purpose**: Tracks which application receives the most user visits/opens.
**Features**:
- Bar chart progression
- Visit count metrics
- Monthly comparison data
- Material icon integration

### 8. IconLineChartWidget (Top Data Consumer)
**Purpose**: Identifies the application consuming the most network data.
**Features**:
- Line chart trend visualization
- Data consumption in GB
- Percentage change tracking
- Data-specific styling

### 9. StatCard (Highest Participant Screentime)
**Purpose**: Highlights the participant with maximum device usage time.
**Features**:
- Individual participant focus
- Embedded area chart
- Time-based metrics
- Personal achievement tracking

### 10. SocialRevenueWidget (Top 5 Used Apps)
**Purpose**: Ranks the five most frequently used applications with detailed metrics.
**Features**:
- Application list with icons
- Usage time per app
- Category classification
- Change percentage tracking
- Up/down trend indicators

### 11. DataConsumerAppsWidget (Top 5 Data Consumer Apps)
**Purpose**: Lists applications that consume the most network data.
**Features**:
- Data consumption ranking
- GB-based measurements
- App icons and categories
- Consumption trend analysis

### 12. CampaignStatsWidget (Device Sync Stats)
**Purpose**: Comprehensive grid showing various device synchronization and performance metrics.
**Features**:
- Multi-metric display (apps, sessions, network, screen, events, sync time, failures)
- Percentage-based progress indicators
- Color-coded performance status
- Material icon representation

### 13. DeviceTypeWidget (App vs Background Usage)
**Purpose**: Analyzes the distribution between active app usage and background data consumption.
**Features**:
- Donut chart visualization
- Percentage split display
- Total data usage summary
- Active vs passive usage comparison

### 14. BeneficiaryActivityWidget
**Purpose**: Displays recent participant activity and engagement overview.
**Features**:
- Participant list with avatars
- Activity status tracking
- Last activity timestamps
- Programme participation data
- Filterable/searchable table

---

## Filter Controls

**Purpose**: Global filtering system for the entire dashboard.
**Features**:
- Time period selection (Today, Last Week, Last Month, Last Year)
- Programme-based filtering (All Programmes, Digital Literacy, Skills Training, etc.)
- Apply button for filter activation
- Affects multiple widgets simultaneously
