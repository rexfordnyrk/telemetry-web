# Overview Dashboard - Widget Data Structures

This document defines the exact data structures needed to initialize each widget on the Overview dashboard, following the widget arrangement order.

## API Response Structure

```typescript
interface OverviewDashboardData {
  // Global filters applied
  filters: {
    period: string;           // "today" | "last_week" | "last_month" | "last_year"
    programme: string;        // "all" | programme_id
  };
  
  // Widget data in order of appearance
  activeDevicesCard: ConfigurableWelcomeCardData;
  avgScreentime: IconAreaChartData;
  avgNetworkUsage: IconAreaChartData;
  mostUsedApp: IconAreaChartData;
  appSessionsSynced: IconRadialChartData;
  usageStatsByProgramme: UsageStatsByProgrammeData;
  mostVisitedApp: IconBarChartData;
  topDataConsumer: IconLineChartData;
  highestParticipantScreentime: StatCardData;
  top5UsedApps: SocialRevenueData;
  top5DataConsumerApps: DataConsumerAppsData;
  deviceSyncStats: CampaignStatsData;
  appVsBackgroundUsage: DeviceTypeData;
  beneficiaryActivity: BeneficiaryActivityData;
}
```

---

## Individual Widget Data Structures

### 1. ConfigurableWelcomeCardData
```typescript
interface ConfigurableWelcomeCardData {
  userName: string;
  userAvatar: string;        // URL to avatar image
  primaryValue: string;      // e.g., "1,234"
  secondaryValue: string;    // e.g., "89.2%"
  primaryLabel: string;      // e.g., "Active Devices"
  secondaryLabel: string;    // e.g., "Sync Success Rate"
  primaryProgress: number;   // 0-100
  secondaryProgress: number; // 0-100
  showWelcomeImage: boolean;
}
```

### 2. IconAreaChartData (Screentime, Network Usage, Most Used App)
```typescript
interface IconAreaChartData {
  title: string;
  value: string;             // e.g., "4.2 hrs", "25.6 GB"
  changePercentage: string;  // e.g., "15.3%"
  changeDirection: "up" | "down";
  chartId: string;           // Unique identifier
  subtitle: string;
  data: number[];            // Chart data points (9 values)
  colors: string[];          // Hex color array
  gradientColors: string[];  // Gradient end colors
  icon?: string;             // Material icon name
  iconImage?: string;        // Base64 or URL for custom icon
  iconBgClass: string;       // CSS classes for icon background
}
```

### 3. IconRadialChartData (App Sessions Synced)
```typescript
interface IconRadialChartData {
  title: string;
  value: string;             // e.g., "42.5K"
  subtitle: string;
  chartId: string;
  series: number[];          // Progress values [0-100]
  colors: string[];
  gradientColors: string[];
  iconImage: string;         // URL to icon/logo
  iconBgClass: string;
}
```

### 4. UsageStatsByProgrammeData
```typescript
interface UsageStatsByProgrammeData {
  title: string;
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];      // X-axis labels (months)
  colors: string[];
  gradientColors: string[];
  chartId: string;
  peityData: {
    value: string;           // e.g., "7/10"
    color: string;
    label: string;           // Programme name
    amount: string;          // e.g., "2,847"
    percentage: string;      // e.g., "18.5%"
    amountUnit: string;      // "sessions" | "GB" | "hrs"
  }[];
  availableProgrammes: {
    id: string;
    name: string;
    color: string;
  }[];
  availableDataPoints: {
    id: string;
    name: string;
    color: string;
  }[];
}
```

### 5. IconBarChartData (Most Visited App)
```typescript
interface IconBarChartData {
  title: string;
  value: string;             // e.g., "82.7K"
  subtitle: string;
  chartId: string;
  data: number[];            // Chart values
  colors: string[];
  gradientColors: string[];
  icon: string;              // Material icon
  iconBgClass: string;
}
```

### 6. IconLineChartData (Top Data Consumer)
```typescript
interface IconLineChartData {
  title: string;
  value: string;             // e.g., "68.4 GB"
  subtitle: string;
  chartId: string;
  data: number[];            // Line chart points
  colors: string[];
  gradientColors: string[];
  icon: string;              // Material icon
  iconBgClass: string;
}
```

### 7. StatCardData (Highest Participant Screentime)
```typescript
interface StatCardData {
  title: string;
  value: string;             // e.g., "124.5 hrs"
  subtitle: string;          // Participant name and context
  changePercentage: string;  // e.g., "23.7%"
  changeDirection: "up" | "down";
  chartData: number[];       // Area chart data points
  chartColors: string[];
  chartGradientColors: string[];
  categories: string[];      // Month labels
}
```

