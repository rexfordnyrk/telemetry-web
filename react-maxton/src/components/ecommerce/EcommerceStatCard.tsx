import React from "react";
import { Card } from "react-bootstrap";

interface EcommerceStatData {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  icon: string;
  iconBgClass: string;
  chartId: string;
  chartType: "area" | "bar";
  chartData: number[];
  colors: string[];
  gradientColors: string[];
}

interface EcommerceStatCardProps {
  data?: EcommerceStatData;
}

const defaultEcommerceStatData: EcommerceStatData = {
  title: "Total Orders",
  value: "248k",
  changePercentage: "+24%",
  changeDirection: "up",
  icon: "shopping_cart",
  iconBgClass: "bg-primary bg-opacity-10 text-primary",
  chartId: "stat-chart-1",
  chartType: "area",
  chartData: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
  colors: ["#0d6efd"],
  gradientColors: ["#0d6efd"],
};

const EcommerceStatCard: React.FC<EcommerceStatCardProps> = ({ data }) => {
  const statData = data || defaultEcommerceStatData;

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: [
              {
                name: statData.title,
                data: statData.chartData,
              },
            ],
            chart: {
              height: 60,
              type: statData.chartType,
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
              width: statData.chartType === "area" ? 1.5 : 1,
              curve: "smooth" as const,
              colors: statData.chartType === "bar" ? ["transparent"] : undefined,
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: statData.gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: statData.chartType === "area" ? 0.7 : 1,
                opacityTo: statData.chartType === "area" ? 0.0 : 1,
                stops: statData.chartType === "bar" ? [0, 100, 100, 100] : undefined,
              },
            },
            colors: statData.colors,
            plotOptions: statData.chartType === "bar" ? {
              bar: {
                horizontal: false,
                borderRadius: 3,
                columnWidth: "48%",
              },
            } : undefined,
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
                  formatter: function () {
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

          const chartElement = document.querySelector(`#${statData.chartId}`);
          if (chartElement) {
            const chart = new (window as any).ApexCharts(chartElement, chartOptions);
            chart.render();
          } else {
            console.warn(`Chart element with ID ${statData.chartId} not found`);
          }
        }
      } catch (error) {
        console.warn("Chart initialization error:", error);
      }
    };

    const timer = setTimeout(initChart, 100);
    return () => clearTimeout(timer);
  }, [statData]);

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className={`wh-42 d-flex align-items-center justify-content-center rounded-circle ${statData.iconBgClass}`}>
            <span className="material-icons-outlined fs-5">
              {statData.icon}
            </span>
          </div>
          <div>
            <span className={`d-flex align-items-center ${statData.changeDirection === "up" ? "text-success" : "text-danger"}`}>
              {statData.changePercentage}
              <i className="material-icons-outlined">
                {statData.changeDirection === "up" ? "expand_less" : "expand_more"}
              </i>
            </span>
          </div>
        </div>
        <div>
          <h4 className="mb-0">{statData.value}</h4>
          <p className="mb-3">{statData.title}</p>
          <div id={statData.chartId}></div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcommerceStatCard;
