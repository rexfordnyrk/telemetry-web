import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface OrderStatusData {
  title: string;
  centerValue: string;
  centerLabel: string;
  series: number[];
  colors: string[];
  gradientColors: string[];
  statusItems: {
    label: string;
    percentage: string;
    iconColor: string;
  }[];
  chartId: string;
}

interface OrderStatusWidgetProps {
  data?: OrderStatusData;
  showDropdown?: boolean;
}

const defaultOrderStatusData: OrderStatusData = {
  title: "Order Status",
  centerValue: "68%",
  centerLabel: "Total Sales",
  series: [58, 25, 25],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  statusItems: [
    {
      label: "Sales",
      percentage: "68%",
      iconColor: "text-primary",
    },
    {
      label: "Product",
      percentage: "25%",
      iconColor: "text-danger",
    },
    {
      label: "Income",
      percentage: "14%",
      iconColor: "text-success",
    },
  ],
  chartId: "order-status-chart",
};

const OrderStatusWidget: React.FC<OrderStatusWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const statusData = data || defaultOrderStatusData;

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: statusData.series,
            chart: {
              height: 290,
              type: "donut" as const,
            },
            legend: {
              position: "bottom" as const,
              show: false,
            },
            fill: {
              type: "gradient",
              gradient: {
                shade: "dark",
                gradientToColors: statusData.gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
              },
            },
            colors: statusData.colors,
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
                    height: 270,
                  },
                  legend: {
                    position: "bottom" as const,
                    show: false,
                  },
                },
              },
            ],
          };

          const chartElement = document.querySelector(`#${statusData.chartId}`);
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
  }, [statusData]);

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h5 className="mb-0">{statusData.title}</h5>
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
          <div className="position-relative">
            <div className="piechart-legend">
              <h2 className="mb-1">{statusData.centerValue}</h2>
              <h6 className="mb-0">{statusData.centerLabel}</h6>
            </div>
            <div id={statusData.chartId}></div>
          </div>
          <div className="d-flex flex-column gap-3">
            {statusData.statusItems.map((item, index) => (
              <div key={index} className="d-flex align-items-center justify-content-between">
                <p className="mb-0 d-flex align-items-center gap-2 w-25">
                  <span className={`material-icons-outlined fs-6 ${item.iconColor}`}>
                    fiber_manual_record
                  </span>
                  {item.label}
                </p>
                <div>
                  <p className="mb-0">{item.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderStatusWidget;
