import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";

// Import eCommerce components
import {
  CongratulationsCard,
  EcommerceStatCard,
  OrderStatusWidget,
  SalesViewsWidget,
  SocialRevenueWidget,
  PopularProductsWidget,
  TopVendorsWidget,
  TransactionsWidget,
  MessagesProgressCard,
  TotalProfitWidget,
  MonthlyBudgetWidget,
} from "../components/ecommerce";

const EcommerceComponents: React.FC = () => {
  useEffect(() => {
    const initCharts = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          // Chart 1 - Total Orders
          const chart1Options = {
            series: [
              {
                name: "Total Orders",
                data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
              },
            ],
            chart: {
              height: 60,
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
              width: 1.5,
              curve: "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#0d6efd"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.7,
                opacityTo: 0.0,
              },
            },
            colors: ["#0d6efd"],
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
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            },
          };

          const chart1Element = document.querySelector("#ecommerce-stat-1");
          if (chart1Element) {
            new (window as any).ApexCharts(chart1Element, chart1Options).render();
          }

          // Chart 2 - Total Sales
          const chart2Options = {
            series: [
              {
                name: "Total Sales",
                data: [12, 14, 7, 47, 32, 44, 14, 55, 41, 69],
              },
            ],
            chart: {
              height: 60,
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
              width: 1.5,
              curve: "smooth",
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
            xaxis: {
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            },
          };

          const chart2Element = document.querySelector("#ecommerce-stat-2");
          if (chart2Element) {
            new (window as any).ApexCharts(chart2Element, chart2Options).render();
          }

          // Chart 3 - Total Visits
          const chart3Options = {
            series: [
              {
                name: "Total Visits",
                data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19],
              },
            ],
            chart: {
              height: 60,
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
              width: 1.5,
              curve: "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#2af598"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 100, 100, 100],
              },
            },
            colors: ["#009efd"],
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
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            },
          };

          const chart3Element = document.querySelector("#ecommerce-stat-3");
          if (chart3Element) {
            new (window as any).ApexCharts(chart3Element, chart3Options).render();
          }

          // Chart 4 - Bounce Rate
          const chart4Options = {
            series: [
              {
                name: "Bounce Rate",
                data: [35, 65, 47, 35, 44, 32, 27, 54, 44, 61],
              },
            ],
            chart: {
              height: 60,
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
              width: 1.5,
              curve: "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: ["#fe6225"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
              },
            },
            colors: ["#ffc107"],
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 3,
                columnWidth: "48%",
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
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            },
          };

          const chart4Element = document.querySelector("#ecommerce-stat-4");
          if (chart4Element) {
            new (window as any).ApexCharts(chart4Element, chart4Options).render();
          }
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
                  eCommerce Components
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

        <div className="row">
          {/* Row 1: Congratulations Card + Stat Cards */}
          <div className="col-12 col-lg-4 col-xxl-4 d-flex">
            <CongratulationsCard />
          </div>
          <div className="col-12 col-lg-4 col-xxl-2 d-flex">
            <EcommerceStatCard
              data={{
                title: "Total Orders",
                value: "248k",
                changePercentage: "+24%",
                changeDirection: "up",
                icon: "shopping_cart",
                iconBgClass: "bg-primary bg-opacity-10 text-primary",
                chartId: "ecommerce-stat-1",
                chartType: "area",
                chartData: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
                colors: ["#0d6efd"],
                gradientColors: ["#0d6efd"],
              }}
            />
          </div>
          <div className="col-12 col-lg-4 col-xxl-2 d-flex">
            <EcommerceStatCard
              data={{
                title: "Total Sales",
                value: "$47.6k",
                changePercentage: "+14%",
                changeDirection: "up",
                icon: "attach_money",
                iconBgClass: "bg-success bg-opacity-10 text-success",
                chartId: "ecommerce-stat-2",
                chartType: "area",
                chartData: [12, 14, 7, 47, 32, 44, 14, 55, 41, 69],
                colors: ["#98ec2d"],
                gradientColors: ["#17ad37"],
              }}
            />
          </div>
          <div className="col-12 col-lg-6 col-xxl-2 d-flex">
            <EcommerceStatCard
              data={{
                title: "Total Visits",
                value: "189K",
                changePercentage: "-35%",
                changeDirection: "down",
                icon: "visibility",
                iconBgClass: "bg-info bg-opacity-10 text-info",
                chartId: "ecommerce-stat-3",
                chartType: "area",
                chartData: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19],
                colors: ["#009efd"],
                gradientColors: ["#2af598"],
              }}
            />
          </div>
          <div className="col-12 col-lg-6 col-xxl-2 d-flex">
            <EcommerceStatCard
              data={{
                title: "Bounce Rate",
                value: "24.6%",
                changePercentage: "+18%",
                changeDirection: "up",
                icon: "leaderboard",
                iconBgClass: "bg-warning bg-opacity-10 text-warning",
                chartId: "ecommerce-stat-4",
                chartType: "bar",
                chartData: [35, 65, 47, 35, 44, 32, 27, 54, 44, 61],
                colors: ["#ffc107"],
                gradientColors: ["#fe6225"],
              }}
            />
          </div>
        </div>

        <div className="row">
          {/* Row 2: Order Status + Sales & Views */}
          <div className="col-12 col-xl-4">
            <OrderStatusWidget />
          </div>
          <div className="col-12 col-xl-8">
            <SalesViewsWidget />
          </div>
        </div>

        <div className="row">
          {/* Row 3: Social Revenue + Popular Products + Top Vendors */}
          <div className="col-12 col-lg-6 col-xxl-4 d-flex">
            <SocialRevenueWidget />
          </div>
          <div className="col-12 col-lg-6 col-xxl-4 d-flex">
            <PopularProductsWidget />
          </div>
          <div className="col-12 col-lg-12 col-xxl-4 d-flex">
            <TopVendorsWidget />
          </div>
        </div>

        <div className="row">
          {/* Row 4: Transactions + Messages + Total Profit + Monthly Budget */}
          <div className="col-12 col-xxl-6 d-flex">
            <TransactionsWidget />
          </div>
          <div className="col-12 col-lg-6 col-xxl-3 d-flex flex-column">
            <MessagesProgressCard />
            <TotalProfitWidget />
          </div>
          <div className="col-12 col-lg-6 col-xxl-3 d-flex">
            <MonthlyBudgetWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EcommerceComponents;
