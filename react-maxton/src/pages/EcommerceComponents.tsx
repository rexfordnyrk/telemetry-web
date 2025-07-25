import React from "react";
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
