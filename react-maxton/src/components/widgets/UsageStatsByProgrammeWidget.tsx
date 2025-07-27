import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";

declare const $: any;

interface PeityData {
  value: string;
  color: string;
  label: string;
  amount: string;
  percentage: string;
  amountUnit: string;
}

interface Programme {
  id: string;
  name: string;
  color: string;
}

interface DataPoint {
  id: string;
  name: string;
  color: string;
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

const availableProgrammes: Programme[] = [
  { id: "digital-literacy", name: "Digital Literacy", color: "#0d6efd" },
  { id: "skills-training", name: "Skills Training", color: "#198754" },
  { id: "financial-education", name: "Financial Education", color: "#ffc107" },
  { id: "health-awareness", name: "Health Awareness", color: "#dc3545" },
  { id: "youth-development", name: "Youth Development", color: "#6f42c1" },
];

const availableDataPoints: DataPoint[] = [
  { id: "app-sessions", name: "App Sessions", color: "#0d6efd" },
  { id: "network-usage", name: "Network Usage (GB)", color: "#198754" },
  { id: "screentime", name: "Screentime (Hours)", color: "#ffc107" },
];

const defaultUsageData: UsageStatsByProgrammeData = {
  title: "Usage Stats by Programme",
  series: [
    {
      name: "App Sessions",
      data: [45, 30, 55, 40, 35, 50, 65, 40, 55]
    }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#0d6efd"],
  gradientColors: ["#6610f2"],
  chartId: "usage-stats-chart",
  peityData: [
    {
      value: "7/10",
      color: "#0d6efd",
      label: "Digital Literacy",
      amount: "2,847",
      percentage: "18.5%",
      amountUnit: "sessions"
    },
    {
      value: "6/10",
      color: "#198754",
      label: "Skills Training",
      amount: "1,856",
      percentage: "12.3%",
      amountUnit: "sessions"
    },
    {
      value: "8/10",
      color: "#ffc107",
      label: "Financial Education",
      amount: "3,124",
      percentage: "24.7%",
      amountUnit: "sessions"
    }
  ]
};

const UsageStatsByProgrammeWidget: React.FC<UsageStatsByProgrammeWidgetProps> = ({
  data,
  showDropdown = false, // Removed dropdown menu as requested
}) => {
  const [usageData, setUsageData] = useState(data || defaultUsageData);
  const [selectedProgrammes, setSelectedProgrammes] = useState<string[]>(["all"]);
  const [selectedDataPoints, setSelectedDataPoints] = useState<string[]>(["app-sessions"]);
  const [isMultipleProgrammes, setIsMultipleProgrammes] = useState(true);

  // Handle programme selection changes
  const handleProgrammeChange = (programmeId: string, checked: boolean) => {
    if (programmeId === "all") {
      if (checked) {
        setSelectedProgrammes(["all"]);
        setIsMultipleProgrammes(true);
        setSelectedDataPoints(["app-sessions"]); // Reset to single datapoint
      } else {
        setSelectedProgrammes([]);
      }
    } else {
      let newSelection = selectedProgrammes.filter(id => id !== "all");
      if (checked) {
        newSelection = [...newSelection, programmeId];
      } else {
        newSelection = newSelection.filter(id => id !== programmeId);
      }

      if (newSelection.length === 0) {
        setSelectedProgrammes(["all"]);
        setIsMultipleProgrammes(true);
      } else if (newSelection.length === 1) {
        setSelectedProgrammes(newSelection);
        setIsMultipleProgrammes(false);
      } else {
        setSelectedProgrammes(newSelection);
        setIsMultipleProgrammes(true);
        setSelectedDataPoints(["app-sessions"]); // Reset to single datapoint
      }
    }
  };

  // Handle datapoint selection changes
  const handleDataPointChange = (dataPointId: string, checked: boolean) => {
    if (!isMultipleProgrammes) {
      // Single programme selected - allow multiple datapoints
      if (checked) {
        setSelectedDataPoints([...selectedDataPoints, dataPointId]);
      } else {
        const newSelection = selectedDataPoints.filter(id => id !== dataPointId);
        if (newSelection.length === 0) {
          setSelectedDataPoints(["app-sessions"]); // Always have at least one
        } else {
          setSelectedDataPoints(newSelection);
        }
      }
    } else {
      // Multiple programmes selected - only single datapoint allowed
      setSelectedDataPoints([dataPointId]);
    }
  };

  // Apply filters and update chart
  const applyFilters = () => {
    console.log('Applying filters:', { programmes: selectedProgrammes, dataPoints: selectedDataPoints });
    // TODO: Make API call and update chart data
    // For now, we'll update with mock data
    updateChartData();
  };

  const updateChartData = () => {
    // Mock data update based on selection
    // This will be replaced with actual API call
    let newSeries = [];
    let newPeityData = [];
    let newColors = [];
    let newGradientColors = [];

    if (isMultipleProgrammes) {
      // Show single datapoint across multiple programmes
      const dataPoint = availableDataPoints.find(dp => dp.id === selectedDataPoints[0]);
      const programmesToShow = selectedProgrammes.includes("all")
        ? availableProgrammes
        : availableProgrammes.filter(p => selectedProgrammes.includes(p.id));

      programmesToShow.forEach((programme, index) => {
        newSeries.push({
          name: programme.name,
          data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]
        });
        newColors.push(programme.color);
        newGradientColors.push(programme.color);
        newPeityData.push({
          value: `${Math.floor(Math.random() * 10)}/10`,
          color: programme.color,
          label: programme.name,
          amount: Math.floor(Math.random() * 5000).toString(),
          percentage: `${Math.floor(Math.random() * 30)}%`,
          amountUnit: dataPoint?.name.includes("GB") ? "GB" : dataPoint?.name.includes("Hours") ? "hrs" : "sessions"
        });
      });
    } else {
      // Show multiple datapoints for single programme
      const programme = availableProgrammes.find(p => p.id === selectedProgrammes[0]);
      selectedDataPoints.forEach((dataPointId, index) => {
        const dataPoint = availableDataPoints.find(dp => dp.id === dataPointId);
        if (dataPoint) {
          newSeries.push({
            name: dataPoint.name,
            data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]
          });
          newColors.push(dataPoint.color);
          newGradientColors.push(dataPoint.color);
          newPeityData.push({
            value: `${Math.floor(Math.random() * 10)}/10`,
            color: dataPoint.color,
            label: dataPoint.name,
            amount: Math.floor(Math.random() * 5000).toString(),
            percentage: `${Math.floor(Math.random() * 30)}%`,
            amountUnit: dataPoint.name.includes("GB") ? "GB" : dataPoint.name.includes("Hours") ? "hrs" : "sessions"
          });
        }
      });
    }

    setUsageData({
      ...usageData,
      series: newSeries,
      colors: newColors,
      gradientColors: newGradientColors,
      peityData: newPeityData
    });
  };

