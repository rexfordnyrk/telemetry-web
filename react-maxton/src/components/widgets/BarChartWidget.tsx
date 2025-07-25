import React, { useEffect, useRef } from "react";

interface BarChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
}

const defaultProps: Partial<BarChartWidgetProps> = {
  data: [8, 10, 25, 18, 38, 24, 20, 16, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  height: 120,
  showDropdown: true,
};

const BarChartWidget: React.FC<BarChartWidgetProps> = ({
  title,
  value,
  subtitle,
  chartId,
  data = defaultProps.data!,
  categories = defaultProps.categories!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  height = defaultProps.height!,
  showDropdown = defaultProps.showDropdown!,
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
            series: [
              {
                name: title,
                data: data,
              },
            ],
            chart: {
              height: height,
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
                gradientToColors: gradientColors,
                shadeIntensity: 1,
                type: "vertical",
              },
            },
            colors: colors,
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
  }, [title, data, categories, colors, gradientColors, height, chartId]);

  return (
    <div className="col d-flex">
      <div className="card rounded-4 w-100">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="">
              <h5 className="mb-0">{value}</h5>
              <p className="mb-0">{title}</p>
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
          <div className="chart-container2">
            <div id={chartId}></div>
          </div>
          <div className="text-center">
            <p className="mb-0">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartWidget;
