import React, { useEffect, useRef } from "react";

interface IconAreaChartWidgetProps {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  subtitle?: string | React.ReactNode;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  icon?: string;
  iconImage?: string;
  iconBgClass?: string;
  showDropdown?: boolean;
}

const defaultProps: Partial<IconAreaChartWidgetProps> = {
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#02c27a"],
  gradientColors: ["#0866ff"],
  iconBgClass: "bg-primary bg-opacity-10 text-primary",
  showDropdown: true,
};

const IconAreaChartWidget: React.FC<IconAreaChartWidgetProps> = ({
  title,
  value,
  changePercentage,
  changeDirection,
  chartId,
  subtitle,
  data = defaultProps.data!,
  categories = defaultProps.categories!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  icon,
  iconImage,
  iconBgClass = defaultProps.iconBgClass!,
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
                gradientToColors: gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.5,
                opacityTo: 0.0,
              },
            },
            colors: colors,
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
  }, [title, data, categories, colors, gradientColors, chartId]);

  return (
    <div className="w-100">
      <div className="card rounded-4">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <h5 className="mb-0">{value}</h5>
              <p className="mb-0" style={{ fontSize: "12px" }}>{title}</p>
            </div>
            {iconImage ? (
              <img
                src={iconImage}
                alt={title}
                className="rounded"
                width="32"
                height="32"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className={`d-flex align-items-center justify-content-center rounded-circle ${iconBgClass}`} style={{ width: "32px", height: "32px", minWidth: "32px" }}>
                <span className="material-icons-outlined" style={{ fontSize: "18px" }}>
                  {icon || "apps"}
                </span>
              </div>
            )}
            {showDropdown && (
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-link dropdown-toggle-nocaret options dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ border: "none", background: "none", padding: "0" }}
                >
                  <span className="material-icons-outlined fs-5">
                    more_vert
                  </span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" type="button" onClick={() => console.log('Action')}>
                      Action
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button" onClick={() => console.log('Another action')}>
                      Another action
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button" onClick={() => console.log('Something else here')}>
                      Something else here
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="chart-container2">
            <div id={chartId}></div>
          </div>
          <div className="text-center">
            <p className="mb-0">
              {title === "Most Used App" ? (
                <>
                  {subtitle} <span className="text-success">{changePercentage}</span>
                </>
              ) : (
                <>
                  <span className={`me-1 ${changeDirection === "up" ? "text-success" : "text-danger"}`}>
                    {changePercentage}
                  </span>
                  {subtitle}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconAreaChartWidget;