  useEffect(() => {
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
  }, [usageData, selectedProgrammes, selectedDataPoints]);

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
          <h5 className="mb-0">{usageData.title}</h5>

          <div className="d-flex align-items-center gap-3">
            {/* Programme Selection */}
            <div className="d-flex flex-column">
              <label className="form-label mb-1 small">Programmes</label>
              <div className="d-flex flex-wrap gap-2">
                <Form.Check
                  type="checkbox"
                  label="All"
                  checked={selectedProgrammes.includes("all")}
                  onChange={(e) => handleProgrammeChange("all", e.target.checked)}
                  className="small"
                />
                {availableProgrammes.map(programme => (
                  <Form.Check
                    key={programme.id}
                    type="checkbox"
                    label={programme.name}
                    checked={selectedProgrammes.includes(programme.id)}
                    onChange={(e) => handleProgrammeChange(programme.id, e.target.checked)}
                    className="small"
                    disabled={selectedProgrammes.includes("all")}
                  />
                ))}
              </div>
            </div>

            {/* DataPoint Selection */}
            <div className="d-flex flex-column">
              <label className="form-label mb-1 small">
                Data Points
                {isMultipleProgrammes && <span className="text-muted">(Single selection)</span>}
                {!isMultipleProgrammes && <span className="text-muted">(Multi selection)</span>}
              </label>
              <div className="d-flex flex-wrap gap-2">
                {availableDataPoints.map(dataPoint => (
                  <Form.Check
                    key={dataPoint.id}
                    type={isMultipleProgrammes ? "radio" : "checkbox"}
                    name={isMultipleProgrammes ? "datapoint" : undefined}
                    label={dataPoint.name}
                    checked={selectedDataPoints.includes(dataPoint.id)}
                    onChange={(e) => handleDataPointChange(dataPoint.id, e.target.checked)}
                    className="small"
                  />
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={applyFilters}
              className="align-self-end"
            >
              Apply
            </Button>
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
