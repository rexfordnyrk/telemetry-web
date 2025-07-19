# Database Schema Documentation

This document outlines the database table structures for the telemetry application, excluding authentication-related tables.

## Background Context

As part of a study on usage of Android devices, we have comprehensive data collection capabilities that capture various aspects of device usage and user behavior: We have data about installed apps on device, App Event logs from which we derive app usage: when an app opens,closes, how much time is spent per app every session it was opened,  data/network usage while in that app, and general network usage of the device. we have device screen sessions: when screen was powered on and off and for how long, we have logs of successful and failed syncs. These devices are assigned to or given to beneficiaries or participants of our programme, so we can tell is using the device at a moment and the specific programme they are enrolled in from different locations.all data are timestampped and can therefore be filtered or explored for periodic basis such as daily, weekly or monthly or user defined range.



### Data Collection Overview

**Device and User Management:**
- Devices are assigned to beneficiaries (participants) enrolled in specific programmes across different locations
- We can track which beneficiary is using a device at any given moment and their specific programme enrollment
- Device assignments are tracked with timestamps for historical analysis

**App Usage Analytics:**
- **Installed Apps**: Complete inventory of applications installed on each device
- **App Event Logs**: Detailed logs of app usage events including:
  - When apps open and close
  - Session duration (time spent per app in each session)
  - App session statistics with foreground/background timestamps
- **App Metadata**: Version information, build details, and app icons for comprehensive app tracking

**Network Usage Tracking:**
- **App-specific Network Usage**: Data consumption while using specific applications
- **General Device Network Usage**: Overall network consumption patterns
- **Network Statistics**: Upload/download bytes, total data usage with timestamps

**Device Activity Monitoring:**
- **Screen Sessions**: Detailed tracking of screen power states:
  - When screen was powered on and off
  - Duration of each screen session
  - Trigger sources for screen state changes
- **Usage Events**: Granular event logs for comprehensive activity analysis

**Data Synchronization:**
- **Sync Logs**: Records of successful and failed data synchronization attempts
- **Sync Performance**: Tracking of sync duration, record counts, and error handling
- **Sync Types**: Differentiated logging for app usage, network usage, and installed apps syncs

### Temporal Analysis Capabilities

All data is timestamped and supports comprehensive temporal analysis:
- **Daily Analysis**: Day-by-day usage patterns and trends
- **Weekly Analysis**: Weekly aggregated statistics and comparisons
- **Monthly Analysis**: Monthly usage summaries and long-term trends
- **Custom Date Ranges**: User-defined time periods for flexible analysis
- **Real-time Filtering**: Dynamic filtering based on any time criteria

### Research Applications

This comprehensive data collection enables:
- **Behavioral Studies**: Understanding how participants interact with their devices
- **App Usage Patterns**: Analysis of which apps are most/least used
- **Network Consumption Analysis**: Understanding data usage patterns
- **Programme Effectiveness**: Correlating device usage with programme outcomes
- **Geographic Analysis**: Comparing usage patterns across different locations
- **Temporal Trends**: Identifying usage patterns over time

## Table Overview

The database is designed for a telemetry application that tracks device usage, app sessions, network consumption, and device assignments to beneficiaries in research studies.

### Key Features

- **Soft Deletes**: All tables use `deleted_at` for soft deletion
- **Timestamps**: Standard `created_at` and `updated_at` fields
- **UUID Primary Keys**: All tables use UUID primary keys
- **Foreign Key Relationships**: Proper referential integrity
- **Indexes**: Performance-optimized indexes on frequently queried columns
- **JSONB Support**: Flexible `details` field in devices table
- **Efficient View**: The `app_sessions_with_network_usage` view joins multiple tables for efficient querying

## Table Structures

### 1. beneficiaries

Represents study participants who are assigned devices for telemetry data collection.

