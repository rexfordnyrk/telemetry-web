# Telemetry Dashboard Data Points & Indicators

## Overview Dashboard (General)

### Device & Participant Management
- **Total Active Devices**: Count of devices with `is_active = true`
- **Total Enrolled Beneficiaries**: Count of beneficiaries with `is_active = true`
- **Device Assignment Rate**: Percentage of devices currently assigned to beneficiaries
- **New Enrollments (This Month)**: Count of beneficiaries enrolled in current month
- **Device Enrollment Trend**: Monthly device enrollment over time
- **Geographic Distribution**: Devices/beneficiaries by district/organization

### Data Collection Health
- **Last Sync Status**: Count of devices by last sync status (recent, stale, never)
- **Sync Success Rate**: Percentage of successful syncs in last 24 hours
- **Data Collection Coverage**: Percentage of devices reporting data in last 7 days
- **Sync Performance**: Average sync duration and record counts
- **Failed Syncs**: Count and details of failed synchronization attempts

### Real-time Activity
- **Currently Active Devices**: Devices with activity in last 5 minutes
- **Active Sessions**: Number of ongoing app sessions
- **Screen Activity**: Devices with screen on in last 10 minutes
- **Network Activity**: Devices with network usage in last hour

## App Usage Analytics

### App Popularity & Engagement
- **Most Used Apps**: Top apps by session count and duration
- **App Usage Distribution**: Pie chart of app usage by category
- **Session Duration Trends**: Average session duration by app over time
- **App Launch Frequency**: How often each app is opened
- **User Engagement Score**: Composite score based on usage patterns

### App Performance Metrics
- **App Stability**: Apps with highest crash rates (based on session patterns)
- **Background Usage**: Apps running in background vs foreground
- **App Version Distribution**: Distribution of app versions across devices
- **App Installation Trends**: New app installations over time

### Behavioral Patterns
- **Peak Usage Hours**: Time of day when apps are most used
- **Usage Patterns by Day**: Weekly usage patterns
- **App Switching Patterns**: How users switch between apps
- **Session Length Distribution**: Distribution of session durations

## Network Usage Analytics

### Data Consumption
- **Total Data Usage**: Aggregate upload/download across all devices
- **Data Usage by App**: Top apps by data consumption
- **Network Usage Trends**: Daily/weekly/monthly data usage patterns
- **Data Usage Efficiency**: Data consumed per session duration

### Network Performance
- **Network Activity by Time**: Hourly network usage patterns
- **Upload vs Download Ratios**: Balance of upload/download traffic
- **Network Usage by Device**: Data consumption per device
- **Network Usage by Location**: Data usage patterns by district/organization

### Cost Analysis
- **Data Usage Projections**: Predicted data usage based on trends
- **Cost per Beneficiary**: Average data cost per participant
- **Network Efficiency Score**: Data usage efficiency metrics

## Device Activity & Health

### Screen Activity
- **Screen Time Distribution**: Total screen time by device/beneficiary
- **Screen On/Off Patterns**: Frequency and duration of screen sessions
- **Screen Activity by Time**: Hourly screen activity patterns
- **Screen Session Length**: Distribution of screen session durations

### Device Health
- **Device Performance**: Devices with high/low activity levels
- **Battery Usage Patterns**: Inferred from screen activity patterns
- **Device Reliability**: Devices with consistent vs intermittent activity
- **Device Age Analysis**: Performance correlation with device age

### Usage Events
- **Event Type Distribution**: Breakdown of usage event types
- **Activity Patterns**: Most common user activities
- **Event Frequency**: How often different events occur
- **Anomaly Detection**: Unusual activity patterns

## Beneficiary Analytics

### Individual Performance
- **Beneficiary Activity Score**: Composite score based on device usage
- **Engagement Levels**: High/medium/low engagement beneficiaries
- **Usage Consistency**: How consistently beneficiaries use devices
- **Learning Progress**: Usage patterns indicating learning progress

### Group Analysis
- **Programme Comparison**: Usage patterns across different programmes
- **Geographic Analysis**: Usage patterns by district/organization
- **Demographic Insights**: Usage patterns by beneficiary characteristics
- **Peer Comparison**: Beneficiaries compared to their peers

## Temporal Analysis

### Time-based Patterns
- **Daily Usage Cycles**: 24-hour usage patterns
- **Weekly Patterns**: Day-of-week usage trends
- **Monthly Trends**: Long-term usage evolution
- **Seasonal Patterns**: Usage changes over seasons

### Trend Analysis
- **Growth Metrics**: Month-over-month usage growth
- **Adoption Curves**: How quickly new apps/features are adopted
- **Retention Analysis**: How long beneficiaries stay engaged
- **Predictive Analytics**: Future usage predictions

## Research & Impact Metrics

### Programme Effectiveness
- **Engagement Correlation**: Usage patterns vs programme outcomes
- **Learning Indicators**: Usage patterns indicating learning
- **Intervention Impact**: Usage changes after interventions
- **Success Metrics**: Usage-based success indicators

### Comparative Analysis
- **Cross-Programme Comparison**: Usage patterns across programmes
- **Geographic Comparison**: Usage patterns across locations
- **Temporal Comparison**: Usage patterns across time periods
- **Benchmark Analysis**: Performance vs benchmarks

## Technical Analytics

### System Performance
- **Data Collection Efficiency**: Percentage of expected data collected
- **Sync Performance**: Sync success rates and durations
- **Storage Metrics**: Database growth and storage efficiency
- **API Performance**: Response times and error rates

### Data Quality
- **Data Completeness**: Percentage of complete data records
- **Data Accuracy**: Validation of data consistency
- **Missing Data Analysis**: Patterns in missing data
- **Data Integrity**: Checks for data corruption

## Custom Analytics

### User-Defined Metrics
- **Custom Time Ranges**: Flexible date range analysis
- **Custom Groupings**: User-defined beneficiary groups
- **Custom Comparisons**: User-defined comparison metrics
- **Custom Thresholds**: User-defined alert thresholds

### Advanced Analytics
- **Machine Learning Insights**: Predictive analytics and clustering
- **Anomaly Detection**: Unusual patterns and outliers
- **Correlation Analysis**: Relationships between different metrics
- **Causal Analysis**: Understanding cause-effect relationships

## Alerting & Monitoring

### Real-time Alerts
- **Device Offline Alerts**: Devices not reporting data
- **Usage Anomalies**: Unusual usage patterns
- **Sync Failures**: Failed synchronization attempts
- **Performance Thresholds**: Metrics exceeding thresholds

### Health Monitoring
- **System Health**: Overall system performance
- **Data Quality**: Data collection quality metrics
- **User Engagement**: Engagement level monitoring
- **Resource Usage**: System resource utilization 