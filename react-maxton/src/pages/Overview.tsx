import React from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import SafeApexChart from "../components/SafeApexChart";
import MainLayout from "../layouts/MainLayout";
import "../styles/overview-fixes.css";

const Overview: React.FC = () => {
  // 1. Total Active Devices - Area Chart
  const totalActiveDevicesChart = {
    series: [
      {
        name: "Active Devices",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6],
      },
    ],
    chart: {
      height: 90,
      type: "area" as const,
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
      curve: "smooth" as const,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#0866ff"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.5,
        opacityTo: 0.0,
      },
    },
    colors: ["#02c27a"],
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
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
        "Day 8",
        "Day 9",
      ],
    },
  };

  // 2. Total Beneficiaries - Line Chart
  const totalBeneficiariesChart = {
    series: [
      {
        name: "Beneficiaries",
        data: [35, 41, 35, 26, 28, 24, 22, 18, 15],
      },
    ],
    chart: {
      height: 90,
      type: "line" as const,
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
      curve: "smooth" as const,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#00f2fe"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    colors: ["#ee0979"],
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
    markers: {
      show: false,
      size: 5,
    },
  };

  // 4. New Enrollments This Month - Area Chart
  const newEnrollmentsChart = {
    series: [
      {
        name: "Enrollments",
        data: [10, 15, 12, 8, 20, 18, 16, 14, 12],
      },
    ],
    chart: {
      height: 90,
      type: "area" as const,
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
      curve: "smooth" as const,
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
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
  };

  // 5. Geographic Distribution - Pie Chart
  const geographicDistributionChart = {
    series: [27.5, 25.1, 19.8, 16.6, 10.9],
    chart: {
      height: 250,
      type: "pie" as const,
    },
    legend: {
      position: "bottom" as const,
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#ee0979", "#17ad37", "#ec6ead", "#ff6a00", "#6f42c1"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    colors: ["#0d6efd", "#dc3545", "#198754", "#ffc107", "#6f42c1"],
    dataLabels: {
      enabled: false,
    },
    labels: ["Central", "Northern", "Eastern", "Western", "Southern"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 270,
          },
          legend: {
            position: "bottom" as const,
            show: false,
          },
        },
      },
    ],
  };

  // 6. Sync Success Rate - Bar Chart
  const syncSuccessRateChart = {
    series: [
      {
        name: "Success Rate",
        data: [95, 97, 94, 98, 96, 95, 96],
      },
    ],
    chart: {
      height: 105,
      type: "bar" as const,
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
      width: 1,
      curve: "smooth" as const,
      colors: ["transparent"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#7928ca"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    colors: ["#ff6a00"],
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
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
      ],
    },
  };

  // 10. Network Activity Live - Line Chart
  const networkActivityChart = {
    series: [
      {
        name: "Network Usage",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    chart: {
      height: 180,
      type: "line" as const,
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
      curve: "smooth" as const,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#17ad37"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.7,
        opacityTo: 0.0,
      },
    },
    colors: ["#98ec2d"],
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
    markers: {
      show: false,
      size: 5,
    },
  };

  // 11. Live Sync Status - Radial Bar Chart
  const liveSyncStatusChart = {
    series: [84.2],
    chart: {
      height: 200,
      type: "radialBar" as const,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: "80%",
          background: "transparent",
        },
        track: {
          background: "rgba(0, 0, 0, 0.1)",
          strokeWidth: "67%",
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: false,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            offsetY: 10,
            color: "#111",
            fontSize: "24px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#0d6efd"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ["#0d6efd"],
    stroke: {
      lineCap: "round" as const,
    },
    labels: ["Sync Progress"],
  };

  // Sample data for sync status categories
  const syncStatusData = [
    {
      name: "Recent Syncs",
      description: "Last Hour",
      count: 156,
      percentage: 69.3,
      trend: "up",
      icon: "sync",
      color: "success"
    },
    {
      name: "Stale Syncs",
      description: "1-24 Hours",
      count: 48,
      percentage: 21.3,
      trend: "down",
      icon: "schedule",
      color: "warning"
    },
    {
      name: "Very Stale",
      description: "1-7 Days",
      count: 15,
      percentage: 6.7,
      trend: "up",
      icon: "warning",
      color: "danger"
    },
    {
      name: "No Recent Sync",
      description: ">7 Days",
      count: 6,
      percentage: 2.7,
      trend: "down",
      icon: "error",
      color: "danger"
    }
  ];

  const geographicData = [
    { district: "Central", count: 68, percentage: 27.5 },
    { district: "Northern", count: 62, percentage: 25.1 },
    { district: "Eastern", count: 49, percentage: 19.8 },
    { district: "Western", count: 41, percentage: 16.6 },
    { district: "Southern", count: 27, percentage: 10.9 }
  ];

  return (
    <MainLayout>
      {/* Page Breadcrumb */}
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
        {/* Row 1: Data Collection Coverage */}
        <Col xxl={8} className="d-flex align-items-stretch">
          <Card className="w-100 overflow-hidden rounded-4">
            <Card.Body className="position-relative p-4">
              <Row>
                <Col xs={12} sm={7}>
                  <div className="d-flex align-items-center gap-3 mb-5">
                    <img
                      src="/assets/images/avatars/01.png"
                      className="rounded-circle bg-grd-info p-1"
                      width="60"
                      height="60"
                      alt="user"
                    />
                    <div>
                      <p className="mb-0 fw-semibold">Telemetry System</p>
                      <h4 className="fw-semibold mb-0 fs-4">Overview Dashboard</h4>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-5">
                    <div>
                      <h4 className="mb-1 fw-semibold d-flex align-content-center">
                        94.8%
                        <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                      </h4>
                      <p className="mb-3">Data Collection Coverage</p>
                      <div className="progress mb-0" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-grd-success"
                          role="progressbar"
                          style={{ width: "95%" }}
                          aria-valuenow={95}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                    <div className="vr"></div>
                    <div>
                      <h4 className="mb-1 fw-semibold d-flex align-content-center">
                        213
                        <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                      </h4>
                      <p className="mb-3">Active in Last 7 Days</p>
                      <div className="progress mb-0" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-grd-danger"
                          role="progressbar"
                          style={{ width: "60%" }}
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={5}>
                  <div className="welcome-back-img pt-4">
                    <img
                      src="/assets/images/gallery/welcome-back-3.png"
                      height="180"
                      alt=""
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Active Devices */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div>
                  <h5 className="mb-0">247</h5>
                  <p className="mb-0">Active Devices</p>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    className="dropdown-toggle-nocaret options"
                  >
                    <span className="material-icons-outlined fs-5">
                      more_vert
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Action</Dropdown.Item>
                    <Dropdown.Item>Another action</Dropdown.Item>
                    <Dropdown.Item>Something else here</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="chart-container2">
                <SafeApexChart
                  options={totalActiveDevicesChart}
                  series={totalActiveDevicesChart.series}
                  type="area"
                  height={105}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  12 devices active in last 24h
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Beneficiaries */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-0">189</h5>
                  <p className="mb-0">Total Beneficiaries</p>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    className="dropdown-toggle-nocaret options"
                  >
                    <span className="material-icons-outlined fs-5">
                      more_vert
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Action</Dropdown.Item>
                    <Dropdown.Item>Another action</Dropdown.Item>
                    <Dropdown.Item>Something else here</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="chart-container2">
                <SafeApexChart
                  options={totalBeneficiariesChart}
                  series={totalBeneficiariesChart.series}
                  type="line"
                  height={105}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  <span className="text-success me-1">8.3%</span> enrolled beneficiaries
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Device Assignment Rate */}
        <Col xl={6} xxl={3} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div>
                  <h2 className="mb-0">87.4%</h2>
                </div>
                <div>
                  <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                    <span className="material-icons-outlined fs-6">arrow_upward</span>24.7%
                  </p>
                </div>
              </div>
              <p className="mb-0">Device Assignment Rate</p>
              <div className="mt-4">
                <p className="mb-2 d-flex align-items-center justify-content-between">
                  28 devices unassigned<span>87%</span>
                </p>
                <div className="progress w-100" style={{ height: "6px" }}>
                  <div className="progress-bar bg-grd-purple" style={{ width: "87%" }}></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* New Enrollments This Month */}
        <Col xl={6} xxl={3} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div>
                  <h3 className="mb-0">42</h3>
                </div>
                <div>
                  <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                    <span className="material-icons-outlined fs-6">arrow_downward</span>8.6%
                  </p>
                </div>
              </div>
              <p className="mb-0">New Enrollments This Month</p>
              <div className="chart-container2">
                <SafeApexChart
                  options={newEnrollmentsChart}
                  series={newEnrollmentsChart.series}
                  type="area"
                  height={105}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sync Success Rate */}
        <Col xl={6} xxl={3} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary">
                  <span className="material-icons-outlined fs-5">sync</span>
                </div>
                <div>
                  <span className="text-success d-flex align-items-center">+24%<i className="material-icons-outlined">expand_less</i></span>
                </div>
              </div>
              <div>
                <h4 className="mb-0">96.2%</h4>
                <p className="mb-3">Sync Success Rate</p>
                <div className="chart-container2">
                  <SafeApexChart
                    options={syncSuccessRateChart}
                    series={syncSuccessRateChart.series}
                    type="bar"
                    height={105}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Currently Active Devices */}
        <Col xl={6} xxl={3} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <p className="mb-1">Currently Active Devices</p>
                  <h3 className="mb-0">67</h3>
                </div>
                <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                  <span className="material-icons-outlined fs-5 text-white">devices</span>
                </div>
              </div>
              <div className="progress mb-0" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-grd-danger"
                  role="progressbar"
                  style={{ width: "60%" }}
                  aria-valuenow={60}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="d-flex align-items-center mt-3 gap-2">
                <div className="card-lable bg-success bg-opacity-10">
                  <p className="text-success mb-0">+12.3%</p>
                </div>
                <p className="mb-0 font-12">activity in last 5 minutes</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Geographic Distribution */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h5 className="mb-0">Geographic Distribution</h5>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      className="dropdown-toggle-nocaret options"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="position-relative">
                  <div className="piechart-legend">
                    <h2 className="mb-1">5</h2>
                    <h6 className="mb-0">Districts</h6>
                  </div>
                  <SafeApexChart
                    options={geographicDistributionChart}
                    series={geographicDistributionChart.series}
                    type="pie"
                    height={250}
                  />
                </div>
                <div className="d-flex flex-column gap-3">
                  {geographicData.map((district, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 d-flex align-items-center gap-2 w-25">
                        <span className="material-icons-outlined fs-6" style={{ color: geographicDistributionChart.colors[index] }}>
                          fiber_manual_record
                        </span>
                        {district.district}
                      </p>
                      <div>
                        <p className="mb-0">{district.count} devices</p>
                      </div>
                      <div>
                        <p className="mb-0">{district.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Device Sync Status */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h6 className="mb-0 fw-bold">Device Sync Status</h6>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    className="dropdown-toggle-nocaret options"
                  >
                    <span className="material-icons-outlined fs-5">
                      more_vert
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Action</Dropdown.Item>
                    <Dropdown.Item>Another action</Dropdown.Item>
                    <Dropdown.Item>Something else here</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <ul className="list-group list-group-flush">
                {syncStatusData.map((status, index) => (
                  <li key={index} className="list-group-item px-0 bg-transparent">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`wh-42 d-flex align-items-center justify-content-center rounded-3 bg-${status.color}`}>
                        <span className="material-icons-outlined text-white">
                          {status.icon}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{status.name}</h6>
                        <p className="mb-0 font-12">{status.description}</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <p className="mb-0">{status.count}</p>
                        <p className={`mb-0 fw-bold text-${status.color}`}>
                          {status.percentage}%
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Network Activity Live */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="chart-container">
                <SafeApexChart
                  options={networkActivityChart}
                  series={networkActivityChart.series}
                  type="line"
                  height={180}
                />
              </div>
              <div className="d-flex align-items-center gap-3 mt-4">
                <div>
                  <h1 className="mb-0">42.3%</h1>
                </div>
                <div className="d-flex align-items-center align-self-end gap-2">
                  <span className="material-icons-outlined text-success">
                    trending_up
                  </span>
                  <p className="mb-0 text-success">15.2%</p>
                </div>
              </div>
              <p className="mb-4">Network Activity Live</p>
              <div className="d-flex flex-column gap-3">
                <div>
                  <p className="mb-1">
                    Upload <span className="float-end">2589 MB</span>
                  </p>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-grd-primary"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="mb-1">
                    Download <span className="float-end">6748 MB</span>
                  </p>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-grd-warning"
                      style={{ width: "55%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="mb-1">
                    Total Usage <span className="float-end">9337 MB</span>
                  </p>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-grd-info"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

undefined
    </MainLayout>
  );
};

export default Overview;
