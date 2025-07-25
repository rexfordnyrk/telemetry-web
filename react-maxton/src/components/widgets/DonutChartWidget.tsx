import React, { useEffect, useRef } from "react";

interface LegendItem {
  label: string;
  value: string;
  color: string;
}

interface DonutChartWidgetProps {
  title: string;
  centerLabel?: string;
  centerValue?: string;
  chartId: string;
  series?: number[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
  legendItems?: LegendItem[];
  backgroundColor?: string;
}

const defaultProps: Partial<DonutChartWidgetProps> = {
  series: [58, 25, 25],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  height: 290,
  showDropdown: true,
  legendItems: [
    { label: "Sales", value: "68%", color: "text-primary" },
    { label: "Product", value: "25%", color: "text-danger" },
    { label: "Income", value: "14%", color: "text-success" },
  ],
};

const DonutChartWidget: React.FC<DonutChartWidgetProps> = ({
  title,
  centerLabel,
  centerValue,
  chartId,
  series = defaultProps.series!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  height = defaultProps.height!,
  showDropdown = defaultProps.showDropdown!,
  legendItems = defaultProps.legendItems!,
  backgroundColor,
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
                gradientToColors: gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
              },
            },
            colors: colors,
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
                    height: height - 20,
                  },
                  legend: {
                    position: "bottom",
                    show: false,
                  },
                },
              },
            ],
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
  }, [title, series, colors, gradientColors, height, chartId]);

  return (
    <div className="card w-100 rounded-4">
      <div className={`card-body ${backgroundColor || ""}`}>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start justify-content-between">
            <div className="">
              <h5 className={`mb-0 ${backgroundColor ? "text-white" : ""}`}>
                {title}
              </h5>
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
          <div className="position-relative">
            {centerLabel && centerValue && (
              <div className="piechart-legend">
                <h2 className="mb-1">{centerValue}</h2>
                <h6 className="mb-0">{centerLabel}</h6>
              </div>
            )}
            <div id={chartId}></div>
          </div>
          {legendItems && legendItems.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {legendItems.map((item, index) => (
                <div key={index} className="d-flex align-items-center justify-content-between">
                  <p className="mb-0 d-flex align-items-center gap-2 w-25">
                    <span className={`material-icons-outlined fs-6 ${item.color}`}>
                      fiber_manual_record
                    </span>
                    {item.label}
                  </p>
                  <div className="">
                    <p className="mb-0">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutChartWidget;
