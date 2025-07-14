import React from "react";
import { Card, Row, Col, Dropdown, Table } from "react-bootstrap";
import Chart from "react-apexcharts";
import MainLayout from "../layouts/MainLayout";

const Dashboard: React.FC = () => {
  // Chart 1 - Area Chart
  const areaChartOptions = {
    series: [
      {
        name: "Net Sales",
        data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
      },
    ],
    chart: {
      height: 105,
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
      width: 1.7,
      curve: "smooth" as const,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#02c27a"],
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
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  };

  // Chart 2 - Radial Chart
  const radialChartOptions = {
    series: [78],
    chart: {
      height: 180,
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
        gradientToColors: ["#0866ff"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ["#fc185a"],
    stroke: {
      lineCap: "round" as const,
    },
    labels: ["Total Orders"],
  };

  // Chart 3 - Pie Chart
  const pieChartOptions = {
    series: [35, 48, 27],
    chart: {
      height: 200,
      type: "donut" as const,
    },
    labels: ["Desktop", "Tablet", "Mobile"],
    colors: ["#0d6efd", "#fc185a", "#02c27a"],
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  // Chart 4 - Total Clicks
  const totalClicksChartOptions = {
    series: [
      {
        name: "Clicks",
        data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
      },
    ],
    chart: {
      height: 105,
      type: "area" as const,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#fc185a"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#fc185a"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.5,
        opacityTo: 0.0,
      },
    },
    stroke: {
      width: 1.7,
      curve: "smooth" as const,
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Chart 5 - Total Views
  const totalViewsChartOptions = {
    series: [
      {
        name: "Views",
        data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
      },
    ],
    chart: {
      height: 105,
      type: "area" as const,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#0dcaf0"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#0dcaf0"],
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.5,
        opacityTo: 0.0,
      },
    },
    stroke: {
      width: 1.7,
      curve: "smooth" as const,
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Chart 6 - Monthly Revenue
  const monthlyRevenueChartOptions = {
    series: [
      {
        name: "Revenue",
        data: [450, 650, 410, 560, 750, 650, 850, 560, 750, 650, 850, 560],
      },
    ],
    chart: {
      height: 160,
      type: "line" as const,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#0d6efd"],
    stroke: {
      width: 3,
      curve: "smooth" as const,
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Chart 7 - Total Accounts
  const totalAccountsChartOptions = {
    series: [
      {
        name: "Accounts",
        data: [24, 35, 25, 45, 35, 55, 45, 65, 55, 75, 65, 85],
      },
    ],
    chart: {
      height: 60,
      type: "line" as const,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#02c27a"],
    stroke: {
      width: 2,
      curve: "smooth" as const,
    },
    dataLabels: {
      enabled: false,
    },
  };

  // Chart 8 - Visitors Growth
  const visitorsGrowthChartOptions = {
    series: [
      {
        name: "Visitors",
        data: [24, 35, 25, 45, 35, 55, 45, 65, 55, 75, 65, 85],
      },
    ],
    chart: {
      height: 120,
      type: "line" as const,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#0d6efd"],
    stroke: {
      width: 3,
      curve: "smooth" as const,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const recentOrders = [
    {
      id: 1,
      product: "Sports Shoes",
      image: "/assets/images/top-products/01.png",
      amount: "$149",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 5.0,
    },
    {
      id: 2,
      product: "Goldan Watch",
      image: "/assets/images/top-products/02.png",
      amount: "$168",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 5.0,
    },
    {
      id: 3,
      product: "Men Polo Tshirt",
      image: "/assets/images/top-products/03.png",
      amount: "$124",
      vendor: "Julia Sunota",
      status: "Pending",
      statusClass: "bg-warning",
      rating: 4.0,
    },
    {
      id: 4,
      product: "Blue Jeans Casual",
      image: "/assets/images/top-products/04.png",
      amount: "$289",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 3.0,
    },
    {
      id: 5,
      product: "Fancy Shirts",
      image: "/assets/images/top-products/06.png",
      amount: "$389",
      vendor: "Julia Sunota",
      status: "Canceled",
      statusClass: "bg-danger",
      rating: 2.0,
    },
  ];

  const socialLeads = [
    {
      name: "Facebook",
      icon: "/assets/images/apps/17.png",
      percentage: "55%",
      data: "5/7",
      color: "#0d6efd",
    },
    {
      name: "LinkedIn",
      icon: "/assets/images/apps/18.png",
      percentage: "67%",
      data: "5/7",
      color: "#fc185a",
    },
    {
      name: "Instagram",
      icon: "/assets/images/apps/19.png",
      percentage: "78%",
      data: "5/7",
      color: "#02c27a",
    },
    {
      name: "Snapchat",
      icon: "/assets/images/apps/20.png",
      percentage: "46%",
      data: "5/7",
      color: "#fd7e14",
    },
    {
      name: "Google",
      icon: "/assets/images/apps/05.png",
      percentage: "38%",
      data: "5/7",
      color: "#0dcaf0",
    },
    {
      name: "Altaba",
      icon: "/assets/images/apps/08.png",
      percentage: "15%",
      data: "5/7",
      color: "#6f42c1",
    },
    {
      name: "Spotify",
      icon: "/assets/images/apps/07.png",
      percentage: "12%",
      data: "5/7",
      color: "#ff00b3",
    },
  ];

  const newUsers = [
    {
      name: "Elon Jonado",
      username: "elon_deo",
      avatar: "/assets/images/avatars/01.png",
    },
    {
      name: "Alexzender Clito",
      username: "zli_alexzender",
      avatar: "/assets/images/avatars/02.png",
    },
    {
      name: "Michle Tinko",
      username: "tinko_michle",
      avatar: "/assets/images/avatars/03.png",
    },
    {
      name: "KailWemba",
      username: "wemba_kl",
      avatar: "/assets/images/avatars/04.png",
    },
    {
      name: "Henhco Tino",
      username: "Henhco_tino",
      avatar: "/assets/images/avatars/05.png",
    },
    {
      name: "Gonjiko Fernando",
      username: "gonjiko_fernando",
      avatar: "/assets/images/avatars/06.png",
    },
    {
      name: "Specer Kilo",
      username: "specer_kilo",
      avatar: "/assets/images/avatars/08.png",
    },
  ];

  const campaignStats = [
    {
      title: "Campaigns",
      value: "54",
      percentage: "28%",
      icon: "calendar_today",
      bgClass: "bg-grd-primary",
      textClass: "text-success",
    },
    {
      title: "Emailed",
      value: "245",
      percentage: "15%",
      icon: "email",
      bgClass: "bg-grd-success",
      textClass: "text-danger",
    },
    {
      title: "Opened",
      value: "54",
      percentage: "30.5%",
      icon: "open_in_new",
      bgClass: "bg-grd-branding",
      textClass: "text-success",
    },
    {
      title: "Clicked",
      value: "859",
      percentage: "34.6%",
      icon: "ads_click",
      bgClass: "bg-grd-warning",
      textClass: "text-danger",
    },
    {
      title: "Subscribed",
      value: "24,758",
      percentage: "53%",
      icon: "subscriptions",
      bgClass: "bg-grd-info",
      textClass: "text-success",
    },
    {
      title: "Spam Message",
      value: "548",
      percentage: "47%",
      icon: "inbox",
      bgClass: "bg-grd-danger",
      textClass: "text-danger",
    },
    {
      title: "Views Mails",
      value: "9845",
      percentage: "68%",
      icon: "visibility",
      bgClass: "bg-grd-deep-blue",
      textClass: "text-success",
    },
  ];

  return (
    <MainLayout>
      {/* Custom Breadcrumb with Actions */}
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
                Analysis
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
        {/* Welcome Card */}
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
                      <p className="mb-0 fw-semibold">Welcome back</p>
                      <h4 className="fw-semibold mb-0 fs-4">Jhon Anderson!</h4>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-5">
                    <div>
                      <h4 className="mb-1 fw-semibold d-flex align-content-center">
                        $65.4K
                        <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                      </h4>
                      <p className="mb-3">Today's Sales</p>
                      <div className="progress mb-0" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-grd-success"
                          role="progressbar"
                          style={{ width: "60%" }}
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                    <div className="vr"></div>
                    <div>
                      <h4 className="mb-1 fw-semibold d-flex align-content-center">
                        78.4%
                        <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                      </h4>
                      <p className="mb-3">Growth Rate</p>
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

        {/* Active Users Card */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div>
                  <h5 className="mb-0">42.5K</h5>
                  <p className="mb-0">Active Users</p>
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
                <Chart
                  options={areaChartOptions}
                  series={areaChartOptions.series}
                  type="area"
                  height={105}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  24K users increased from last month
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Users Card */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-0">97.4K</h5>
                  <p className="mb-0">Total Users</p>
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
                <Chart
                  options={radialChartOptions}
                  series={radialChartOptions.series}
                  type="radialBar"
                  height={180}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  <span className="text-success me-1">12.5%</span> from last
                  month
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Clicks Card */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div>
                  <h5 className="mb-0">82.7K</h5>
                  <p className="mb-0">Total Clicks</p>
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
                <Chart
                  options={totalClicksChartOptions}
                  series={totalClicksChartOptions.series}
                  type="area"
                  height={105}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  <span className="text-success me-1">12.5%</span> from last
                  month
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Views Card */}
        <Col xl={6} xxl={2} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div>
                  <h5 className="mb-0">68.4K</h5>
                  <p className="mb-0">Total Views</p>
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
                <Chart
                  options={totalViewsChartOptions}
                  series={totalViewsChartOptions.series}
                  type="area"
                  height={105}
                />
              </div>
              <div className="text-center">
                <p className="mb-0 font-12">
                  35K users increased from last month
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Revenue Card */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="text-center">
                <h6 className="mb-0">Monthly Revenue</h6>
              </div>
              <div className="mt-4">
                <Chart
                  options={monthlyRevenueChartOptions}
                  series={monthlyRevenueChartOptions.series}
                  type="line"
                  height={160}
                />
              </div>
              <p>Avrage monthly sale for every author</p>
              <div className="d-flex align-items-center gap-3 mt-4">
                <div>
                  <h1 className="mb-0 text-primary">68.9%</h1>
                </div>
                <div className="d-flex align-items-center align-self-end">
                  <p className="mb-0 text-success">34.5%</p>
                  <span className="material-icons-outlined text-success">
                    expand_less
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Device Type Card */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h5 className="mb-0">Device Type</h5>
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
                    <h2 className="mb-1">68%</h2>
                    <h6 className="mb-0">Total Views</h6>
                  </div>
                  <Chart
                    options={pieChartOptions}
                    series={pieChartOptions.series}
                    type="donut"
                    height={200}
                  />
                </div>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 d-flex align-items-center gap-2 w-25">
                      <span className="material-icons-outlined fs-6 text-primary">
                        desktop_windows
                      </span>
                      Desktop
                    </p>
                    <div>
                      <p className="mb-0">35%</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 d-flex align-items-center gap-2 w-25">
                      <span className="material-icons-outlined fs-6 text-danger">
                        tablet_mac
                      </span>
                      Tablet
                    </p>
                    <div>
                      <p className="mb-0">48%</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 d-flex align-items-center gap-2 w-25">
                      <span className="material-icons-outlined fs-6 text-success">
                        phone_android
                      </span>
                      Mobile
                    </p>
                    <div>
                      <p className="mb-0">27%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Accounts and small cards */}
        <Col xxl={4}>
          <Row>
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="w-100 rounded-4">
                <Card.Body>
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <div>
                      <h5 className="mb-0">82.7K</h5>
                      <p className="mb-0">Total Clicks</p>
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
                    <Chart
                      options={totalClicksChartOptions}
                      series={totalClicksChartOptions.series}
                      type="area"
                      height={105}
                    />
                  </div>
                  <div className="text-center">
                    <p className="mb-0 font-12">
                      <span className="text-success me-1">12.5%</span> from last
                      month
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="w-100 rounded-4">
                <Card.Body>
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <div>
                      <h5 className="mb-0">68.4K</h5>
                      <p className="mb-0">Total Views</p>
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
                    <Chart
                      options={totalViewsChartOptions}
                      series={totalViewsChartOptions.series}
                      type="area"
                      height={105}
                    />
                  </div>
                  <div className="text-center">
                    <p className="mb-0 font-12">
                      35K users increased from last month
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div>
                  <h3 className="mb-0">85,247</h3>
                </div>
                <div className="flex-grow-0">
                  <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                    <span className="material-icons-outlined fs-6">
                      arrow_downward
                    </span>
                    23.7%
                  </p>
                </div>
              </div>
              <p className="mb-0">Total Accounts</p>
              <div>
                <Chart
                  options={totalAccountsChartOptions}
                  series={totalAccountsChartOptions.series}
                  type="line"
                  height={60}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Campaign Stats */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h6 className="mb-0 fw-bold">Campaign Stats</h6>
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
                {campaignStats.map((stat, index) => (
                  <li
                    key={index}
                    className="list-group-item px-0 bg-transparent"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`wh-42 d-flex align-items-center justify-content-center rounded-3 ${stat.bgClass}`}
                      >
                        <span className="material-icons-outlined text-white">
                          {stat.icon}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{stat.title}</h6>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <p className="mb-0">{stat.value}</p>
                        <p className={`mb-0 fw-bold ${stat.textClass}`}>
                          {stat.percentage}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Visitors Growth */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div>
                <Chart
                  options={visitorsGrowthChartOptions}
                  series={visitorsGrowthChartOptions.series}
                  type="line"
                  height={120}
                />
              </div>
              <div className="d-flex align-items-center gap-3 mt-4">
                <div>
                  <h1 className="mb-0">36.7%</h1>
                </div>
                <div className="d-flex align-items-center align-self-end gap-2">
                  <span className="material-icons-outlined text-success">
                    trending_up
                  </span>
                  <p className="mb-0 text-success">34.5%</p>
                </div>
              </div>
              <p className="mb-4">Visitors Growth</p>
              <div className="d-flex flex-column gap-3">
                <div>
                  <p className="mb-1">
                    Cliks <span className="float-end">2589</span>
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
                    Likes <span className="float-end">6748</span>
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
                    Upvotes <span className="float-end">9842</span>
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

        {/* Social Leads */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-0 fw-bold">Social Leads</h5>
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
              <div className="d-flex flex-column justify-content-between gap-4">
                {socialLeads.map((lead, index) => (
                  <div key={index} className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <img src={lead.icon} width="32" alt="" />
                      <p className="mb-0">{lead.name}</p>
                    </div>
                    <div>
                      <p className="mb-0 fs-6">{lead.percentage}</p>
                    </div>
                    <div>
                      <p className="mb-0 data-attributes">
                        <span
                          data-peity={`{ "fill": ["${lead.color}", "rgb(255 255 255 / 10%)"], "innerRadius": 14, "radius": 18 }`}
                        >
                          {lead.data}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* New Users */}
        <Col xl={6} xxl={4} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Header className="border-0 p-3 border-bottom">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h5 className="mb-0">New Users</h5>
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
            </Card.Header>
            <Card.Body className="p-0">
              <div className="user-list p-3">
                <div className="d-flex flex-column gap-3">
                  {newUsers.map((user, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3"
                    >
                      <img
                        src={user.avatar}
                        width="45"
                        height="45"
                        className="rounded-circle"
                        alt=""
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{user.name}</h6>
                        <p className="mb-0">{user.username}</p>
                      </div>
                      <div className="form-check form-check-inline me-0">
                        <input
                          className="form-check-input ms-0"
                          type="checkbox"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent p-3">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <a href="#" className="sharelink">
                  <i className="material-icons-outlined">share</i>
                </a>
                <a href="#" className="sharelink">
                  <i className="material-icons-outlined">textsms</i>
                </a>
                <a href="#" className="sharelink">
                  <i className="material-icons-outlined">email</i>
                </a>
                <a href="#" className="sharelink">
                  <i className="material-icons-outlined">attach_file</i>
                </a>
                <a href="#" className="sharelink">
                  <i className="material-icons-outlined">event</i>
                </a>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* Recent Orders Table */}
        <Col lg={12} xxl={8} className="d-flex align-items-stretch">
          <Card className="w-100 rounded-4">
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h5 className="mb-0">Recent Orders</h5>
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
              <div className="order-search position-relative my-3">
                <input
                  className="form-control rounded-5 px-5"
                  type="text"
                  placeholder="Search"
                />
                <span className="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">
                  search
                </span>
              </div>
              <div className="table-responsive">
                <Table className="align-middle">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Amount</th>
                      <th>Vendor</th>
                      <th>Status</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div>
                              <img
                                src={order.image}
                                className="rounded-circle"
                                width="50"
                                height="50"
                                alt=""
                              />
                            </div>
                            <p className="mb-0">{order.product}</p>
                          </div>
                        </td>
                        <td>{order.amount}</td>
                        <td>{order.vendor}</td>
                        <td>
                          <p
                            className={`dash-lable mb-0 ${order.statusClass} bg-opacity-10 text-${order.statusClass.replace("bg-", "")} rounded-2`}
                          >
                            {order.status}
                          </p>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <p className="mb-0">{order.rating}</p>
                            <i className="material-icons-outlined text-warning fs-6">
                              star
                            </i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;
