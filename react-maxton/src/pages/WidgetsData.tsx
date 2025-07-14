import React, { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

declare const $: any;

const WidgetsData: React.FC = () => {
  useEffect(() => {
    // Initialize charts after component mounts using exact data-widgets.js configurations
    const initCharts = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          // Chart 1 - Total Sales
          const chart1Options = {
            series: [
              {
                name: "Total Sales",
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
                  formatter: function (e: any) {
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

          const chart1Element = document.querySelector("#chart1");
          if (chart1Element) {
            new (window as any).ApexCharts(
              chart1Element,
              chart1Options,
            ).render();
          }

          // Chart 2 - Total Accounts
          const chart2Options = {
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
                opacityFrom: 0.5,
                opacityTo: 0.0,
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
                  formatter: function (e: any) {
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

          const chart2Element = document.querySelector("#chart2");
          if (chart2Element) {
            new (window as any).ApexCharts(
              chart2Element,
              chart2Options,
            ).render();
          }

          // Chart 3 - Average Weekly Sales
          const chart3Options = {
            series: [
              {
                name: "Net Sales",
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
                gradientToColors: ["#0dcaf0"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.5,
                opacityTo: 0.0,
              },
            },
            colors: ["#0dcaf0"],
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
                  formatter: function (e: any) {
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

          const chart3Element = document.querySelector("#chart3");
          if (chart3Element) {
            new (window as any).ApexCharts(
              chart3Element,
              chart3Options,
            ).render();
          }

          // Chart 4 - Total Users
          const chart4Options = {
            series: [
              {
                name: "Weekly Sales",
                data: [8, 10, 25, 18, 38, 24, 20, 16, 7],
              },
            ],
            chart: {
              height: 120,
              type: "bar",
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
              curve: "smooth",
              color: ["transparent"],
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#17ad37"],
                shadeIntensity: 1,
                type: "vertical",
              },
            },
            colors: ["#98ec2d"],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "45%",
              },
            },
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
                  formatter: function (e: any) {
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

          const chart4Element = document.querySelector("#chart4");
          if (chart4Element) {
            new (window as any).ApexCharts(
              chart4Element,
              chart4Options,
            ).render();
          }

          // Chart 5 - Active Users
          const chart5Options = {
            series: [78],
            chart: {
              height: 180,
              type: "radialBar",
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
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: "front",
                  dropShadow: {
                    enabled: false,
                    top: 3,
                    left: 0,
                    blur: 4,
                    opacity: 0.24,
                  },
                },
                track: {
                  background: "rgba(0, 0, 0, 0.1)",
                  strokeWidth: "67%",
                  margin: 0,
                  dropShadow: {
                    enabled: false,
                    top: -3,
                    left: 0,
                    blur: 4,
                    opacity: 0.35,
                  },
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
                gradientToColors: ["#ffd200"],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
              },
            },
            colors: ["#ee0979"],
            stroke: {
              lineCap: "round",
            },
            labels: ["Total Orders"],
          };

          const chart5Element = document.querySelector("#chart5");
          if (chart5Element) {
            new (window as any).ApexCharts(
              chart5Element,
              chart5Options,
            ).render();
          }

          // Charts 6-9 (similar patterns to 1-3 with different data/colors)
          const chart6Options = { ...chart1Options };
          const chart6Element = document.querySelector("#chart6");
          if (chart6Element) {
            new (window as any).ApexCharts(
              chart6Element,
              chart6Options,
            ).render();
          }

          const chart7Options = {
            series: [
              {
                name: "Net Sales",
                data: [4, 10, 12, 17, 25, 30, 40, 55, 68],
              },
            ],
            chart: {
              height: 120,
              type: "bar",
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
              curve: "smooth",
              color: ["transparent"],
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#7928ca"],
                shadeIntensity: 1,
                type: "vertical",
              },
            },
            colors: ["#ff0080"],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "45%",
              },
            },
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
                  formatter: function (e: any) {
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

          const chart7Element = document.querySelector("#chart7");
          if (chart7Element) {
            new (window as any).ApexCharts(
              chart7Element,
              chart7Options,
            ).render();
          }

          const chart8Options = {
            series: [78],
            chart: {
              height: 165,
              type: "radialBar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  margin: 0,
                  size: "80%",
                  background: "transparent",
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: "front",
                  dropShadow: {
                    enabled: false,
                    top: 3,
                    left: 0,
                    blur: 4,
                    opacity: 0.24,
                  },
                },
                track: {
                  background: "rgba(0, 0, 0, 0.12)",
                  strokeWidth: "67%",
                  margin: 0,
                  dropShadow: {
                    enabled: false,
                    top: -3,
                    left: 0,
                    blur: 4,
                    opacity: 0.35,
                  },
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
                gradientToColors: ["#005bea"],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
              },
            },
            colors: ["#98ec2d"],
            stroke: {
              lineCap: "round",
            },
            labels: ["Total Orders"],
          };

          const chart8Element = document.querySelector("#chart8");
          if (chart8Element) {
            new (window as any).ApexCharts(
              chart8Element,
              chart8Options,
            ).render();
          }

          const chart9Options = {
            series: [
              {
                name: "Net Sales",
                data: [4, 25, 14, 34, 10, 39],
              },
            ],
            chart: {
              height: 105,
              type: "line",
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
              curve: "straight",
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
                  formatter: function (e: any) {
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

          const chart9Element = document.querySelector("#chart9");
          if (chart9Element) {
            new (window as any).ApexCharts(
              chart9Element,
              chart9Options,
            ).render();
          }

          // Chart 10 - Sales & Views
          const chart10Options = {
            series: [
              {
                name: "Sales",
                data: [20, 5, 60, 10, 30, 20, 25, 15, 31],
              },
              {
                name: "Views",
                data: [17, 10, 45, 15, 25, 15, 40, 10, 24],
              },
            ],
            chart: {
              foreColor: "#9ba7b2",
              height: 235,
              type: "bar",
              toolbar: {
                show: false,
              },
              sparkline: {
                enabled: false,
              },
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: 4,
              curve: "smooth",
              colors: ["transparent"],
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#ffd200", "#00c6fb"],
                shadeIntensity: 1,
                type: "vertical",
                stops: [0, 100, 100, 100],
              },
            },
            colors: ["#ff6a00", "#005bea"],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "55%",
              },
            },
            grid: {
              show: false,
              borderColor: "rgba(0, 0, 0, 0.15)",
              strokeDashArray: 4,
            },
            tooltip: {
              theme: "dark",
              fixed: {
                enabled: true,
              },
              x: {
                show: true,
              },
              y: {
                title: {
                  formatter: function (e: any) {
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

          const chart10Element = document.querySelector("#chart10");
          if (chart10Element) {
            new (window as any).ApexCharts(
              chart10Element,
              chart10Options,
            ).render();
          }

          // Chart 11 - Order Status Donut
          const chart11Options = {
            series: [58, 25, 25],
            chart: {
              height: 290,
              type: "donut",
            },
            legend: {
              position: "bottom",
              show: false,
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#ee0979", "#17ad37", "#ec6ead"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
              },
            },
            colors: ["#ff6a00", "#98ec2d", "#3494e6"],
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "85%",
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
                    position: "bottom",
                    show: false,
                  },
                },
              },
            ],
          };

          const chart11Element = document.querySelector("#chart11");
          if (chart11Element) {
            new (window as any).ApexCharts(
              chart11Element,
              chart11Options,
            ).render();
          }

          // Chart 12 - Monthly Revenue
          const chart12Options = {
            series: [
              {
                name: "Desktops",
                data: [14, 41, 35, 51, 25, 18, 21, 35, 15],
              },
            ],
            chart: {
              foreColor: "#9ba7b2",
              height: 240,
              type: "bar",
              toolbar: {
                show: false,
              },
              sparkline: {
                enabled: false,
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
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "45%",
              },
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#009efd"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
              },
            },
            colors: ["#2af598"],
            grid: {
              show: true,
              borderColor: "rgba(255, 255, 255, 0.1)",
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
            tooltip: {
              theme: "dark",
              marker: {
                show: false,
              },
            },
          };

          const chart12Element = document.querySelector("#chart12");
          if (chart12Element) {
            new (window as any).ApexCharts(
              chart12Element,
              chart12Options,
            ).render();
          }

          // Chart 13 - Trending Products
          const chart13Options = {
            series: [44, 55, 41],
            chart: {
              height: 237,
              type: "donut",
            },
            legend: {
              position: "bottom",
              show: false,
            },
            colors: ["#ee0979", "#005bea", "#02c27a"],
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "80%",
                },
              },
            },
            tooltip: {
              theme: "dark",
              marker: {
                show: false,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    height: 200,
                  },
                  legend: {
                    position: "bottom",
                    show: true,
                  },
                },
              },
            ],
          };

          const chart13Element = document.querySelector("#chart13");
          if (chart13Element) {
            new (window as any).ApexCharts(
              chart13Element,
              chart13Options,
            ).render();
          }

          // Chart 14 - Yearly Income
          const chart14Options = {
            series: [
              {
                name: "Desktops",
                data: [100, 65, 34, 51, 25, 40, 21, 35, 15],
              },
            ],
            chart: {
              foreColor: "#9ba7b2",
              height: 250,
              type: "area",
              toolbar: {
                show: false,
              },
              sparkline: {
                enabled: false,
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
              curve: "straight",
            },
            plotOptions: {
              bar: {
                columnWidth: "45%",
                endingShape: "rounded",
              },
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#17ad37"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.8,
                opacityTo: 0.1,
                stops: [0, 100, 100, 100],
              },
            },
            colors: ["#98ec2d"],
            grid: {
              show: true,
              borderColor: "rgba(255, 255, 255, 0.15)",
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
            markers: {
              show: false,
              size: 5,
            },
            tooltip: {
              theme: "dark",
            },
          };

          const chart14Element = document.querySelector("#chart14");
          if (chart14Element) {
            new (window as any).ApexCharts(
              chart14Element,
              chart14Options,
            ).render();
          }
        }

        // Initialize Peity charts if available
        if (typeof $ !== "undefined" && $.fn.peity) {
          $("[data-peity]").peity("donut");
        }
      } catch (error) {
        console.warn("Chart initialization error:", error);
      }
    };

    const timer = setTimeout(initCharts, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Widgets</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="javascript:;">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Data Widgets
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <div className="btn-group">
              <button type="button" className="btn btn-primary">
                Settings
              </button>
              <button
                type="button"
                className="btn btn-primary split-bg-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <div className="dropdown-menu dropdown-menu-right dropdown-menu-lg-end">
                <a className="dropdown-item" href="javascript:;">
                  Action
                </a>
                <a className="dropdown-item" href="javascript:;">
                  Another action
                </a>
                <a className="dropdown-item" href="javascript:;">
                  Something else here
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="javascript:;">
                  Separated link
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-xl-3">
          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h3 className="mb-0">$9,568</h3>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_downward
                      </span>
                      8.6%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Total Sales</p>
                <div id="chart1"></div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h3 className="mb-0">85,247</h3>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_downward
                      </span>
                      23.7%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Total Accounts</p>
                <div id="chart2"></div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h3 className="mb-0">$69,452</h3>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_downward
                      </span>
                      8.6%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Average Weekly Sales</p>
                <div id="chart3"></div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h2 className="mb-0">$65,129</h2>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_upward
                      </span>
                      24.7%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Sale This Year</p>
                <div className="mt-4">
                  <p className="mb-2 d-flex align-items-center justify-content-between">
                    285 left to Goal<span className="">68%</span>
                  </p>
                  <div className="progress w-100" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-grd-purple"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h2 className="mb-0">$88,367</h2>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_upward
                      </span>
                      18.6%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Sale This Month</p>
                <div className="mt-4">
                  <p className="mb-2 d-flex align-items-center justify-content-between">
                    285 left to Goal<span className="">78%</span>
                  </p>
                  <div className="progress w-100" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-grd-danger"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="">
                    <h2 className="mb-0">$55,674</h2>
                  </div>
                  <div className="">
                    <p className="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                      <span className="material-icons-outlined fs-6">
                        arrow_upward
                      </span>
                      42.6%
                    </p>
                  </div>
                </div>
                <p className="mb-0">Sale This Week</p>
                <div className="mt-4">
                  <p className="mb-2 d-flex align-items-center justify-content-between">
                    285 left to Goal<span className="">88%</span>
                  </p>
                  <div className="progress w-100" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-grd-success"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-xl-6">
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0">97.4K</h5>
                    <p className="mb-0">Total Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart4"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">
                    <span className="text-success me-1">12.5%</span> from last
                    month
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-1">
                  <div className="">
                    <h5 className="mb-0">42.5K</h5>
                    <p className="mb-0">Active Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart5"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">24K users increased from last month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0">97.4K</h5>
                    <p className="mb-0">Total Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart6"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">
                    <span className="text-success me-1">12.5%</span> from last
                    month
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-1">
                  <div className="">
                    <h5 className="mb-0">42.5K</h5>
                    <p className="mb-0">Active Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart7"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">24K users increased from last month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0">97.4K</h5>
                    <p className="mb-0">Total Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart8"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">
                    <span className="text-success me-1">12.5%</span> from last
                    month
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col d-flex">
            <div className="card rounded-4 w-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-1">
                  <div className="">
                    <h5 className="mb-0">42.5K</h5>
                    <p className="mb-0">Active Users</p>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="chart-container2">
                  <div id="chart9"></div>
                </div>
                <div className="text-center">
                  <p className="mb-0">24K users increased from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-xl-4">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="">
                      <h5 className="mb-0">Order Status</h5>
                    </div>
                    <div className="dropdown">
                      <a
                        href="javascript:;"
                        className="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <span className="material-icons-outlined fs-5">
                          more_vert
                        </span>
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Another action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="javascript:;">
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="position-relative">
                    <div className="piechart-legend">
                      <h2 className="mb-1">68%</h2>
                      <h6 className="mb-0">Total Sales</h6>
                    </div>
                    <div id="chart11"></div>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 d-flex align-items-center gap-2 w-25">
                        <span className="material-icons-outlined fs-6 text-primary">
                          fiber_manual_record
                        </span>
                        Sales
                      </p>
                      <div className="">
                        <p className="mb-0">68%</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 d-flex align-items-center gap-2 w-25">
                        <span className="material-icons-outlined fs-6 text-danger">
                          fiber_manual_record
                        </span>
                        Product
                      </p>
                      <div className="">
                        <p className="mb-0">25%</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0 d-flex align-items-center gap-2 w-25">
                        <span className="material-icons-outlined fs-6 text-success">
                          fiber_manual_record
                        </span>
                        Income
                      </p>
                      <div className="">
                        <p className="mb-0">14%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-8">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="">
                    <h5 className="mb-0">Sales & Views</h5>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:;"
                      className="dropdown-toggle-nocaret options dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <span className="material-icons-outlined fs-5">
                        more_vert
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Another action
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="javascript:;">
                          Something else here
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="chart10"></div>
                <div className="d-flex flex-column flex-lg-row align-items-start justify-content-around border p-3 rounded-4 mt-3 gap-3">
                  <div className="d-flex align-items-center gap-4">
                    <div className="">
                      <p className="mb-0 data-attributes">
                        <span data-peity='{ "fill": ["#98ec2d", "rgb(0 0 0 / 12%)"], "innerRadius": 32, "radius": 40 }'>
                          5/7
                        </span>
                      </p>
                    </div>
                    <div className="">
                      <p className="mb-1 fs-6 fw-bold">Monthly</p>
                      <h2 className="mb-0">65,127</h2>
                      <p className="mb-0">
                        <span className="text-success me-2 fw-medium">
                          16.5%
                        </span>
                        <span>55.21 USD</span>
                      </p>
                    </div>
                  </div>
                  <div className="vr"></div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="">
                      <p className="mb-0 data-attributes">
                        <span data-peity='{ "fill": ["#ff6a00", "rgb(0 0 0 / 12%)"], "innerRadius": 32, "radius": 40 }'>
                          5/7
                        </span>
                      </p>
                    </div>
                    <div className="">
                      <p className="mb-1 fs-6 fw-bold">Yearly</p>
                      <h2 className="mb-0">984,246</h2>
                      <p className="mb-0">
                        <span className="text-success me-2 fw-medium">
                          24.9%
                        </span>
                        <span>267.35 USD</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-xl-4 d-flex">
            <div className="card overflow-hidden w-100 rounded-4">
              <div className="card-body">
                <div className="text-center">
                  <h6 className="mb-0">Monthly Revenue</h6>
                </div>
                <div className="mt-4" id="chart12"></div>
                <p>Avrage monthly sale for every author</p>
                <div className="d-flex align-items-center gap-3 mt-4">
                  <div className="">
                    <h1 className="mb-0 text-primary">68.9%</h1>
                  </div>
                  <div className="d-flex align-items-center align-self-end">
                    <p className="mb-0 text-success">34.5%</p>
                    <span className="material-icons-outlined text-success">
                      expand_less
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-3 d-flex">
            <div className="card overflow-hidden w-100 rounded-4">
              <div className="p-3 bg-grd-purple">
                <div className="text-center">
                  <h6 className="mb-0 text-white">Trending Products</h6>
                </div>
                <div className="mt-4" id="chart13"></div>
              </div>
              <div className="p-4">
                <p>Avrage monthly sale for every author</p>
                <div className="d-flex align-items-center gap-3 mt-4">
                  <div className="">
                    <h1 className="mb-0 text-danger">48.2%</h1>
                  </div>
                  <div className="d-flex align-items-center align-self-end">
                    <p className="mb-0 text-success">34.5%</p>
                    <span className="material-icons-outlined text-success">
                      expand_less
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-5 d-flex">
            <div className="card overflow-hidden w-100 rounded-4">
              <div className="card-body">
                <div className="text-center">
                  <h6 className="mb-0">Yearly Income</h6>
                </div>
                <div className="mt-4" id="chart14"></div>
                <p>Avrage monthly sale for every author</p>
                <div className="d-flex align-items-center gap-3 mt-4">
                  <div className="">
                    <h1 className="mb-0 text-success">68.9%</h1>
                  </div>
                  <div className="d-flex align-items-center align-self-end">
                    <p className="mb-0 text-success">34.5%</p>
                    <span className="material-icons-outlined text-success">
                      expand_less
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WidgetsData;
