import React, { useEffect, useRef } from "react";

interface IconRadialChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  series?: number[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
  startAngle?: number;
  endAngle?: number;
  icon?: string;
  iconImage?: string;
  iconBgClass?: string;
}

const defaultProps: Partial<IconRadialChartWidgetProps> = {
  series: [78],
  colors: ["#ee0979"],
  gradientColors: ["#ffd200"],
  height: 180,
  showDropdown: true,
  startAngle: -115,
  endAngle: 115,
  iconBgClass: "bg-primary bg-opacity-10 text-primary",
};

const IconRadialChartWidget: React.FC<IconRadialChartWidgetProps> = ({
  title,
  value,
  subtitle,
  chartId,
  series = defaultProps.series!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  height = defaultProps.height!,
  showDropdown = defaultProps.showDropdown!,
  startAngle = defaultProps.startAngle!,
  endAngle = defaultProps.endAngle!,
  icon,
  iconImage,
  iconBgClass = defaultProps.iconBgClass!,
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
              height: height,
              type: "radialBar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              radialBar: {
                startAngle: startAngle,
                endAngle: endAngle,
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
                gradientToColors: gradientColors,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
              },
            },
            colors: colors,
            stroke: {
              lineCap: "round",
            },
            labels: [title],
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
  }, [title, series, colors, gradientColors, height, startAngle, endAngle, chartId]);

  return (
    <div className="col d-flex">
      <div className="card rounded-4 w-100">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-1">
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
                  {icon || "people"}
                </span>
              </div>
            )}
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

export default IconRadialChartWidget;
