import React, { useEffect, useRef } from "react";

interface StatCardWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  chartType?: "area" | "bar";
  showDropdown?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

const defaultProps: Partial<StatCardWidgetProps> = {
  data: [14, 41, 35, 51, 25, 18, 21, 35, 15],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#2af598"],
  gradientColors: ["#009efd"],
  height: 240,
  chartType: "bar",
  showDropdown: false,
};

const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  title,
  value,
  subtitle,
  chartId,
  data = defaultProps.data!,
  categories = defaultProps.categories!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
  height = defaultProps.height!,
  chartType = defaultProps.chartType!,
  showDropdown = defaultProps.showDropdown!,
  backgroundColor,
  textColor,
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          if (chartRef.current) {
            chartRef.current.destroy();
          }

          const baseOptions = {
            series: [
              {
                name: title,
                data: data,
              },
            ],
            chart: {
              foreColor: "#9ba7b2",
              height: height,
              type: chartType,
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
              width: chartType === "area" ? 3 : 1,
              curve: chartType === "area" ? "straight" : "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: chartType === "area" ? 0.8 : 1,
                opacityTo: chartType === "area" ? 0.1 : 1,
                stops: [0, 100, 100, 100],
              },
            },
            colors: colors,
            grid: {
              show: true,
              borderColor: backgroundColor ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.1)",
            },
            xaxis: {
              categories: categories,
            },
            tooltip: {
              theme: "dark",
              marker: {
                show: false,
              },
            },
          };

          // Add specific options for bar charts
          if (chartType === "bar") {
            (baseOptions as any).plotOptions = {
              bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "45%",
              },
            };
          }

          // Add specific options for area charts
          if (chartType === "area") {
            (baseOptions as any).markers = {
              show: false,
              size: 5,
            };
          }

          const chartElement = document.querySelector(`#${chartId}`);
          if (chartElement) {
            chartRef.current = new (window as any).ApexCharts(
              chartElement,
              baseOptions,
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
  }, [title, data, categories, colors, gradientColors, height, chartType, chartId]);

  return (
    <div className="card overflow-hidden w-100 rounded-4">
      <div className={`${backgroundColor || "card-body"}`}>
        {backgroundColor && (
          <div className="p-3">
            <div className="text-center">
              <h6 className={`mb-0 ${textColor || "text-white"}`}>{title}</h6>
            </div>
            <div className="mt-4" id={chartId}></div>
          </div>
        )}
        {!backgroundColor && (
          <div className="card-body">
            <div className="text-center">
              <h6 className="mb-0">{title}</h6>
            </div>
            <div className="mt-4" id={chartId}></div>
          </div>
        )}
      </div>
      <div className="p-4">
        <p>{subtitle}</p>
        <div className="d-flex align-items-center gap-3 mt-4">
          <div className="">
            <h1 className={`mb-0 ${backgroundColor ? "text-danger" : "text-primary"}`}>
              {value}
            </h1>
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
  );
};

export default StatCardWidget;
