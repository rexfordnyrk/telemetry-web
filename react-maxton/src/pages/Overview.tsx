import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";
import SafeApexChart from "../components/SafeApexChart";
import { RootState } from "../store";
import { buildApiUrl, getAuthHeaders } from "../config/api";
import { OverviewDashboardApiResponse, DashboardWidgets, GlobalFilters } from "../types/dashboard";

// Import dashboard components
import {
  ConfigurableWelcomeCard,
  DeviceTypeWidget,
  CampaignStatsWidget,
  StatCard,
} from "../components/dashboard";

// Import ecommerce components
import { SocialRevenueWidget } from "../components/ecommerce";

// Import existing widget components
import {
  IconRadialChartWidget,
  IconAreaChartWidget,
  IconBarChartWidget,
  IconLineChartWidget,
  UsageStatsByProgrammeWidget,
  BeneficiaryActivityWidget,
  DataConsumerAppsWidget,
} from "../components/widgets";

// Filter Controls Component Props
interface FilterControlsProps {
  token: string | null;
  globalFilters: GlobalFilters | null;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardWidgets | null>>;
  setGlobalFilters: React.Dispatch<React.SetStateAction<GlobalFilters | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Filter Controls Component
const FilterControls: React.FC<FilterControlsProps> = ({
  token,
  globalFilters,
  setDashboardData,
  setGlobalFilters,
  setIsLoading,
  setError
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(globalFilters?.selectedPeriod || "Today");
  const [selectedProgramme, setSelectedProgramme] = useState(globalFilters?.selectedProgramme || "All Programmes");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(true);

  // Update local filter states when globalFilters from API changes
  useEffect(() => {
    if (globalFilters) {
      setSelectedPeriod(globalFilters.selectedPeriod || "Today");
      setSelectedProgramme(globalFilters.selectedProgramme || "All Programmes");
    }
  }, [globalFilters]);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setShowCustomDatePickers(value === "Custom");
    setShowDateInputs(true); // Always show inputs when period changes
    if (value !== "Custom") {
      setStartDateTime("");
      setEndDateTime("");
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDateTime(value);
    } else {
      setEndDateTime(value);
    }

    // Check if both dates are filled to hide inputs and show preview
    const otherDate = type === 'start' ? endDateTime : startDateTime;
    if (value && otherDate) {
      setShowDateInputs(false);
    }
  };

  const handlePreviewClick = () => {
    setShowDateInputs(true);
  };

  const convertToEpochMilliseconds = (dateTimeString: string): number => {
    return new Date(dateTimeString).getTime();
  };

  const formatCustomDateRange = (): string => {
    if (startDateTime && endDateTime) {
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
    }
    return "Custom";
  };

  const handleApplyFilters = async () => {
    let periodValue = selectedPeriod;

    if (selectedPeriod === "Custom" && startDateTime && endDateTime) {
      const startEpoch = convertToEpochMilliseconds(startDateTime);
      const endEpoch = convertToEpochMilliseconds(endDateTime);
      periodValue = `${startEpoch}:${endEpoch}`;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if we have authentication token
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build URL with query parameters
      const url = buildApiUrl('/api/v1/analytics/dashboard/overview');
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('period', periodValue);
      urlWithParams.searchParams.append('programme', selectedProgramme);

      // Make authenticated API request with filters
      const response = await fetch(urlWithParams.toString(), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: OverviewDashboardApiResponse = await response.json();
      setDashboardData(data.data.widgets);
      setGlobalFilters(data.data.globalFilters);
    } catch (err) {
      console.error('Failed to fetch filtered dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load filtered dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      <Form.Select
        size="sm"
        value={selectedPeriod}
        onChange={(e) => handlePeriodChange(e.target.value)}
        style={{ width: "120px" }}
      >
        {globalFilters?.availablePeriods?.map((period: string) => (
          <option key={period} value={period}>{period}</option>
        )) || (
          <>
            <option>Today</option>
            <option>Last Week</option>
            <option>Last Month</option>
            <option>Last Year</option>
          </>
        )}
        <option>Custom</option>
      </Form.Select>

      {showCustomDatePickers && (
        <>
          {showDateInputs ? (
            <>
              <div className="d-flex align-items-center gap-1">
                <label className="form-label mb-0 small text-muted">From:</label>
                <input
                  type="datetime-local"
                  className="form-control form-control-sm"
                  value={startDateTime}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  style={{ width: "180px" }}
                />
              </div>
              <div className="d-flex align-items-center gap-1">
                <label className="form-label mb-0 small text-muted">To:</label>
                <input
                  type="datetime-local"
                  className="form-control form-control-sm"
                  value={endDateTime}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  style={{ width: "180px" }}
                />
              </div>
            </>
          ) : (
            <div
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-3"
              onClick={handlePreviewClick}
              style={{ cursor: "pointer", fontSize: "12px" }}
              title="Click to edit date range"
            >
              <i className="material-icons-outlined" style={{ fontSize: "16px" }}>edit_calendar</i>
              {formatCustomDateRange()}
            </div>
          )}
        </>
      )}

      <Form.Select
        size="sm"
        value={selectedProgramme}
        onChange={(e) => setSelectedProgramme(e.target.value)}
        style={{ width: "160px" }}
      >
        {globalFilters?.availableProgrammes?.map((programme: string) => (
          <option key={programme} value={programme}>{programme}</option>
        )) || (
          <>
            <option>All Programmes</option>
            <option>Digital Literacy</option>
            <option>Skills Training</option>
            <option>Financial Education</option>
            <option>Health Awareness</option>
            <option>Youth Development</option>
          </>
        )}
      </Form.Select>

      <button
        className="btn btn-primary btn-sm px-3"
        onClick={handleApplyFilters}
        disabled={showCustomDatePickers && (!startDateTime || !endDateTime)}
      >
        <i className="material-icons-outlined me-1" style={{ fontSize: "16px" }}>filter_alt</i>
        Filter
      </button>
    </div>
  );
};



const Overview: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardWidgets | null>(null);
  const [globalFilters, setGlobalFilters] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have authentication token
        if (!token) {
          throw new Error('No authentication token available');
        }

        // Make authenticated API request
        const url = buildApiUrl('/api/v1/analytics/dashboard/overview');
        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(token),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: OverviewDashboardApiResponse = await response.json();
        setDashboardData(data.data.widgets);
        setGlobalFilters(data.data.globalFilters);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        // Keep dashboardData as null to use fallback data
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a token
    if (token) {
      fetchDashboardData();
    } else {
      setError('Authentication required');
      setIsLoading(false);
    }
  }, [token]);

  // Retry function for manual retry
  const retryFetchData = () => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have authentication token
        if (!token) {
          throw new Error('No authentication token available');
        }

        // Make authenticated API request
        const url = buildApiUrl('/api/v1/analytics/dashboard/overview');
        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(token),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: OverviewDashboardApiResponse = await response.json();
        setDashboardData(data.data.widgets);
        setGlobalFilters(data.data.globalFilters);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a token
    if (token) {
      fetchDashboardData();
    } else {
      setError('Authentication required');
      setIsLoading(false);
    }
  };

