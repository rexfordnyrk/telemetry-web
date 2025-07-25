import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface TotalProfitData {
  title: string;
  value: string;
  subtitle: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  chartData: number[];
  colors: string[];
  gradientColors: string[];
}

interface TotalProfitWidgetProps {
  data?: TotalProfitData;
  showDropdown?: boolean;
}

const defaultTotalProfitData: TotalProfitData = {
  title: "Total Profit",
  value: "$15.7K",
  subtitle: "from last month",
  changePercentage: "12.5%",
  changeDirection: "up",
  chartId: "total-profit-chart",
  chartData: [8, 10, 25, 18, 38, 24, 20, 16, 7],
  colors: ["#ff0080"],
  gradientColors: ["#7928ca"],
};

const TotalProfitWidget: React.FC<TotalProfitWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const profitData = data || defaultTotalProfitData;

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: [
              {
                name: "Weekly Sales",
                data: profitData.chartData,
              },
            ],
            chart: {
              height: 160,
              type: "bar" as const,
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
              curve: "smooth" as const,
              color: ["transparent"],
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: profitData.gradientColors,
                shadeIntensity: 1,
                type: "vertical",
              },
            },
            colors: profitData.colors,
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

          const chartElement = document.querySelector(`#${profitData.chartId}`);
          if (chartElement) {
            new (window as any).ApexCharts(chartElement, chartOptions).render();
          }
        }
      } catch (error) {
        console.warn("Chart initialization error:", error);
      }
    };

    const timer = setTimeout(initChart, 100);
    return () => clearTimeout(timer);
  }, [profitData]);

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{profitData.value}</h5>
            <p className="mb-0">{profitData.title}</p>
          </div>
          {showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
                as="a"
                href="javascript:;"
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="javascript:;">Action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Another action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div>
          <div id={profitData.chartId}></div>
        </div>
        <div className="text-center mt-3">
          <p className="mb-0">
            <span className={`me-1 ${profitData.changeDirection === "up" ? "text-success" : "text-danger"}`}>
              {profitData.changePercentage}
            </span>
            {profitData.subtitle}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalProfitWidget;