```sql
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    photo VARCHAR(500),
    organization VARCHAR(255),
    district VARCHAR(255),
    programme VARCHAR(255),
    date_enrolled TIMESTAMP WITH TIME ZONE,
    current_device_id UUID REFERENCES devices(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

**Indexes:**
- `idx_beneficiaries_current_device_id ON beneficiaries(current_device_id)`

### 2. devices

Represents physical devices that collect telemetry data. Each device is identified by its MAC address and can be assigned to different beneficiaries over time.

```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mac_address VARCHAR(50) UNIQUE, -- Made optional in later migration
    device_name VARCHAR(255),
    android_version VARCHAR(50),
    app_version VARCHAR(50),
    organization VARCHAR(255),
    programme VARCHAR(255),
    date_enrolled TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_synced TIMESTAMP WITH TIME ZONE,
    current_beneficiary_id UUID REFERENCES beneficiaries(id),
    fingerprint VARCHAR(255),
    imei VARCHAR(50),
    serial_number VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

**Indexes:**
- `idx_devices_fingerprint ON devices(fingerprint)`
- `idx_devices_imei ON devices(imei)`
- `idx_devices_serial_number ON devices(serial_number)`
- `idx_devices_current_beneficiary_id ON devices(current_beneficiary_id)`

### 3. device_assignments

Tracks the relationship between devices and beneficiaries over time. This allows tracking device assignment history and current assignments.

