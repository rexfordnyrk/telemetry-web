import React from "react";
import MainLayout from "../layouts/MainLayout";
import {
  AreaChartWidget,
  BarChartWidget,
  RadialChartWidget,
  LineChartWidget,
  DonutChartWidget,
  MultiSeriesBarChart,
  ProgressWidget,
  StatCardWidget,
} from "../components/widgets";

const WidgetsDataComponents: React.FC = () => {
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
                  Data Components
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

        {/* First Row - Area Charts */}
        <div className="row row-cols-1 row-cols-xl-3">
          <AreaChartWidget
            title="Total Sales"
            value="$9,568"
            changePercentage="8.6%"
            changeDirection="down"
            chartId="chart1"
          />
          <AreaChartWidget
            title="Total Accounts"
            value="85,247"
            changePercentage="23.7%"
            changeDirection="up"
            chartId="chart2"
            colors={["#ffc107"]}
            gradientColors={["#fc185a"]}
          />
          <AreaChartWidget
            title="Average Weekly Sales"
            value="$69,452"
            changePercentage="8.6%"
            changeDirection="down"
            chartId="chart3"
            colors={["#0dcaf0"]}
            gradientColors={["#0dcaf0"]}
          />

          {/* Progress Widgets */}
          <ProgressWidget
            title="Sale This Year"
            value="$65,129"
            changePercentage="24.7%"
            changeDirection="up"
            progressLabel="left to Goal"
            progressPercentage={68}
            progressBarClass="bg-grd-purple"
          />
          <ProgressWidget
            title="Sale This Month"
            value="$88,367"
            changePercentage="18.6%"
            changeDirection="up"
            progressLabel="left to Goal"
            progressPercentage={78}
            progressBarClass="bg-grd-danger"
          />
          <ProgressWidget
            title="Sale This Week"
            value="$55,674"
            changePercentage="42.6%"
            changeDirection="up"
            progressLabel="left to Goal"
            progressPercentage={88}
            progressBarClass="bg-grd-success"
          />
        </div>

        {/* Second Row - Bar and Radial Charts */}
        <div className="row row-cols-1 row-cols-xl-6">
          <BarChartWidget
            title="Total Users"
            value="97.4K"
            subtitle="12.5% from last month"
            chartId="chart4"
          />
          <RadialChartWidget
            title="Active Users"
            value="42.5K"
            subtitle="24K users increased from last month"
            chartId="chart5"
          />
          <BarChartWidget
            title="Total Users"
            value="97.4K"
            subtitle="12.5% from last month"
            chartId="chart6"
            data={[4, 10, 25, 12, 25, 18, 40, 22, 7]}
            colors={["#02c27a"]}
            gradientColors={["#17ad37"]}
          />
          <BarChartWidget
            title="Active Users"
            value="42.5K"
            subtitle="24K users increased from last month"
            chartId="chart7"
            data={[4, 10, 12, 17, 25, 30, 40, 55, 68]}
            colors={["#ff0080"]}
            gradientColors={["#7928ca"]}
          />
          <RadialChartWidget
            title="Total Users"
            value="97.4K"
            subtitle="12.5% from last month"
            chartId="chart8"
            colors={["#98ec2d"]}
            gradientColors={["#005bea"]}
            height={165}
            startAngle={0}
            endAngle={360}
          />
          <LineChartWidget
            title="Active Users"
            value="42.5K"
            subtitle="24K users increased from last month"
            chartId="chart9"
          />
        </div>

        {/* Third Row - Donut Chart and Multi-Series Bar Chart */}
        <div className="row">
          <div className="col-12 col-xl-4">
            <DonutChartWidget
              title="Order Status"
              centerLabel="Total Sales"
              centerValue="68%"
              chartId="chart11"
            />
          </div>
          <div className="col-12 col-xl-8">
            <MultiSeriesBarChart
              title="Sales & Views"
              chartId="chart10"
            />
          </div>
        </div>

        {/* Fourth Row - Stat Cards */}
        <div className="row">
          <div className="col-12 col-xl-4 d-flex">
            <StatCardWidget
              title="Monthly Revenue"
              value="68.9%"
              subtitle="Avrage monthly sale for every author"
              chartId="chart12"
            />
          </div>
          <div className="col-12 col-xl-3 d-flex">
            <StatCardWidget
              title="Trending Products"
              value="48.2%"
              subtitle="Avrage monthly sale for every author"
              chartId="chart13"
              chartType="bar"
              data={[44, 55, 41]}
              backgroundColor="bg-grd-purple"
              textColor="text-white"
              colors={["#ee0979"]}
              gradientColors={["#005bea"]}
              height={237}
            />
          </div>
          <div className="col-12 col-xl-5 d-flex">
            <StatCardWidget
              title="Yearly Income"
              value="68.9%"
              subtitle="Avrage monthly sale for every author"
              chartId="chart14"
              chartType="area"
              data={[100, 65, 34, 51, 25, 40, 21, 35, 15]}
              colors={["#98ec2d"]}
              gradientColors={["#17ad37"]}
              height={250}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WidgetsDataComponents;
