# Database Analytics Documentation

This document outlines the comprehensive analytics capabilities that can be derived from the telemetry database schema, supporting both operational monitoring and research objectives for 200+ devices.

## 1. General Dashboard (Overview Analytics)

### Basic Metrics
- **Total Active Devices**: Count of devices with recent sync activity
- **Total Beneficiaries**: Unique beneficiaries across all programmes
- **Data Collection Rate**: Percentage of devices reporting data in last 24h
- **Sync Success Rate**: Percentage of successful syncs vs failed
- **Last Sync Status**: Time since last successful sync

### Trend Indicators
- **Device Activity Trends**: Daily/weekly/monthly device engagement
- **Data Volume Trends**: Growth in data collection over time
- **Sync Performance Trends**: Improving/degrading sync success rates

## 2. Device Usage Analytics

### Device-Level Metrics
- **Active vs Inactive Devices**: Devices with/without recent activity
- **Device Health Status**: Online/offline/syncing status
- **Device Assignment History**: How long devices have been assigned
- **Device Performance**: Sync frequency and success rates per device

### Usage Patterns
- **Daily Usage Patterns**: Peak usage hours across all devices
- **Weekly Usage Patterns**: Day-of-week usage variations
- **Monthly Usage Trends**: Long-term usage growth/decline
- **Session Duration Analysis**: Average session lengths per device

## 3. Location-Based Analysis

### Geographic Distribution
- **Devices by District**: Distribution across different locations
- **Usage Patterns by Location**: Regional usage differences
- **Network Usage by Region**: Data consumption patterns by location
- **Sync Performance by Location**: Regional connectivity analysis

### Location-Based Trends
- **Regional Adoption Rates**: How quickly devices are adopted in different areas
- **Location-Based App Preferences**: Popular apps vary by region
- **Network Infrastructure Impact**: How local connectivity affects sync success

## 4. Programme-Based Analytics

### Programme Performance
- **Devices per Programme**: Distribution across different programmes
- **Programme Effectiveness**: Usage patterns correlated with programme goals
- **Beneficiary Engagement**: How actively beneficiaries use devices
- **Programme-Specific App Usage**: Which apps are most used in each programme

### Programme Comparisons
- **Cross-Programme Analysis**: Compare usage patterns between programmes
- **Programme Success Metrics**: Correlation between device usage and programme outcomes
- **Programme-Specific Trends**: How usage evolves within specific programmes

## 5. App-Based Analytics

### App Usage Patterns
- **Most Used Apps**: Top apps by session count and duration
- **App Categories**: Educational, Games, Social, Productivity usage
- **App Session Analysis**: Average session duration per app
- **App Adoption Trends**: How app usage changes over time

### App Performance
- **App-Specific Network Usage**: Data consumption per app
- **App Reliability**: Apps that crash or have sync issues
- **App Version Analysis**: Usage patterns by app versions
- **App Selection Patterns**: Which apps users choose to track

## 6. Network Usage Analytics

### Data Consumption Patterns
- **Total Network Usage**: Aggregate data consumption across all devices
- **App-Specific Data Usage**: Which apps consume most data
- **Network Usage Trends**: Daily/weekly/monthly data consumption patterns
- **Peak Usage Times**: When network usage is highest

### Network Performance
- **Sync Efficiency**: How much data is successfully synced
- **Network Error Analysis**: Failed syncs and their causes
- **Data Transfer Optimization**: Identifying inefficient data transfers
- **Network Cost Analysis**: Understanding data consumption costs

## 7. Combined Entity Analysis

### Cross-Dimensional Insights
- **Device-App-Network Correlation**: How device type affects app and network usage
- **Location-Programme-App Usage**: Regional programme-specific app preferences
- **Time-Location-Usage Patterns**: When and where devices are most active
- **Beneficiary-Device-App Correlation**: Individual usage patterns

### Predictive Analytics
- **Usage Prediction**: Forecast future usage based on historical patterns
- **Device Failure Prediction**: Identify devices likely to have issues
- **App Adoption Prediction**: Predict which apps will become popular
- **Network Usage Forecasting**: Predict future data consumption needs

## 8. Per-Device Analytics

