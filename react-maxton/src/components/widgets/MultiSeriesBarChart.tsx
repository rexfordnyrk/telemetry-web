import React, { useEffect, useRef } from "react";

interface Series {
  name: string;
  data: number[];
}

interface MultiSeriesBarChartProps {
  title: string;
  chartId: string;
  series?: Series[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
  monthlyValue?: string;
  monthlyChange?: string;
  monthlyAmount?: string;
  yearlyValue?: string;
  yearlyChange?: string;
  yearlyAmount?: string;
}

const defaultProps: Partial<MultiSeriesBarChartProps> = {
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
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#ff6a00", "#005bea"],
  gradientColors: ["#ffd200", "#00c6fb"],
  height: 235,
  showDropdown: true,
  monthlyValue: "65,127",
  monthlyChange: "16.5%",
  monthlyAmount: "55.21 USD",
  yearlyValue: "984,246",
  yearlyChange: "24.9%",
  yearlyAmount: "267.35 USD",
};

const MultiSeriesBarChart: React.FC<MultiSeriesBarChartProps> = ({
  title,
  chartId,
  series = defaultProps.series!,
  categories = defaultProps.categories!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  height = defaultProps.height!,
  showDropdown = defaultProps.showDropdown!,
  monthlyValue = defaultProps.monthlyValue!,
  monthlyChange = defaultProps.monthlyChange!,
  monthlyAmount = defaultProps.monthlyAmount!,
  yearlyValue = defaultProps.yearlyValue!,
  yearlyChange = defaultProps.yearlyChange!,
  yearlyAmount = defaultProps.yearlyAmount!,
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          if (chartRef.current) {
            chartRef.current.destroy();
          }

          const chartOptions = {
            series: series,
            chart: {
              foreColor: "#9ba7b2",
              height: height,
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
                gradientToColors: gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                stops: [0, 100, 100, 100],
              },
            },
            colors: colors,
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
              categories: categories,
            },
          };

          const chartElement = document.querySelector(`#${chartId}`);
          if (chartElement) {
            chartRef.current = new (window as any).ApexCharts(
              chartElement,
              chartOptions,
            );
            chartRef.current.render();
          }
        }
      } catch (error) {
        console.warn("Chart initialization error:", error);
      }
    };

    const timer = setTimeout(initChart, 100);
    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [title, series, categories, colors, gradientColors, height, chartId]);

  useEffect(() => {
    // Initialize Peity charts
    if (typeof $ !== "undefined" && $.fn.peity) {
      $("[data-peity]").peity("donut");
    }
  }, []);

  return (
    <div className="card w-100 rounded-4">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="">
            <h5 className="mb-0">{title}</h5>
          </div>
          {showDropdown && (
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
          )}
        </div>
        <div id={chartId}></div>
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
              <h2 className="mb-0">{monthlyValue}</h2>
              <p className="mb-0">
                <span className="text-success me-2 fw-medium">
                  {monthlyChange}
                </span>
                <span>{monthlyAmount}</span>
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
              <h2 className="mb-0">{yearlyValue}</h2>
              <p className="mb-0">
                <span className="text-success me-2 fw-medium">
                  {yearlyChange}
                </span>
                <span>{yearlyAmount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSeriesBarChart;
