import React from "react";
import { Row, Col } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import SafeApexChart from "../components/SafeApexChart";

// Import dashboard components
import {
  WelcomeCard,
  ConfigurableWelcomeCard,
  MonthlyRevenueWidget,
  DeviceTypeWidget,
  CampaignStatsWidget,
  SocialLeadsWidget,
  NewUsersWidget,
  RecentOrdersWidget,
  VisitorsGrowthWidget,
  StatCard,
} from "../components/dashboard";

// Import ecommerce components
import { SocialRevenueWidget } from "../components/ecommerce";

// Import existing widget components
import {
  RadialChartWidget,
  IconRadialChartWidget,
  AreaChartWidget,
  IconAreaChartWidget,
  BarChartWidget,
  LineChartWidget,
} from "../components/widgets";

const Overview: React.FC = () => {
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
        <div className="ms-auto">
          <div className="btn-group">
            <button type="button" className="btn btn-outline-primary">
              Settings
            </button>
            <button
              type="button"
              className="btn btn-outline-primary split-bg-primary dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <div className="dropdown-menu dropdown-menu-right dropdown-menu-lg-end">
              <a className="dropdown-item" href="#">
                Action
              </a>
              <a className="dropdown-item" href="#">
                Another action
              </a>
              <a className="dropdown-item" href="#">
                Something else here
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">
                Separated link
              </a>
            </div>
          </div>
        </div>
      </div>

      <Row>
        {/* Row 1: Active Devices Card + Screentime + Net Usage + Active Users + Most Used App */}
        <Col xxl={4} className="d-flex align-items-stretch">
          <ConfigurableWelcomeCard
            userName="John Anderson"
            userAvatar="/assets/images/avatars/01.png"
            primaryValue="1,234"
            secondaryValue="89.2%"
            primaryLabel="Active Devices"
            secondaryLabel="Sync Success Rate"
            primaryProgress={85}
            secondaryProgress={89}
            showWelcomeImage={false}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconAreaChartWidget
            title="Avg Screentime"
            value="4.2 hrs"
            changePercentage="15.3%"
            changeDirection="up"
            chartId="avg-screentime-chart"
            subtitle="rise from the last month"
            data={[3, 5, 4, 6, 4, 5, 6, 4, 5]}
            colors={["#ffd700"]}
            gradientColors={["#ff8c00"]}
            icon="schedule"
            iconBgClass="bg-warning bg-opacity-10 text-warning"
            showDropdown={false}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconAreaChartWidget
            title="Avg Net Usage"
            value="25.6 GB"
            changePercentage="18.2%"
            changeDirection="up"
            chartId="avg-net-usage-chart"
            subtitle="data consumed"
            data={[12, 18, 22, 15, 28, 35, 30, 40, 32]}
            colors={["#6f42c1"]}
            gradientColors={["#e83e8c"]}
            icon="network_check"
            iconBgClass="bg-info bg-opacity-10 text-info"
            showDropdown={false}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconAreaChartWidget
            title="Most Used App"
            value="WhatsApp"
            changePercentage="24.5%"
            changeDirection="up"
            chartId="most-used-app-chart"
            subtitle="increase in the last month"
            data={[15, 25, 30, 20, 35, 40, 28, 45, 38]}
            colors={["#25d366"]}
            gradientColors={["#128c7e"]}
            iconImage="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjAxMSAyQzE3LjUwNiAyIDIxLjk5NiA2LjQ4IDIxLjk5NiAxMkMyMS45OTYgMTcuNTIgMTcuNTA2IDIyIDEyLjAxMSAyMkMxMC4xMDEgMjIgOC4zMjUgMjEuNDM1IDYuNzg5IDIwLjQ4NEwyIDIyTDMuNTE4IDE3LjQ2QzIuNTEzIDE1Ljg1NyAyIDEzLjk5NyAyIDEyQzIgNi40OCA2LjQ5IDIgMTIuMDExIDJaTTguMzUgNy4zQzguMjMgNy4zIDcuODggNy4zNSA3LjQzIDcuNzI0QzYuOTggOC4wOTkgNi4wMSA5LjAzMSA2LjAxIDEwLjE0NUM2LjAxIDExLjI2IDYuODg2IDEyLjk3IDYuODg2IDEyLjk3QzYuODg2IDEyLjk3IDEwLjU1NiAxOC40MjIgMTcuMzYgMTguNDIyQzE3LjM2IDE4LjQyMiAxNy45MDggMTYuNTA0IDE4LjAzNCAxNS44NzdDMTguMDYgMTUuNzA5IDE4LjAyIDE1LjAzMiAxNy44IDEyLjk3QzE3LjggMTIuOTcgMTQuNjUgMTQuMTE3IDEyLjg5IDE0LjExN0MxMi44OSAxNC4xMTcgMTEuMzM1IDEyLjI2IDExLjMzNSAxMi4yNkwxMS4zNDQgMTEuODQyTDExLjM0NyAxMS42OTdDMTEuMzQ3IDExLjE0NSAxMS43MzggMTAuNjM5IDEyLjI2IDEwLjE3NkMxMi42MDYgOS44NTggMTMuMDcgOS41NTUgMTMuNzQyIDkuNTU1QzE0LjQxNCA5LjU1NSAxNC44NTggOS42NTggMTQuODU4IDkuNjU4TDE0Ljg2IDEwLjMwOUwxNC44NjEgMTEuNDEzQzE0Ljg2MSAxMS40MTMgMTYuMjM2IDExLjQwNSAxNi4zMzUgMTEuMTcyQzE2LjQzNSAxMC45MzkgMTYuMjYzIDEwLjE0NiAxNi4yNjMgMTAuMTQ2QzE2LjI2MyAxMC4xNDYgMTYuNTQyIDkuMDA2IDE2LjE5IDguMjk4QzE1LjgzOCA3LjU5IDEzLjU4OSA3LjI5OCAxMy41ODkgNy4yOThTMTIuNjUzIDcuMjk4IDEyLjY1MyA3LjI5OEwxMi41MjcgNy4yOThDMTEuODkgNy4yOTggMTEuMjM1IDcuMjk4IDExLjIzNSA3LjI5OFM5LjE3MiA3LjI4OSA4LjQ5IDcuMjk4QzguMzYxIDcuMyA4LjM1IDcuMyA4LjM1IDcuM1oiIGZpbGw9IiMyNUQ0NjYiLz4KPC9zdmc+Cg=="
            iconBgClass="bg-success bg-opacity-10 text-success"
            showDropdown={false}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <IconRadialChartWidget
            title="App Sessions Synced"
            value="42.5K"
            subtitle="24K increase in app activity from last month"
            chartId="radial-chart-1"
            series={[68]}
            colors={["#ee0979"]}
            gradientColors={["#ffd200"]}
            iconImage="/assets/images/logo-icon.png"
            iconBgClass="bg-warning bg-opacity-10 text-warning"
            showDropdown={false}
          />
        </Col>

        {/* Row 2: Monthly Revenue + Device Type + Nested Section (Total Clicks, Total Views, Total Accounts) */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <MonthlyRevenueWidget />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <DeviceTypeWidget />
        </Col>

        <Col xxl={4}>
          <Row>
            <Col md={6} className="d-flex align-items-stretch">
              <BarChartWidget
                title="Total Clicks"
                value="82.7K"
                subtitle="12.5% from last month"
                chartId="bar-chart-1"
                data={[4, 10, 12, 17, 25, 30, 40, 55, 68]}
                colors={["#ff6a00"]}
                gradientColors={["#7928ca"]}
              />
            </Col>
            <Col sm={6} className="d-flex align-items-stretch">
              <LineChartWidget
                title="Total Views"
                value="68.4K"
                subtitle="35K users increased from last month"
                chartId="line-chart-1"
                data={[4, 25, 14, 34, 10, 39]}
                colors={["#ee0979"]}
                gradientColors={["#00f2fe"]}
              />
            </Col>
          </Row>
          <StatCard
            data={{
              title: "Total Accounts",
              value: "85,247",
              subtitle: "accounts registered",
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

        {/* Row 3: Campaign Stats + Visitors Growth + Social Leads */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <CampaignStatsWidget />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <VisitorsGrowthWidget />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <SocialLeadsWidget />
        </Col>

        {/* Row 4: New Users + Recent Orders */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <NewUsersWidget />
        </Col>

        <Col lg={12} xxl={8} className="d-flex align-items-stretch">
          <RecentOrdersWidget />
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Overview;
