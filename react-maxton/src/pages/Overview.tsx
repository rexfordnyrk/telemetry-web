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

// Import existing widget components
import {
  RadialChartWidget,
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
        {/* Row 1: Welcome Card + Active Users + Total Users */}
        <Col xxl={8} className="d-flex align-items-stretch">
          <WelcomeCard />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <RadialChartWidget
            title="Active Users"
            value="42.5K"
            subtitle="24K users increased from last month"
            chartId="radial-chart-1"
            series={[78]}
            colors={["#ee0979"]}
            gradientColors={["#ffd200"]}
          />
        </Col>

        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <AreaChartWidget
            title="Total Users"
            value="97.4K"
            changePercentage="12.5%"
            changeDirection="up"
            chartId="area-chart-1"
            subtitle="from last month"
            data={[4, 10, 25, 12, 25, 18, 40, 22, 7]}
            colors={["#02c27a"]}
            gradientColors={["#0866ff"]}
          />
        </Col>

        {/* Row 2: Active Devices Card & Most Used App */}
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

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <IconAreaChartWidget
            title="Most Used App"
            value="WhatsApp"
            changePercentage="24.5%"
            changeDirection="up"
            chartId="most-used-app-chart"
            subtitle="usage increase"
            data={[15, 25, 30, 20, 35, 40, 28, 45, 38]}
            colors={["#25d366"]}
            gradientColors={["#128c7e"]}
            icon="apps"
            iconBgClass="bg-success bg-opacity-10 text-success"
          />
        </Col>

        {/* Row 3: Monthly Revenue + Device Type + Nested Section (Total Clicks, Total Views, Total Accounts) */}
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

        {/* Row 4: Campaign Stats + Visitors Growth + Social Leads */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <CampaignStatsWidget />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <VisitorsGrowthWidget />
        </Col>

        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <SocialLeadsWidget />
        </Col>

        {/* Row 5: New Users + Recent Orders */}
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
