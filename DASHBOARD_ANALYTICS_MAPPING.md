# Android Device Usage Dashboard Analytics Mapping

## Overview

This document maps the existing ecommerce dashboard widgets to Android device usage study indicators and provides comprehensive data structures for implementation.

## Data Available

- **1000+ Android devices** with beneficiaries/participants
- **Installed apps** data with usage patterns
- **App event logs** with detailed interaction tracking
- **Usage sessions** with duration and frequency metrics
- **Network data** consumption and connectivity patterns
- **Screen sessions** with activity tracking
- **Sync logs** for data collection reliability
- **Timestamped data** for temporal analysis

---

## Widget Mapping & Data Structures

### 1. Welcome Card Widget

**Current:** Sales metrics and growth rate  
**New:** Total Screen Time Today + Active Devices Rate

#### Additional Indicators:

- **Battery Health Score** - Average battery level across active devices
- **Data Sync Status** - Real-time sync success rate
- **App Crashes Today** - Count of app crashes requiring attention
- **New Participant Onboarding** - Weekly enrollment progress

#### Data Structure:

```typescript
interface WelcomeCardData {
  coordinator_name: string;
  total_screen_time_today: {
    value: number; // in hours
    change_percentage: number;
    is_increase: boolean;
    target_hours: number; // daily target
  };
  active_devices_rate: {
    value: number; // percentage
    change_percentage: number;
    is_increase: boolean;
    total_devices: number;
    active_count: number;
  };
  additional_metrics: {
    battery_health_avg: number; // 0-100
    sync_success_rate: number; // percentage
    app_crashes_today: number;
    weekly_enrollments: number;
  };
  progress_bars: {
    screen_time_progress: number; // 0-100
    active_devices_progress: number; // 0-100
  };
}
```

### 2. Active Participants Today Widget

**Current:** Active Users with radial chart  
**New:** Active Participants Today

#### Additional Indicators:

- **Peak Activity Hours** - When participants are most active
- **Weekend vs Weekday Activity** - Usage pattern comparison
- **Geographic Distribution** - Active participants by region
- **Age Group Breakdown** - Activity by demographic

#### Data Structure:

```typescript
interface ActiveParticipantsData {
  total_active_today: number;
  percentage_active: number; // for radial chart (0-100)
  change_from_last_week: {
    count: number;
    is_increase: boolean;
  };
  peak_activity: {
    hour_range: string; // "14:00-16:00"
    participant_count: number;
  };
  demographics: {
    age_groups: Array<{
      range: string; // "18-25"
      count: number;
      percentage: number;
    }>;
    geographic: Array<{
      region: string;
      count: number;
    }>;
  };
  chart_data: number[]; // hourly activity trend
}
```

### 3. Enrolled Participants Widget

**Current:** Total Users with area chart  
**New:** Total Enrolled Participants

#### Additional Indicators:

- **Retention Rate** - Participants still active after 30/60/90 days
- **Dropout Analysis** - Reasons for participant withdrawal
- **Completion Rate** - Study milestone achievements
- **Device Utilization** - How many enrolled participants use devices daily

#### Data Structure:

```typescript
interface EnrolledParticipantsData {
  total_enrolled: number;
  change_percentage: number;
  is_increase: boolean;
  retention_rates: {
    day_30: number; // percentage
    day_60: number;
    day_90: number;
  };
  completion_metrics: {
    completed_onboarding: number;
    completed_training: number;
    active_study_phase: number;
  };
  monthly_trend: {
    labels: string[]; // ["Jan", "Feb", "Mar", ...]
    enrollment_data: number[];
    retention_data: number[];
  };
}
```

### 4. Screen Time Trends Widget

**Current:** Monthly Revenue chart  
**New:** Screen Time Trends Analysis

#### Additional Indicators:

- **App Category Time Distribution** - Social, Productivity, Entertainment
- **Screen Time vs Study Goals** - Comparing to research objectives
- **Peak Usage Patterns** - Daily/weekly patterns
- **Screen Time Quality Score** - Productive vs leisure time ratio

#### Data Structure:

```typescript
interface ScreenTimeTrendsData {
  daily_average: {
    hours: number;
    change_percentage: number;
    target_comparison: number; // vs study goals
  };
  category_breakdown: Array<{
    category: string;
    hours: number;
    percentage: number;
    color: string;
  }>;
  quality_metrics: {
    productive_time_ratio: number; // percentage
    educational_app_usage: number; // hours
    entertainment_ratio: number;
  };
  chart_data: {
    labels: string[]; // dates or months
    datasets: Array<{
      name: string; // "Productive", "Social", "Entertainment"
      data: number[];
      color: string;
    }>;
  };
  peak_patterns: {
    daily_peak: string; // "14:00-16:00"
    weekly_peak: string; // "Tuesday"
    seasonal_trends: string;
  };
}
```

### 5. Top App Categories Usage Widget

**Current:** Device Type donut chart  
**New:** App Categories Usage Distribution

#### Additional Indicators:

- **Educational vs Entertainment Balance** - Learning app usage
- **Productivity Score** - Work-related app usage
- **Social Media Impact** - Time spent on social platforms
- **Health & Wellness Apps** - Fitness and mental health usage

#### Data Structure:

```typescript
interface AppCategoriesData {
  title: string;
  chart_data: {
    series: number[]; // usage percentages
    labels: string[]; // category names
    colors: string[]; // hex colors for each category
  };
  center_metric: {
    percentage: number; // most used category
    label: string;
  };
  detailed_breakdown: Array<{
    category: string;
    icon: string; // material icon or app icon URL
    percentage: number;
    total_hours: number;
    app_count: number; // apps in this category
    growth_rate: number; // week over week
    top_apps: string[]; // most used apps in category
  }>;
  insights: {
    educational_score: number; // 0-100
    productivity_index: number; // 0-100
    entertainment_balance: number; // percentage
    health_engagement: number; // hours in health apps
  };
}
```

### 6. Data Consumed Today Widget

**Current:** Total Clicks  
**New:** Data Consumption Analytics

#### Additional Indicators:

- **Data Efficiency Score** - MB per hour of usage
- **Peak Data Usage Times** - When most data is consumed
- **App-wise Data Breakdown** - Which apps consume most data
- **Cost Analysis** - Data usage cost implications

#### Data Structure:

```typescript
interface DataConsumptionData {
  total_gb_today: number;
  change_percentage: number;
  is_increase: boolean;
  efficiency_metrics: {
    mb_per_hour: number;
    efficiency_score: number; // 0-100 rating
    cost_per_gb: number; // if available
  };
  breakdown_by_app: Array<{
    app_name: string;
    data_consumed_mb: number;
    percentage_of_total: number;
    icon: string;
  }>;
  time_patterns: {
    peak_hours: string[];
    hourly_breakdown: Array<{
      hour: string;
      mb_consumed: number;
    }>;
  };
  chart_data: {
    labels: string[]; // time periods
    data: number[]; // GB consumed
    forecast: number[]; // predicted usage
  };
}
```

### 7. App Sessions Today Widget

**Current:** Total Views  
**New:** App Session Analytics

#### Additional Indicators:

- **Session Duration Average** - How long users stay in apps
- **Session Quality Score** - Engagement depth measurement
- **App Switching Patterns** - Multi-tasking behavior
- **Focus Time Analysis** - Uninterrupted usage periods

#### Data Structure:

```typescript
interface AppSessionsData {
  total_sessions_today: number;
  change_from_yesterday: {
    count: number;
    percentage: number;
    is_increase: boolean;
  };
  session_quality: {
    average_duration_minutes: number;
    quality_score: number; // 0-100
    focus_time_ratio: number; // uninterrupted sessions
  };
  top_apps_by_sessions: Array<{
    app_name: string;
    session_count: number;
    avg_duration: number;
    icon: string;
  }>;
  behavioral_patterns: {
    app_switching_frequency: number;
    multitasking_sessions: number;
    single_focus_sessions: number;
  };
  chart_data: {
    hourly_sessions: number[];
    session_duration_trend: number[];
    labels: string[];
  };
}
```

### 8. Sync Success Rate Widget

**Current:** Total Accounts  
**New:** Data Synchronization Reliability

#### Additional Indicators:

- **Sync Latency Analysis** - How long syncs take
- **Failed Sync Reasons** - Network, battery, storage issues
- **Data Integrity Score** - Quality of synchronized data
- **Real-time vs Batch Sync** - Performance comparison