  // Generate user initials if no avatar
  const getUserInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Fallback user data
  const currentUser = user || {
    id: "1",
    username: "Rexford Nyarko",
    email: "user@example.com",
    firstName: "Rexford",
    lastName: "Nyarko",
    fullName: "Rexford Nyarko",
    photo: "",
    roles: [],
    permissions: []
  };

  const userInitials = getUserInitials(currentUser.firstName, currentUser.lastName, currentUser.username);
  const displayName = currentUser.fullName || currentUser.username || "User";
  const userAvatar = currentUser.photo;

  // Helper function to get widget data with fallback to default values
  const getWidgetData = <T extends keyof DashboardWidgets>(
    widgetKey: T,
    fallbackData: DashboardWidgets[T]
  ): DashboardWidgets[T] => {
    // If loading or error, use fallback data
    if (isLoading || error || !dashboardData) {
      return fallbackData;
    }

    // Return API data if available, otherwise fallback
    return dashboardData[widgetKey] || fallbackData;
  };

  // Fallback data for widgets (current hardcoded values)
  const fallbackData = {
    configurableWelcomeCard: {
      primaryValue: "1,234",
      secondaryValue: "89.2%",
      primaryLabel: "Active Devices",
      secondaryLabel: "Sync Success Rate",
      primaryProgress: 85,
      secondaryProgress: 89,
      showWelcomeImage: false
    },
    avgScreentime: {
      title: "Avg Screentime",
      value: "4.2 hrs",
      changePercentage: "15.3%",
      changeDirection: "up" as const,
      chartId: "avg-screentime-chart",
      subtitle: "rise from the last month",
      data: [3, 5, 4, 6, 4, 5, 6, 4, 5],
      colors: ["#ffd700"],
      gradientColors: ["#ff8c00"],
      icon: "schedule",
      iconBgClass: "bg-warning bg-opacity-10 text-warning",
      showDropdown: false
    },
    avgNetUsage: {
      title: "Avg Net Usage",
      value: "25.6 GB",
      changePercentage: "18.2%",
      changeDirection: "up" as const,
      chartId: "avg-net-usage-chart",
      subtitle: "more data consumed monthly",
      data: [12, 18, 22, 15, 28, 35, 30, 40, 32],
      colors: ["#6f42c1"],
      gradientColors: ["#e83e8c"],
      icon: "network_check",
      iconBgClass: "bg-info bg-opacity-10 text-info",
      showDropdown: false
    },
    mostUsedApp: {
      title: "Most Used App",
      value: "59 hrs",
      changePercentage: "24.5%",
      changeDirection: "up" as const,
      chartId: "most-used-app-chart",
      subtitle: "WhatsApp monthly usage increased by 24.5%",
      data: [15, 25, 30, 20, 35, 40, 28, 45, 38],
      colors: ["#25d366"],
      gradientColors: ["#128c7e"],
      iconImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjAxMSAyQzE3LjUwNiAyIDIxLjk5NiA2LjQ4IDIxLjk5NiAxMkMyMS45OTYgMTcuNTIgMTcuNTA2IDIyIDEyLjAxMSAyMkMxMC4xMDEgMjIgOC4zMjUgMjEuNDM1IDYuNzg5IDIwLjQ4NEwyIDIyTDMuNTE4IDE3LjQ2QzIuNTEzIDE1Ljg1NyAyIDEzLjk5NyAyIDEyQzIgNi40OCA2LjQ5IDIgMTIuMDExIDJaTTguMzUgNy4zQzguMjMgNy4zIDcuODggNy4zNSA3LjQzIDcuNzI0QzYuOTggOC4wOTkgNi4wMSA5LjAzMSA2LjAxIDEwLjE0NUM2LjAxIDExLjI2IDYuODg2IDEyLjk3IDYuODg2IDEyLjk3QzYuODg2IDEyLjk3IDEwLjU1NiAxOC40MjIgMTcuMzYgMTguNDIyQzE3LjM2IDE4LjQyMiAxNy45MDggMTYuNTA0IDE4LjAzNCAxNS44NzdDMTguMDYgMTUuNzA5IDE4LjAyIDE1LjAzMiAxNy44IDEyLjk3QzE3LjggMTIuOTcgMTQuNjUgMTQuMTE3IDEyLjg5IDE0LjExN0MxMi44OSAxNC4xMTcgMTEuMzM1IDEyLjI2IDExLjMzNSAxMi4yNkwxMS4zNDQgMTEuODQyTDExLjM0NyAxMS42OTdDMTEuMzQ3IDExLjE0NSAxMS43MzggMTAuNjM5IDEyLjI2IDEwLjE3NkMxMi42MDYgOS44NTggMTMuMDcgOS41NTUgMTMuNzQyIDkuNTU1QzE0LjQxNCA5LjU1NSAxNC44NTggOS42NTggMTQuODU4IDkuNjU4TDE0Ljg2IDEwLjMwOUwxNC44NjEgMTEuNDEzQzE0Ljg2MSAxMS40MTMgMTYuMjM2IDExLjQwNSAxNi4zMzUgMTEuMTcyQzE2LjQzNSAxMC45MzkgMTYuMjYzIDEwLjE0NiAxNi4yNjMgMTAuMTQ2QzE2LjI2MyAxMC4xNDYgMTYuNTQyIDkuMDA2IDE2LjE5IDguMjk4QzE1LjgzOCA3LjU5IDEzLjU4OSA3LjI5OCAxMy41ODkgNy4yOThTMTIuNjUzIDcuMjk4IDEyLjY1MyA3LjI5OEwxMi41MjcgNy4yOThDMTEuODkgNy4yOTggMTEuMjM1IDcuMjk4IDExLjIzNSA3LjI5OFM5LjE3MiA3LjI4OSA4LjQ5IDcuMjk4QzguMzYxIDcuMyA4LjM1IDcuMyA4LjM1IDcuM1oiIGZpbGw9IiMyNUQ0NjYiLz4KPC9zdmc+Cg==",
      iconBgClass: "bg-success bg-opacity-10 text-success",
      showDropdown: false
    },
    appSessionsSynced: {
      title: "App Sessions Synced",
      value: "42.5K",
      subtitle: "24K increase in monthly app activity",
      chartId: "radial-chart-1",
      series: [68],
      colors: ["#ee0979"],
      gradientColors: ["#ffd200"],
      iconImage: "/assets/images/logo-icon.png",
      iconBgClass: "bg-warning bg-opacity-10 text-warning",
      showDropdown: false
    }
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Dashboard</div>
        <div className="ps-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <a href="#">
                  <i className="bx bx-home-alt"></i>
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Overview
              </li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Data Source Indicator */}
          <div className="d-flex align-items-center">
            <span className={`badge ${dashboardData && !error ? 'bg-success' : 'bg-warning'} me-2`}>
              <i className={`bx ${dashboardData && !error ? 'bx-check-circle' : 'bx-info-circle'} me-1`}></i>
              {isLoading ? 'Loading...' : dashboardData && !error ? 'Live Data' : 'Fallback Data'}
            </span>
          </div>
          <FilterControls
            token={token}
            globalFilters={globalFilters}
            setDashboardData={setDashboardData}
            setGlobalFilters={setGlobalFilters}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          <strong>Data Loading Warning:</strong> {error}
          <br />
          <small className="text-muted">Displaying fallback data. You can try refreshing the data below.</small>
          <div className="mt-2">
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={retryFetchData}
              disabled={isLoading}
            >
              <i className="bx bx-refresh me-1"></i>
              Retry Loading Data
            </button>
          </div>
        </div>
      )}

      <Row className="g-3">
        {/* Row 1: Active Devices Card + Screentime + Net Usage + Active Users + Most Used App */}
        <Col xxl={4} className="d-flex align-items-stretch">
          {(() => {
            const welcomeCardData = getWidgetData('configurableWelcomeCard', fallbackData.configurableWelcomeCard);
            return (
              <ConfigurableWelcomeCard
                userName={displayName}
                userAvatar={userAvatar}
                userInitials={userInitials}
                primaryValue={welcomeCardData.primaryValue}
                secondaryValue={welcomeCardData.secondaryValue}
                primaryLabel={welcomeCardData.primaryLabel}
                secondaryLabel={welcomeCardData.secondaryLabel}
                primaryProgress={welcomeCardData.primaryProgress}
                secondaryProgress={welcomeCardData.secondaryProgress}
                showWelcomeImage={welcomeCardData.showWelcomeImage}
              />
            );
          })()}
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          {(() => {
            const screentimeData = getWidgetData('avgScreentime', fallbackData.avgScreentime);
            return (
              <IconAreaChartWidget
                title={screentimeData.title}
                value={screentimeData.value}
                changePercentage={screentimeData.changePercentage}
                changeDirection={screentimeData.changeDirection}
                chartId={screentimeData.chartId}
                subtitle={screentimeData.subtitle}
                data={screentimeData.data}
                colors={screentimeData.colors}
                gradientColors={screentimeData.gradientColors}
                icon={screentimeData.icon}
                iconImage={screentimeData.iconImage}
                iconBgClass={screentimeData.iconBgClass}
                showDropdown={screentimeData.showDropdown}
              />
            );
          })()}
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          {(() => {
            const netUsageData = getWidgetData('avgNetUsage', fallbackData.avgNetUsage);
            return (
              <IconAreaChartWidget
                title={netUsageData.title}
                value={netUsageData.value}
                changePercentage={netUsageData.changePercentage}
                changeDirection={netUsageData.changeDirection}
                chartId={netUsageData.chartId}
                subtitle={netUsageData.subtitle}
                data={netUsageData.data}
                colors={netUsageData.colors}
                gradientColors={netUsageData.gradientColors}
                icon={netUsageData.icon}
                iconImage={netUsageData.iconImage}
                iconBgClass={netUsageData.iconBgClass}
                showDropdown={netUsageData.showDropdown}
              />
            );
          })()}
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconAreaChartWidget
            title={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).title}
            value={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).value}
            changePercentage={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).changePercentage}
            changeDirection={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).changeDirection}
            chartId={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).chartId}
            subtitle={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).subtitle}
            data={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).data}
            colors={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).colors}
            gradientColors={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).gradientColors}
            iconImage="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjAxMSAyQzE3LjUwNiAyIDIxLjk5NiA2LjQ4IDIxLjk5NiAxMkMyMS45OTYgMTcuNTIgMTcuNTA2IDIyIDEyLjAxMSAyMkMxMC4xMDEgMjIgOC4zMjUgMjEuNDM1IDYuNzg5IDIwLjQ4NEwyIDIyTDMuNTE4IDE3LjQ2QzIuNTEzIDE1Ljg1NyAyIDEzLjk5NyAyIDEyQzIgNi40OCA2LjQ5IDIgMTIuMDExIDJaTTguMzUgNy4zQzguMjMgNy4zIDcuODggNy4zNSA3LjQzIDcuNzI0QzYuOTggOC4wOTkgNi4wMSA5LjAzMSA2LjAxIDEwLjE0NUM2LjAxIDExLjI2IDYuODg2IDEyLjk3IDYuODg2IDEyLjk3QzYuODg2IDEyLjk3IDEwLjU1NiAxOC40MjIgMTcuMzYgMTguNDIyQzE3LjM2IDE4LjQyMiAxNy45MDggMTYuNTA0IDE4LjAzNCAxNS44NzdDMTguMDYgMTUuNzA5IDE4LjAyIDE1LjAzMiAxNy44IDEyLjk3QzE3LjggMTIuOTcgMTQuNjUgMTQuMTE3IDEyLjg5IDE0LjExN0MxMi44OSAxNC4xMTcgMTEuMzM1IDEyLjI2IDExLjMzNSAxMi4yNkwxMS4zNDQgMTEuODQyTDExLjM0NyAxMS42OTdDMTEuMzQ3IDExLjE0NSAxMS43MzggMTAuNjM5IDEyLjI2IDEwLjE3NkMxMi42MDYgOS44NTggMTMuMDcgOS41NTUgMTMuNzQyIDkuNTU1QzE0LjQxNCA5LjU1NSAxNC44NTggOS42NTggMTQuODU4IDkuNjU4TDE0Ljg2IDEwLjMwOUwxNC44NjEgMTEuNDEzQzE0Ljg2MSAxMS40MTMgMTYuMjM2IDExLjQwNSAxNi4zMzUgMTEuMTcyQzE2LjQzNSAxMC45MzkgMTYuMjYzIDEwLjE0NiAxNi4yNjMgMTAuMTQ2QzE2LjI2MyAxMC4xNDYgMTYuNTQyIDkuMDA2IDE2LjE5IDguMjk4QzE1LjgzOCA3LjU5IDEzLjU4OSA7LjI5OCAxMy41ODkgNy4yOThTMTIuNjUzIDcuMjk4IDEyLjY1MyA3LjI5OEwxMi41MjcgNy4yOThDMTEuODkgNy4yOTggMTEuMjM1IDcuMjk4IDExLjIzNSA3LjI5OFM5LjE3MiA3LjI4OSA4LjQ5IDcuMjk4QzguMzYxIDcuMyA4LjM1IDcuMyA4LjM1IDcuM1oiIGZpbGw9IiMyNUQ0NjYiLz4KPC9zdmc+Cg=="
            iconBgClass={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).iconBgClass}
            showDropdown={getWidgetData('mostUsedApp', fallbackData.mostUsedApp).showDropdown}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconRadialChartWidget
            title={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).title}
            value={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).value}
            subtitle={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).subtitle}
            chartId={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).chartId}
            series={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).series}
            colors={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).colors}
            gradientColors={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).gradientColors}
            iconImage={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).iconImage}
            iconBgClass={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).iconBgClass}
            showDropdown={getWidgetData('appSessionsSynced', fallbackData.appSessionsSynced).showDropdown}
          />
        </Col>

        {/* Row 2: Usage Stats by Programme + Nested Widgets */}
        <Col xxl={8} lg={12} className="d-flex align-items-stretch">
          <UsageStatsByProgrammeWidget showDropdown={true} />
        </Col>

        <Col xxl={4}>
          <Row className="g-3 mb-3">
            <Col md={6} className="d-flex align-items-stretch">
              <IconBarChartWidget
                title="Most Visited App"
                value="82.7K"
                subtitle="WhatsApp had 12.5% more monthly visits"
                chartId="bar-chart-1"
                data={[4, 10, 12, 17, 25, 30, 40, 55, 68]}
                colors={["#ff6a00"]}
                gradientColors={["#7928ca"]}
                icon="open_in_browser"
                iconBgClass="bg-warning bg-opacity-10 text-warning"
                showDropdown={false}
              />
            </Col>
            <Col md={6} className="d-flex align-items-stretch">
              <IconLineChartWidget
                title="Top Data Consumer"
                value="68.4 GB"
                subtitle="Instagram used 35% more data this month"
                chartId="line-chart-1"
                data={[4, 25, 14, 34, 10, 39]}
                colors={["#ee0979"]}
                gradientColors={["#00f2fe"]}
                icon="data_usage"
                iconBgClass="bg-danger bg-opacity-10 text-danger"
                showDropdown={false}
              />
            </Col>
          </Row>
          <StatCard
            data={{
              title: "Highest Participant Screentime",
              value: "124.5 hrs",
              subtitle: "Sarah M. recorded highest usage this month",
              changePercentage: "23.7%",
              changeDirection: "down",
              chartComponent: (
                <SafeApexChart
                  options={{
                    series: [
                      {
                        name: "Total Accounts",
                        data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
                      },
                    ],
                    chart: {
                      height: 105,
                      type: "area",
                      sparkline: {
                        enabled: true,
                      },
                      zoom: {
                        enabled: false,
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      width: 3,
                      curve: "smooth",
                    },
                    fill: {
                      type: "gradient",
                      gradient: {
                        shade: "dark",
                        gradientToColors: ["#fc185a"],
                        shadeIntensity: 1,
                        type: "vertical",
                        opacityFrom: 0.8,
                        opacityTo: 0.2,
                      },
                    },
                    colors: ["#ffc107"],
                    tooltip: {
                      theme: "dark",
                      fixed: {
                        enabled: false,
                      },
                      x: {
                        show: false,
                      },
                      y: {
                        title: {
                          formatter: function () {
                            return "";
                          },
                        },
                      },
                      marker: {
                        show: false,
                      },
                    },
                    xaxis: {
                      categories: [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                      ],
                    },
                  }}
                  series={[
                    {
                      name: "Total Accounts",
                      data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
                    },
                  ]}
                  type="area"
                  height={105}
                />
              ),
            }}
          />
        </Col>

        {/* Row 3: Top 5 Used Apps + Top 5 Data Consumers + Device Sync Stats */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <SocialRevenueWidget
            data={{
              title: "Top 5 Used Apps",
              totalRevenue: "654 hrs",
              totalChange: "+15%",
              totalChangeDirection: "up",
              subtitle: "total Usage this month",
              platforms: [
                {
                  name: "WhatsApp",
                  category: "Communication",
                  icon: "/assets/images/apps/17.png",
                  revenue: "145 hrs",
                  change: "+28.5%",
                  changeDirection: "up",
                },
                {
                  name: "Facebook",
                  category: "Social Media",
                  icon: "/assets/images/apps/03.png",
                  revenue: "132 hrs",
                  change: "-14.5%",
                  changeDirection: "down",
                },
                {
                  name: "Instagram",
                  category: "Social Media",
                  icon: "/assets/images/apps/19.png",
                  revenue: "118 hrs",
                  change: "+28.5%",
                  changeDirection: "up",
                },
                {
                  name: "YouTube",
                  category: "Entertainment",
                  icon: "/assets/images/apps/20.png",
                  revenue: "134 hrs",
                  change: "-43.5%",
                  changeDirection: "down",
                },
                {
                  name: "TikTok",
                  category: "Entertainment",
                  icon: "/assets/images/apps/twitter-circle.png",
                  revenue: "125 hrs",
                  change: "+24.7%",
                  changeDirection: "up",
                },
              ],
            }}
            showDropdown={false}
          />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <DataConsumerAppsWidget showDropdown={false} />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <CampaignStatsWidget
            data={{
              title: "Device Sync Stats",
              stats: [
                {
                  title: "Installed Apps",
                  value: "124",
                  percentage: "18%",
                  icon: "apps",
                  bgClass: "bg-grd-primary",
                  textClass: "text-success",
                },
                {
                  title: "App Sessions",
                  value: "3,245",
                  percentage: "25%",
                  icon: "play_circle",
                  bgClass: "bg-grd-success",
                  textClass: "text-success",
                },
                {
                  title: "Network Usage",
                  value: "656 GB",
                  percentage: "12%",
                  icon: "network_check",
                  bgClass: "bg-grd-branding",
                  textClass: "text-success",
                },
                {
                  title: "Screen Sessions",
                  value: "1,856",
                  percentage: "8%",
                  icon: "screen_rotation",
                  bgClass: "bg-grd-warning",
                  textClass: "text-danger",
                },
                {
                  title: "Usage Events",
                  value: "12,340",
                  percentage: "15%",
                  icon: "event",
                  bgClass: "bg-grd-info",
                  textClass: "text-success",
                },
                {
                  title: "Avg Sync Time",
                  value: "2.4s",
                  percentage: "5%",
                  icon: "sync",
                  bgClass: "bg-grd-danger",
                  textClass: "text-danger",
                },
                {
                  title: "Failed Syncs",
                  value: "23",
                  percentage: "2%",
                  icon: "sync_problem",
                  bgClass: "bg-grd-royal",
                  textClass: "text-danger",
                },
              ],
            }}
            showDropdown={false}
          />
        </Col>

        {/* Row 4: App vs Background Usage + Beneficiary Activity Overview */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <DeviceTypeWidget
            data={{
              title: "App vs Background Usage",
              centerTitle: "Total Data Usage",
              centerValue: "656.8 GB",
              series: [68, 32],
              labels: ["Active Apps", "Background Usage"],
              colors: ["#3494e6", "#ff6a00"],
              gradientColors: ["#ec6ead", "#ee0979"],
              devices: [
                {
                  name: "Active Apps",
                  icon: "apps",
                  percentage: "68%",
                  iconColor: "text-primary",
                },
                {
                  name: "Background Usage",
                  icon: "cloud_sync",
                  percentage: "32%",
                  iconColor: "text-warning",
                },
              ],
            }}
            showDropdown={false}
          />
        </Col>

        <Col xxl={8} lg={12} className="d-flex align-items-stretch">
          <BeneficiaryActivityWidget showDropdown={true} />
        </Col>


      </Row>
    </MainLayout>
  );
};

export default Overview;