### Individual Device Deep Dive
- **Device Timeline**: Complete usage history for each device
- **App Usage Profile**: Detailed app usage patterns per device
- **Network Consumption Profile**: Data usage patterns per device
- **Sync Performance History**: Complete sync log for each device

### Device Health Monitoring
- **Device Reliability Score**: Based on sync success and data quality
- **Usage Anomaly Detection**: Unusual patterns that might indicate issues
- **Device Performance Trends**: How device performance changes over time
- **Maintenance Indicators**: When devices need attention

## 9. Advanced Analytics

### Behavioral Analysis
- **Usage Habit Formation**: How usage patterns develop over time
- **App Switching Patterns**: How users move between apps
- **Session Interruption Analysis**: What causes sessions to end
- **Engagement Scoring**: Rate how engaged each beneficiary is

### Research Insights
- **Educational Impact**: Correlation between app usage and learning outcomes
- **Digital Literacy Progression**: How device usage skills improve over time
- **Social Usage Patterns**: How social apps are used in different contexts
- **Productivity Analysis**: How productivity apps are utilized

## 10. Real-Time Analytics

### Live Monitoring
- **Active Sessions**: Real-time app sessions across all devices
- **Live Sync Status**: Current sync operations and their status
- **Network Usage Live**: Real-time data consumption monitoring
- **Device Status Dashboard**: Current status of all devices

### Alert System
- **Sync Failure Alerts**: Immediate notification of sync issues
- **High Usage Alerts**: Notifications when usage exceeds thresholds
- **Device Offline Alerts**: When devices go offline unexpectedly
- **Anomaly Detection**: Unusual usage patterns that need attention

## Implementation Recommendations

### Dashboard Widgets (Based on widget mapping)
1. **Overview Cards**: Total devices, active devices, sync success rate
2. **Trend Charts**: Usage trends over time, network consumption trends
3. **Pie Charts**: App category distribution, device status distribution
4. **Bar Charts**: Top apps by usage, devices by location
5. **Line Charts**: Time-series data for various metrics
6. **Tables**: Device lists, beneficiary lists, sync logs

### Data Refresh Strategy
- **Real-time**: Sync status, active sessions
- **5-minute**: Usage metrics, device status
- **Hourly**: Aggregated statistics, trends
- **Daily**: Historical analysis, long-term trends

## Key SQL Queries for Analytics

### Overview Dashboard Queries

```sql
-- Total Active Devices (last 24 hours)
SELECT COUNT(DISTINCT device_id) 
FROM sync_logs 
WHERE sync_completed_at >= NOW() - INTERVAL '24 hours' 
AND status = 'success';

-- Sync Success Rate
SELECT 
    COUNT(*) FILTER (WHERE status = 'success') * 100.0 / COUNT(*) as success_rate
FROM sync_logs 
WHERE sync_completed_at >= NOW() - INTERVAL '24 hours';

-- Devices by Status
SELECT 
    CASE 
        WHEN last_synced >= NOW() - INTERVAL '1 hour' THEN 'Online'
        WHEN last_synced >= NOW() - INTERVAL '24 hours' THEN 'Recent'
        ELSE 'Offline'
    END as status,
    COUNT(*) as device_count
FROM devices 
WHERE is_active = true 
GROUP BY status;
```

### App Usage Analytics

```sql
-- Top Apps by Session Count
SELECT 
    ia.app_name,
    COUNT(*) as session_count,
    AVG(aps.session_time) as avg_session_duration
FROM app_sessions aps
JOIN installed_apps ia ON aps.device_id = ia.device_id 
    AND aps.package_name = ia.package_name
WHERE aps.created_at >= NOW() - INTERVAL '7 days'
GROUP BY ia.app_name
ORDER BY session_count DESC
LIMIT 10;

-- App Category Distribution
SELECT 
    CASE 
        WHEN ia.app_name ILIKE '%education%' OR ia.app_name ILIKE '%learn%' THEN 'Educational'
        WHEN ia.app_name ILIKE '%game%' OR ia.app_name ILIKE '%play%' THEN 'Games'
        WHEN ia.app_name ILIKE '%social%' OR ia.app_name ILIKE '%chat%' THEN 'Social'
        ELSE 'Other'
    END as category,
    COUNT(*) as session_count
FROM app_sessions aps
JOIN installed_apps ia ON aps.device_id = ia.device_id 
    AND aps.package_name = ia.package_name
WHERE aps.created_at >= NOW() - INTERVAL '7 days'
GROUP BY category;
```

