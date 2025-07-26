import React from "react";
import { Card, Dropdown } from "react-bootstrap";

declare const $: any;

interface PeityData {
  value: string;
  color: string;
  label: string;
  amount: string;
  percentage: string;
  amountUnit: string;
}

interface SalesViewsData {
  title: string;
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
  chartId: string;
  peityData: PeityData[];
}

interface SalesViewsWidgetProps {
  data?: SalesViewsData;
  showDropdown?: boolean;
}

const defaultSalesViewsData: SalesViewsData = {
  title: "Sales & Views",
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
  chartId: "sales-views-chart",
  peityData: [
    {
      value: "5/7",
      color: "#2196f3",
      label: "Monthly",
      amount: "65,127",
      percentage: "16.5%",
      amountUnit: "55.21 USD",
    },
    {
      value: "5/7",
      color: "#ffd200",
      label: "Yearly",
      amount: "984,246",
      percentage: "24.9%",
      amountUnit: "267.35 USD",
    },
  ],
};

const SalesViewsWidget: React.FC<SalesViewsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const salesData = data || defaultSalesViewsData;

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: salesData.series,
            chart: {
              foreColor: "#9ba7b2",
              height: 235,
              type: "bar" as const,
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
              curve: "smooth" as const,
              colors: ["transparent"],
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: salesData.gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                stops: [0, 100, 100, 100],
              },
            },
            colors: salesData.colors,
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
              categories: salesData.categories,
            },
          };

          const chartElement = document.querySelector(`#${salesData.chartId}`);
          if (chartElement) {
            new (window as any).ApexCharts(chartElement, chartOptions).render();
          }
        }

        // Initialize Peity charts if available
        if (typeof $ !== "undefined" && $.fn.peity) {
          $("[data-peity]").peity("donut");
        }
      } catch (error) {
        console.warn("Chart initialization error:", error);
      }
    };

    const timer = setTimeout(initChart, 100);
    return () => clearTimeout(timer);
  }, [salesData]);

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{salesData.title}</h5>
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
        <div id={salesData.chartId}></div>
        <div className="d-flex flex-column flex-lg-row align-items-start justify-content-around border p-3 rounded-4 mt-3 gap-3">
          {salesData.peityData.map((item, index) => (
            <React.Fragment key={index}>
              <div className="d-flex align-items-center gap-4">
                <div>
                  <p className="mb-0 data-attributes">
                    <span 
                      data-peity={`{ "fill": ["${item.color}", "rgb(255 255 255 / 12%)"], "innerRadius": 32, "radius": 40 }`}
                    >
                      {item.value}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="mb-1 fs-6 fw-bold">{item.label}</p>
                  <h2 className="mb-0">{item.amount}</h2>
                  <p className="mb-0">
                    <span className="text-success me-2 fw-medium">
                      {item.percentage}
                    </span>
                    <span>{item.amountUnit}</span>
                  </p>
                </div>
              </div>
              {index < salesData.peityData.length - 1 && <div className="vr"></div>}
            </React.Fragment>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesViewsWidget;