### 8. SocialRevenueData (Top 5 Used Apps)
```typescript
interface SocialRevenueData {
  title: string;
  totalRevenue: string;      // e.g., "654 hrs"
  totalChange: string;       // e.g., "+15%"
  totalChangeDirection: "up" | "down";
  subtitle: string;
  platforms: {
    name: string;            // App name
    category: string;        // App category
    icon: string;            // URL to app icon
    revenue: string;         // Usage time
    change: string;          // Percentage change
    changeDirection: "up" | "down";
  }[];
}
```

### 9. DataConsumerAppsData (Top 5 Data Consumer Apps)
```typescript
interface DataConsumerAppsData {
  title: string;
  totalConsumption: string;  // e.g., "245.6 GB"
  totalChange: string;       // e.g., "+12.4%"
  totalChangeDirection: "up" | "down";
  subtitle: string;
  apps: {
    name: string;
    category: string;
    icon: string;            // URL to app icon
    consumption: string;     // Data usage in GB
    change: string;          // Percentage change
    changeDirection: "up" | "down";
  }[];
}
```

### 10. CampaignStatsData (Device Sync Stats)
```typescript
interface CampaignStatsData {
  title: string;
  stats: {
    title: string;           // Metric name
    value: string;           // Metric value
    percentage: string;      // Progress percentage
    icon: string;            // Material icon
    bgClass: string;         // CSS background class
    textClass: string;       // CSS text color class
  }[];
}
```

### 11. DeviceTypeData (App vs Background Usage)
```typescript
interface DeviceTypeData {
  title: string;
  centerTitle: string;       // e.g., "Total Data Usage"
  centerValue: string;       // e.g., "656.8 GB"
  series: number[];          // Donut chart values [active, background]
  labels: string[];          // ["Active Apps", "Background Usage"]
  colors: string[];
  gradientColors: string[];
  devices: {
    name: string;
    icon: string;            // Material icon
    percentage: string;      // e.g., "68%"
    iconColor: string;       // CSS color class
  }[];
}
```

### 12. BeneficiaryActivityData
```typescript
interface BeneficiaryActivityData {
  title: string;
  participants: {
    id: string;
    name: string;
    avatar: string;          // URL to participant avatar
    programme: string;       // Programme name
    lastActivity: string;    // ISO date string or relative time
    screentime: string;      // e.g., "24.5 hrs"
    dataUsage: string;       // e.g., "12.3 GB"
    appSessions: number;     // Session count
  }[];
  totalParticipants: number;
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
```

---

## Example API Response Structure

```json
{
  "filters": {
    "period": "last_month",
    "programme": "all"
  },
  "activeDevicesCard": {
    "userName": "John Anderson",
    "userAvatar": "/assets/images/avatars/01.png",
    "primaryValue": "1,234",
    "secondaryValue": "89.2%",
    "primaryLabel": "Active Devices",
    "secondaryLabel": "Sync Success Rate",
    "primaryProgress": 85,
    "secondaryProgress": 89,
    "showWelcomeImage": false
  },
  "avgScreentime": {
    "title": "Avg Screentime",
    "value": "4.2 hrs",
    "changePercentage": "15.3%",
    "changeDirection": "up",
    "chartId": "avg-screentime-chart",
    "subtitle": "rise from the last month",
    "data": [3, 5, 4, 6, 4, 5, 6, 4, 5],
    "colors": ["#ffd700"],
    "gradientColors": ["#ff8c00"],
    "icon": "schedule",
    "iconBgClass": "bg-warning bg-opacity-10 text-warning"
  },
  // ... continue for all widgets
}
```

---

## API Endpoint Requirements

### Primary Endpoint
```
GET /api/dashboard/overview
Query Parameters:
- period: string (optional, defaults to "today")
- programme: string (optional, defaults to "all")
```

### Filter Update Endpoint
```
POST /api/dashboard/overview/filter
Body: {
  "period": "last_week",
  "programme": "digital-literacy"
}
```

### Widget-Specific Endpoints (for individual updates)
```
GET /api/dashboard/overview/usage-stats-by-programme
GET /api/dashboard/overview/beneficiary-activity
POST /api/dashboard/overview/usage-stats-by-programme/filter
```

This structure ensures all widgets receive the exact data format they expect while maintaining consistency across the dashboard.