```sql
CREATE TABLE device_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP WITH TIME ZONE,
    assigned_by VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 4. installed_apps

Represents applications installed on devices. This tracks all apps installed on devices and their metadata.

```sql
CREATE TABLE installed_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    package_name VARCHAR(255) NOT NULL,
    app_name VARCHAR(255),
    version_name VARCHAR(100),
    version_code INTEGER,
    built_with VARCHAR(100),
    installed_timestamp BIGINT,
    icon_base64 TEXT,
    is_selected BOOLEAN DEFAULT FALSE,
    is_uninstalled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(device_id, package_name)
);
```

### 5. app_sessions

Represents app session statistics collected from devices. This tracks individual app sessions with detailed timing and activity information.

```sql
CREATE TABLE app_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    package_name VARCHAR(255) NOT NULL,
    foreground_time_stamp BIGINT NOT NULL,
    background_time_stamp BIGINT NOT NULL,
    session_time BIGINT NOT NULL,
    start_activity_class VARCHAR(500),
    end_activity_class VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(device_id, package_name, foreground_time_stamp)
);
```

### 6. network_usages

Represents network usage statistics collected from devices. This tracks data consumption by apps on devices.

```sql
CREATE TABLE network_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    package_name VARCHAR(255) NOT NULL,
    rx_total_bytes BIGINT,
    tx_total_bytes BIGINT,
    total_bytes BIGINT,
    start_time BIGINT NOT NULL,
    end_time BIGINT NOT NULL,
    collection_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(device_id, package_name, start_time, end_time)
);
```

### 7. usage_events

Represents usage events collected from devices. This tracks individual usage events with event type, timestamp, and activity information.

```sql
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    event_type INTEGER NOT NULL,
    time_stamp BIGINT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(device_id, package_name, time_stamp, event_type)
);
```

**Indexes:**
- `idx_usage_events_device_id ON usage_events(device_id)`
- `idx_usage_events_event_type ON usage_events(event_type)`
- `idx_usage_events_time_stamp ON usage_events(time_stamp)`
- `idx_usage_events_package_name ON usage_events(package_name)`
- `idx_usage_events_device_time ON usage_events(device_id, time_stamp DESC)`
- `idx_usage_events_device_package ON usage_events(device_id, package_name)`

### 8. screen_sessions

Represents screen session statistics collected from devices. This tracks individual screen on/off sessions with timing and trigger information.

```sql
CREATE TABLE screen_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    screen_on_time_stamp BIGINT NOT NULL,
    screen_off_time_stamp BIGINT NOT NULL,
    session_duration BIGINT NOT NULL,
    trigger_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(device_id, screen_on_time_stamp, screen_off_time_stamp)
);
```

**Indexes:**
- `idx_screen_sessions_device_id ON screen_sessions(device_id)`
- `idx_screen_sessions_screen_on_time ON screen_sessions(screen_on_time_stamp)`
- `idx_screen_sessions_screen_off_time ON screen_sessions(screen_off_time_stamp)`
- `idx_screen_sessions_device_time ON screen_sessions(device_id, screen_on_time_stamp DESC)`
- `idx_screen_sessions_trigger_source ON screen_sessions(trigger_source)`

### 9. sync_logs

Tracks synchronization operations between devices and the server.

```sql
CREATE TABLE sync_logs (
    id SERIAL PRIMARY KEY,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'app_usage', 'network_usage', 'installed_apps'
    records_count INTEGER DEFAULT 0,
    sync_started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMP WITH TIME ZONE NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_sync_logs_device_id ON sync_logs(device_id)`
- `idx_sync_logs_sync_type ON sync_logs(sync_type)`
- `idx_sync_logs_status ON sync_logs(status)`
- `idx_sync_logs_created_at ON sync_logs(created_at)`
- `idx_sync_logs_device_created ON sync_logs(device_id, created_at DESC)`

## Database Views

### app_sessions_with_network_usage

This view joins app sessions with network usage and app metadata for efficient querying.

```sql
CREATE OR REPLACE VIEW app_sessions_with_network_usage AS
SELECT 
    aps.id,
    aps.device_id,
    aps.package_name,
    aps.foreground_time_stamp,
    aps.background_time_stamp,
    aps.session_time,
    aps.start_activity_class,
    aps.end_activity_class,
    aps.created_at,
    aps.updated_at,
    -- Network usage data (joined)
    nu.rx_total_bytes,
    nu.tx_total_bytes,
    nu.total_bytes,
    nu.start_time as network_start_time,
    nu.end_time as network_end_time,
    nu.collection_timestamp,
    -- App metadata (joined from installed apps)
    ia.app_name,
    ia.icon_base64,
    ia.version_name,
    ia.version_code,
    ia.built_with,
    ia.is_selected
FROM app_sessions aps
LEFT JOIN network_usages nu ON 
    aps.device_id = nu.device_id 
    AND aps.package_name = nu.package_name
    AND aps.foreground_time_stamp = nu.start_time
    AND aps.background_time_stamp = nu.end_time
LEFT JOIN installed_apps ia ON 
    aps.device_id = ia.device_id 
    AND aps.package_name = ia.package_name;
```

**Additional Indexes for View Performance:**
- `idx_app_sessions_network_device_id ON app_sessions(device_id)`
- `idx_app_sessions_network_package_name ON app_sessions(package_name)`
- `idx_app_sessions_network_timestamp ON app_sessions(foreground_time_stamp DESC)`
- `idx_network_usages_device_package_time ON network_usages(device_id, package_name, start_time, end_time)`
- `idx_installed_apps_device_package ON installed_apps(device_id, package_name)`

## Relationships

### Primary Relationships

1. **devices** ↔ **beneficiaries** (Many-to-Many through device_assignments)
   - Current relationship tracked via `current_beneficiary_id` and `current_device_id`
   - Historical relationships tracked in `device_assignments` table

2. **devices** → **installed_apps** (One-to-Many)
   - Each device can have multiple installed apps

3. **devices** → **app_sessions** (One-to-Many)
   - Each device can have multiple app sessions

4. **devices** → **network_usages** (One-to-Many)
   - Each device can have multiple network usage records

5. **devices** → **usage_events** (One-to-Many)
   - Each device can have multiple usage events

6. **devices** → **screen_sessions** (One-to-Many)
   - Each device can have multiple screen sessions

7. **devices** → **sync_logs** (One-to-Many)
   - Each device can have multiple sync log entries

### Data Flow

1. **Device Registration**: Devices are registered with basic information
2. **Device Assignment**: Devices are assigned to beneficiaries
3. **Data Collection**: Devices collect telemetry data (app sessions, network usage, etc.)
4. **Data Synchronization**: Data is synced to the server and logged
5. **Analytics**: Data is queried through views for analytics and reporting