### Network Usage Analytics

```sql
-- Total Network Usage by App
SELECT 
    ia.app_name,
    SUM(nu.total_bytes) as total_bytes,
    COUNT(*) as usage_count
FROM network_usages nu
JOIN installed_apps ia ON nu.device_id = ia.device_id 
    AND nu.package_name = ia.package_name
WHERE nu.created_at >= NOW() - INTERVAL '7 days'
GROUP BY ia.app_name
ORDER BY total_bytes DESC
LIMIT 10;

-- Network Usage Trends (daily)
SELECT 
    DATE(nu.created_at) as date,
    SUM(nu.total_bytes) as total_bytes,
    COUNT(DISTINCT nu.device_id) as active_devices
FROM network_usages nu
WHERE nu.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(nu.created_at)
ORDER BY date;
```

### Location-Based Analytics

```sql
-- Devices by District
SELECT 
    d.district,
    COUNT(*) as device_count,
    COUNT(DISTINCT d.current_beneficiary_id) as beneficiary_count
FROM devices d
WHERE d.is_active = true
GROUP BY d.district
ORDER BY device_count DESC;

-- Usage Patterns by Location
SELECT 
    d.district,
    COUNT(aps.id) as session_count,
    AVG(aps.session_time) as avg_session_duration,
    SUM(nu.total_bytes) as total_network_usage
FROM devices d
LEFT JOIN app_sessions aps ON d.id = aps.device_id 
    AND aps.created_at >= NOW() - INTERVAL '7 days'
LEFT JOIN network_usages nu ON d.id = nu.device_id 
    AND nu.created_at >= NOW() - INTERVAL '7 days'
WHERE d.is_active = true
GROUP BY d.district;
```

### Programme-Based Analytics

```sql
-- Programme Performance
SELECT 
    d.programme,
    COUNT(DISTINCT d.id) as device_count,
    COUNT(DISTINCT d.current_beneficiary_id) as beneficiary_count,
    COUNT(aps.id) as total_sessions,
    AVG(aps.session_time) as avg_session_duration
FROM devices d
LEFT JOIN app_sessions aps ON d.id = aps.device_id 
    AND aps.created_at >= NOW() - INTERVAL '30 days'
WHERE d.is_active = true
GROUP BY d.programme
ORDER BY device_count DESC;
```

### Real-Time Monitoring Queries

```sql
-- Currently Active Sessions
SELECT 
    d.device_name,
    ia.app_name,
    aps.session_time,
    aps.created_at
FROM app_sessions aps
JOIN devices d ON aps.device_id = d.id
JOIN installed_apps ia ON aps.device_id = ia.device_id 
    AND aps.package_name = ia.package_name
WHERE aps.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY aps.created_at DESC;

-- Recent Sync Status
SELECT 
    d.device_name,
    sl.sync_type,
    sl.status,
    sl.records_count,
    sl.sync_completed_at
FROM sync_logs sl
JOIN devices d ON sl.device_id = d.id
WHERE sl.sync_completed_at >= NOW() - INTERVAL '1 hour'
ORDER BY sl.sync_completed_at DESC;
```

## Analytics Dashboard Structure

### Overview Dashboard
- **Summary Cards**: Key metrics at a glance
- **Trend Charts**: Time-series data for main metrics
- **Status Distribution**: Pie charts for device/app status
- **Recent Activity**: Latest syncs and sessions

### Analytics Dashboard
- **Filtering Options**: Date range, location, programme, device
- **Interactive Charts**: Drill-down capabilities
- **Export Functions**: Data export for further analysis
- **Comparative Views**: Side-by-side comparisons

### Device Detail Dashboard
- **Device Profile**: Complete device information
- **Usage Timeline**: Historical usage data
- **Performance Metrics**: Sync success, data quality
- **Maintenance Alerts**: Issues requiring attention

This comprehensive analytics framework provides deep insights into telemetry data, supporting both operational monitoring and research objectives for the 200+ device deployment. 