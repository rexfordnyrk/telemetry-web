import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface MonthlyBudgetData {
  title: string;
  amount: string;
  description: string;
  buttonText: string;
  percentage: number;
  chartId: string;
  colors: string[];
  gradientColors: string[];
}

interface MonthlyBudgetWidgetProps {
  data?: MonthlyBudgetData;
  showDropdown?: boolean;
}

const defaultMonthlyBudgetData: MonthlyBudgetData = {
  title: "Monthly Budget",
  amount: "$84,256",
  description: "Vestibulum fermentum nisl id nulla ultricies convallis.",
  buttonText: "Increase Budget",
  percentage: 78,
  chartId: "monthly-budget-chart",
  colors: ["#98ec2d"],
  gradientColors: ["#005bea"],
};

const MonthlyBudgetWidget: React.FC<MonthlyBudgetWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const budgetData = data || defaultMonthlyBudgetData;

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: [budgetData.percentage],
            chart: {
              height: 260,
              type: "radialBar" as const,
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 225,
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
                  background: "rgba(255, 255, 255, 0.12)",
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
                gradientToColors: budgetData.gradientColors,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
              },
            },
            colors: budgetData.colors,
            stroke: {
              lineCap: "round" as const,
            },
            labels: ["Total Orders"],
          };

          const chartElement = document.querySelector(`#${budgetData.chartId}`);
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
  }, [budgetData]);

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{budgetData.title}</h5>
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
        <div className="chart-container mb-2">
          <div id={budgetData.chartId}></div>
        </div>
        <div className="text-center">
          <h3>{budgetData.amount}</h3>
          <p className="mb-3">{budgetData.description}</p>
          <button className="btn btn-grd btn-grd-info rounded-5 px-4">
            {budgetData.buttonText}
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MonthlyBudgetWidget;