#### Data Structure:

```typescript
interface SyncSuccessData {
  success_rate_percentage: number;
  change_percentage: number;
  is_increase: boolean;
  sync_performance: {
    average_latency_seconds: number;
    failed_syncs_today: number;
    pending_syncs: number;
    last_successful_sync: string; // ISO timestamp
  };
  failure_analysis: Array<{
    reason: string; // "Network", "Battery", "Storage"
    count: number;
    percentage: number;
  }>;
  data_integrity: {
    integrity_score: number; // 0-100
    corrupted_records: number;
    recovered_data_mb: number;
  };
  chart_data: {
    labels: string[]; // time periods
    success_rates: number[];
    latency_data: number[];
  };
}
```

### 9. Program Performance Widget

**Current:** Campaign Stats  
**New:** Study Program Performance Metrics

#### Additional Indicators:

- **Milestone Completion** - Study phase achievements
- **Participant Engagement Score** - Overall study participation
- **Data Collection Quality** - Completeness and accuracy
- **Research Objective Progress** - Goal achievement tracking

#### Data Structure:

```typescript
interface ProgramPerformanceData {
  metrics: Array<{
    title: string; // "Data Collection", "Participant Retention", etc.
    value: string;
    percentage: string;
    icon: string; // material icon name
    bg_class: string; // CSS class
    text_class: string; // CSS class
    target_value?: number; // for progress tracking
    status: "on_track" | "behind" | "ahead";
  }>;
  milestones: Array<{
    name: string;
    completion_percentage: number;
    due_date: string;
    participants_completed: number;
    total_participants: number;
  }>;
  engagement_score: {
    overall_score: number; // 0-100
    categories: Array<{
      name: string; // "Daily Usage", "Survey Completion"
      score: number;
    }>;
  };
}
```

### 10. Engagement Quality Widget

**Current:** Visitors Growth  
**New:** Participant Engagement Analysis

#### Additional Indicators:

- **Engagement Depth Score** - How thoroughly participants use apps
- **Consistency Rating** - Regular vs sporadic usage
- **Feature Adoption** - Which app features are most used
- **Learning Progression** - Skill development over time

#### Data Structure:

```typescript
interface EngagementQualityData {
  overall_engagement: {
    percentage: number;
    change_percentage: number;
    is_increase: boolean;
    quality_rating: "high" | "medium" | "low";
  };
  engagement_levels: Array<{
    level: string; // "High Engagement", "Medium", "Low"
    participant_count: number;
    percentage: number;
    color_class: string;
    characteristics: string[]; // behavioral traits
  }>;
  depth_analysis: {
    feature_adoption_rate: number;
    advanced_feature_usage: number;
    consistency_score: number; // 0-100
  };
  progression_metrics: {
    skill_improvement: number; // percentage
    learning_milestones_reached: number;
    usage_sophistication_score: number;
  };
  chart_data: {
    data: number[]; // engagement scores over time
    labels: string[];
    trend_line: number[];
  };
}
```

### 11. Top 7 Most Used Apps Widget

**Current:** Social Leads  
**New:** Most Popular Applications

#### Additional Indicators:

- **App Stickiness Score** - Retention and return rate per app
- **Feature Usage Depth** - Which app features are used most
- **Cross-App Usage Patterns** - How apps are used together
- **Educational Value Score** - Learning potential of popular apps

#### Data Structure:

```typescript
interface TopAppsData {
  apps: Array<{
    name: string;
    package_name: string; // for Android apps
    icon: string; // URL to app icon
    usage_metrics: {
      daily_active_users: number;
      total_time_hours: number;
      session_count: number;
      average_session_duration: number;
    };
    engagement_scores: {
      stickiness_score: number; // 0-100
      feature_depth_score: number; // 0-100
      educational_value: number; // 0-100
    };
    growth_metrics: {
      weekly_growth_percentage: number;
      new_user_adoption: number;
      retention_rate: number;
    };
    color: string; // for progress indicators
  }>;
  cross_app_patterns: Array<{
    app_combination: string[]; // frequently used together
    usage_frequency: number;
    common_user_count: number;
  }>;
}
```

### 12. Recent Enrollments Widget

**Current:** New Users  
**New:** Latest Participant Enrollments

#### Additional Indicators:

