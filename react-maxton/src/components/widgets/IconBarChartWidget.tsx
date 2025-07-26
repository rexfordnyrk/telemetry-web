import React, { useEffect, useRef } from "react";

interface IconBarChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data?: number[];
  colors?: string[];
  gradientColors?: string[];
  icon?: string;
  iconImage?: string;
  iconBgClass?: string;
  showDropdown?: boolean;
}

const defaultProps: Partial<IconBarChartWidgetProps> = {
  data: [4, 10, 12, 17, 25, 30, 40, 55, 68],
  colors: ["#ff6a00"],
  gradientColors: ["#7928ca"],
  iconBgClass: "bg-primary bg-opacity-10 text-primary",
  showDropdown: true,
};

const IconBarChartWidget: React.FC<IconBarChartWidgetProps> = ({
  title,
  value,
  subtitle,
  chartId,
  data = defaultProps.data!,
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
              width: 0,
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
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "55%",
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
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
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
  }, [title, data, colors, gradientColors, chartId]);

  return (
    <div className="col d-flex">
      <div className="card rounded-4 w-100">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="">
              <h5 className="mb-0">{value}</h5>
              <p className="mb-0">{title}</p>
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
                  {icon || "bar_chart"}
                </span>
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

export default IconBarChartWidget;
