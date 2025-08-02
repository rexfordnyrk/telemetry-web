/**
 * TypeScript interfaces for Overview Dashboard API response
 * These interfaces match the data structure from the API endpoint /api/v1/analytics/dashboard/overview
 */

// Global filter configuration
export interface GlobalFilters {
  selectedPeriod: string;
  selectedProgramme: string;
  availablePeriods: string[];
  availableProgrammes: string[];
}

// Individual widget data structures

export interface ConfigurableWelcomeCardData {
  primaryValue: string;
  secondaryValue: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryProgress: number;
  secondaryProgress: number;
  showWelcomeImage: boolean;
}

export interface AreaChartWidgetData {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  subtitle: string;
  data: number[];
  colors: string[];
  gradientColors: string[];
  icon?: string;
  iconImage?: string;
  iconBgClass: string;
  showDropdown: boolean;
}

export interface RadialChartWidgetData {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  series: number[];
  colors: string[];
  gradientColors: string[];
  iconImage: string;
  iconBgClass: string;
  showDropdown: boolean;
}

export interface UsageStatsByProgrammeData {
  title: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
  categories: string[];
  colors: string[];
  gradientColors: string[];
  chartId: string;
  peityData: Array<{
    value: string;
    color: string;
    label: string;
    amount: string;
    percentage: string;
    amountUnit: string;
  }>;
  availableProgrammes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  availableDataPoints: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  showDropdown: boolean;
}

export interface BarChartWidgetData {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data: number[];
  colors: string[];
  gradientColors: string[];
  icon: string;
  iconBgClass: string;
  showDropdown: boolean;
}

export interface LineChartWidgetData {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data: number[];
  colors: string[];
  gradientColors: string[];
  icon: string;
  iconBgClass: string;
  showDropdown: boolean;
}

export interface StatCardData {
  title: string;
  value: string;
  subtitle: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartData: number[];
  chartColors: string[];
  chartGradientColors: string[];
  categories: string[];
}

export interface Top5UsedAppsData {
  title: string;
  totalRevenue: string;
  totalChange: string;
  totalChangeDirection: "up" | "down";
  subtitle: string;
  platforms: Array<{
    name: string;
    category: string;
    icon: string;
    revenue: string;
    change: string;
    changeDirection: "up" | "down";
  }>;
  showDropdown: boolean;
}

export interface Top5DataConsumerAppsData {
  title: string;
  totalDataUsage: string;
  totalChange: string;
  totalChangeDirection: "up" | "down";
  subtitle: string;
  apps: Array<{
    name: string;
    category: string;
    icon: string;
    dataUsage: string;
    change: string;
    changeDirection: "up" | "down";
  }>;
  showDropdown: boolean;
}

export interface DeviceSyncStatsData {
  title: string;
  stats: Array<{
    title: string;
    value: string;
    percentage: string;
    icon: string;
    bgClass: string;
    textClass: string;
  }>;
  showDropdown: boolean;
}

export interface AppVsBackgroundUsageData {
  title: string;
  centerTitle: string;
  centerValue: string;
  series: number[];
  labels: string[];
  colors: string[];
  gradientColors: string[];
  devices: Array<{
    name: string;
    icon: string;
    percentage: string;
    iconColor: string;
  }>;
  showDropdown: boolean;
}

export interface BeneficiaryActivityData {
  title: string;
  activities: Array<{
    participant: string;
    mostUsedApp: string;
    mostUsedAppScreentime: string;
    mostUsedAppIcon: string;
    mostVisitedApp: string;
    mostVisitedCount: string;
    mostVisitedAppIcon: string;
    dataUsageApp: string;
    dataUsageAmount: string;
    dataUsageAppIcon: string;
    lastSyncedDate: string;
    lastSyncedTime: string;
  }>;
  showDropdown: boolean;
}

// Main widgets interface
export interface DashboardWidgets {
  configurableWelcomeCard: ConfigurableWelcomeCardData;
  avgScreentime: AreaChartWidgetData;
  avgNetUsage: AreaChartWidgetData;
  mostUsedApp: AreaChartWidgetData;
  appSessionsSynced: RadialChartWidgetData;
  usageStatsByProgramme: UsageStatsByProgrammeData;
  mostVisitedApp: BarChartWidgetData;
  topDataConsumer: LineChartWidgetData;
  highestParticipantScreentime: StatCardData;
  top5UsedApps: Top5UsedAppsData;
  top5DataConsumerApps: Top5DataConsumerAppsData;
  deviceSyncStats: DeviceSyncStatsData;
  appVsBackgroundUsage: AppVsBackgroundUsageData;
  beneficiaryActivity: BeneficiaryActivityData;
}

// Main overview dashboard data structure
export interface OverviewDashboardData {
  globalFilters: GlobalFilters;
  widgets: DashboardWidgets;
}

// API response structure
export interface OverviewDashboardApiResponse {
  data: OverviewDashboardData;
}

// Widget identifiers for easy reference
export type Widget1To4Keys = 
  | 'avgScreentime' 
  | 'avgNetUsage' 
  | 'mostUsedApp' 
  | 'appSessionsSynced';

// Helper type for extracting specific widget data
export type WidgetData<T extends keyof DashboardWidgets> = DashboardWidgets[T];