- **Onboarding Progress** - Completion status of new participants
- **Initial Engagement Score** - How quickly new users adapt
- **Device Setup Status** - Technical onboarding completion
- **Training Module Progress** - Educational milestone tracking

#### Data Structure:

```typescript
interface RecentEnrollmentsData {
  participants: Array<{
    participant_id: string;
    name: string;
    avatar: string; // URL to avatar
    enrollment_date: string;
    onboarding_status: {
      percentage_complete: number;
      current_step: string;
      estimated_completion: string;
    };
    device_setup: {
      device_assigned: boolean;
      apps_installed: number;
      initial_sync_completed: boolean;
    };
    early_engagement: {
      first_week_usage_hours: number;
      apps_explored: number;
      engagement_score: number; // 0-100
    };
    is_selected?: boolean; // for UI checkbox
  }>;
  enrollment_trends: {
    weekly_average: number;
    target_vs_actual: number;
    dropout_rate_first_week: number;
  };
}
```

### 13. Recent Device Issues/Alerts Widget

**Current:** Recent Orders  
**New:** Device Health and Issue Monitoring

#### Additional Indicators:

- **Predictive Issue Detection** - Potential problems before they occur
- **Issue Resolution Time** - How quickly problems are solved
- **Device Performance Score** - Overall health rating
- **Proactive Maintenance Alerts** - Preventive care notifications

#### Data Structure:

```typescript
interface DeviceIssuesData {
  issues: Array<{
    id: string;
    device_id: string;
    participant_name: string;
    issue_type:
      | "battery_low"
      | "sync_failed"
      | "app_crash"
      | "storage_full"
      | "network_issue";
    severity: 1 | 2 | 3 | 4 | 5; // 1=low, 5=critical
    status: "new" | "investigating" | "in_progress" | "resolved" | "escalated";
    created_at: string;
    estimated_resolution: string;
    impact_score: number; // 0-100
    device_info: {
      model: string;
      os_version: string;
      battery_level?: number;
      storage_available_gb?: number;
    };
    status_class: string; // CSS class for styling
  }>;
  summary_metrics: {
    total_active_issues: number;
    critical_issues: number;
    average_resolution_time_hours: number;
    device_health_score: number; // overall fleet health
  };
  predictive_alerts: Array<{
    device_id: string;
    predicted_issue: string;
    probability: number; // 0-100
    recommended_action: string;
  }>;
  search_enabled: boolean;
}
```

---

## Implementation Phases

### Phase 1: Core Metrics (Immediate Impact)

- Active Participants Today
- Enrolled Participants
- Top 7 Most Used Apps
- Recent Device Issues

### Phase 2: Analytics Enhancement

- Screen Time Trends
- Program Performance
- Data Consumption
- Sync Success Rate

### Phase 3: Advanced Insights

- Engagement Quality Analysis
- App Categories Deep Dive
- Predictive Analytics
- Cross-Platform Insights

---

## API Endpoint Structure

### Main Dashboard Endpoint

```
GET /api/dashboard/analytics
Response: DashboardData (contains all widget data)
```

### Individual Widget Endpoints

```
GET /api/dashboard/welcome-card
GET /api/dashboard/active-participants
GET /api/dashboard/enrolled-participants
GET /api/dashboard/screen-time-trends
GET /api/dashboard/app-categories
GET /api/dashboard/data-consumption
GET /api/dashboard/app-sessions
GET /api/dashboard/sync-success
GET /api/dashboard/program-performance
GET /api/dashboard/engagement-quality
GET /api/dashboard/top-apps
GET /api/dashboard/recent-enrollments
GET /api/dashboard/device-issues
```

### Real-time Updates

```
WebSocket: /ws/dashboard/live-updates
Publishes: Real-time metric changes, new alerts, device status updates
```

---

## Notes for Implementation

1. **Data Aggregation**: Most metrics should be pre-calculated and cached for performance
2. **Real-time Updates**: Use WebSocket connections for live data updates
3. **Responsive Design**: All widgets should work on mobile and desktop
4. **Loading States**: Implement skeleton loading for better UX
5. **Error Handling**: Graceful degradation when API calls fail
6. **Caching Strategy**: Cache dashboard data with appropriate TTL
7. **Performance**: Paginate large datasets and lazy-load non-critical data
