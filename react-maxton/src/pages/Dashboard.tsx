import React from "react";
import { Card, Row, Col, Button, Dropdown, Table } from "react-bootstrap";
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
      product: "Golden Watch",
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
  ];

  return (
    <MainLayout title="Dashboard">
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
