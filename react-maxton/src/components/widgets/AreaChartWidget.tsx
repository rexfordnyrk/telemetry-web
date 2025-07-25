import React, { useEffect, useRef } from "react";

interface AreaChartWidgetProps {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  subtitle?: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
}

const defaultProps: Partial<AreaChartWidgetProps> = {
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#02c27a"],
  gradientColors: ["#0866ff"],
};

const AreaChartWidget: React.FC<AreaChartWidgetProps> = ({
  title,
  value,
  changePercentage,
  changeDirection,
  chartId,
  data = defaultProps.data!,
  categories = defaultProps.categories!,
  colors = defaultProps.colors!,
  gradientColors = defaultProps.gradientColors!,
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
    <div className="col">
      <div className="card rounded-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="">
              <h3 className="mb-0">{value}</h3>
            </div>
            <div className="">
              <p className={`dash-lable d-flex align-items-center gap-1 rounded mb-0 ${
                changeDirection === "up" 
                  ? "bg-success text-success" 
                  : "bg-danger text-danger"
                } bg-opacity-10`}>
                <span className="material-icons-outlined fs-6">
                  {changeDirection === "up" ? "arrow_upward" : "arrow_downward"}
                </span>
                {changePercentage}
              </p>
            </div>
          </div>
          <p className="mb-0">{title}</p>
          <div id={chartId}></div>
        </div>
      </div>
    </div>
  );
};

export default AreaChartWidget;
