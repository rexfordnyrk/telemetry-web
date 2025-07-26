import React, { useState } from "react";
import { Card, Dropdown, Form } from "react-bootstrap";

declare const $: any;

interface PeityData {
  value: string;
  color: string;
  label: string;
  amount: string;
  percentage: string;
  amountUnit: string;
}

interface UsageStatsByProgrammeData {
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

interface UsageStatsByProgrammeWidgetProps {
  data?: UsageStatsByProgrammeData;
  showDropdown?: boolean;
}

const defaultUsageData: UsageStatsByProgrammeData = {
  title: "Usage Stats by Programme",
  series: [
    {
      name: "App Sessions",
      data: [45, 30, 55, 40, 35, 50, 65, 40, 55]
    },
    {
      name: "Network Usage (GB)",
      data: [25, 20, 35, 25, 20, 30, 40, 25, 35]
    },
    {
      name: "Screentime (Hours)",
      data: [15, 25, 20, 30, 25, 35, 30, 35, 25]
    }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#0d6efd", "#198754", "#ffc107"],
  gradientColors: ["#6610f2", "#20c997", "#fd7e14"],
  chartId: "usage-stats-chart",
  peityData: [
    {
      value: "7/10",
      color: "#0d6efd",
      label: "App Sessions",
      amount: "2,847",
      percentage: "18.5%",
      amountUnit: "sessions"
    },
    {
      value: "6/10", 
      color: "#198754",
      label: "Network Usage",
      amount: "145.8 GB",
      percentage: "12.3%",
      amountUnit: "data consumed"
    },
    {
      value: "8/10",
      color: "#ffc107", 
      label: "Screentime",
      amount: "486 hrs",
      percentage: "24.7%",
      amountUnit: "active hours"
    }
  ]
};

const UsageStatsByProgrammeWidget: React.FC<UsageStatsByProgrammeWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const usageData = data || defaultUsageData;
  const [selectedProgramme, setSelectedProgramme] = useState("All Programmes");
  const [selectedDatapoint, setSelectedDatapoint] = useState("All Datapoints");

  React.useEffect(() => {
    const initChart = () => {
      try {
        if (typeof window !== "undefined" && (window as any).ApexCharts) {
          const chartOptions = {
            series: usageData.series,
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
                gradientToColors: usageData.gradientColors,
                shadeIntensity: 1,
                type: "vertical",
                stops: [0, 100, 100, 100],
              },
            },
            colors: usageData.colors,
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
              categories: usageData.categories,
            },
          };

          const chartElement = document.querySelector(`#${usageData.chartId}`);
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
  }, [usageData, selectedProgramme, selectedDatapoint]);

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h5 className="mb-0">{usageData.title}</h5>

          <div className="d-flex align-items-center gap-2">
            {/* Filter Controls */}
            <Form.Select
              size="sm"
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              style={{ width: "160px" }}
            >
              <option>All Programmes</option>
              <option>Digital Literacy</option>
              <option>Skills Training</option>
              <option>Financial Education</option>
              <option>Health Awareness</option>
              <option>Youth Development</option>
            </Form.Select>

            <Form.Select
              size="sm"
              value={selectedDatapoint}
              onChange={(e) => setSelectedDatapoint(e.target.value)}
              style={{ width: "140px" }}
            >
              <option>All Datapoints</option>
              <option>App Sessions</option>
              <option>Network Usage</option>
              <option>Screentime</option>
            </Form.Select>

            <button
              className="btn btn-primary btn-sm px-3"
              onClick={() => {
                // Apply filters logic here
                console.log('Applying filters:', selectedProgramme, selectedDatapoint);
              }}
            >
              Apply
            </button>

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
                  <Dropdown.Item href="javascript:;">Export Data</Dropdown.Item>
                  <Dropdown.Item href="javascript:;">View Details</Dropdown.Item>
                  <Dropdown.Item href="javascript:;">Settings</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        <div id={usageData.chartId}></div>
        <div className="d-flex flex-column flex-lg-row align-items-start justify-content-around border p-3 rounded-4 mt-3 gap-3">
          {usageData.peityData.map((item, index) => (
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
              {index < usageData.peityData.length - 1 && <div className="vr"></div>}
            </React.Fragment>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UsageStatsByProgrammeWidget;
