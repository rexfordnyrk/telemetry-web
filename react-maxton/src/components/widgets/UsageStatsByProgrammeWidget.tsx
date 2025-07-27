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
  const [selectedProgrammeOption, setSelectedProgrammeOption] = useState<string>("all");
  const [selectedDataPointOption, setSelectedDataPointOption] = useState<string>("app-sessions");
  const [isMultipleProgrammes, setIsMultipleProgrammes] = useState(true);

  // Handle programme selection changes
  const handleProgrammeChange = (value: string) => {
    setSelectedProgrammeOption(value);
    if (value === "all" || value === "multiple") {
      setIsMultipleProgrammes(true);
      setSelectedDataPointOption("app-sessions"); // Reset to single datapoint when multiple programmes
    } else {
      setIsMultipleProgrammes(false);
    }
  };

  // Handle datapoint selection changes
  const handleDataPointChange = (value: string) => {
    setSelectedDataPointOption(value);
  };

  // Apply filters and update chart
  const applyFilters = () => {
    console.log('Applying filters:', { programme: selectedProgrammeOption, dataPoint: selectedDataPointOption });
    // TODO: Make API call and update chart data
    // For now, we'll update with mock data
    updateChartData();
  };

  const updateChartData = () => {
    // Mock data update based on selection
    // This will be replaced with actual API call
    const newSeries: { name: string; data: number[] }[] = [];
    const newPeityData: PeityData[] = [];
    const newColors: string[] = [];
    const newGradientColors: string[] = [];

    if (isMultipleProgrammes) {
      // Show single datapoint across multiple programmes
      const dataPoint = availableDataPoints.find(dp => dp.id === selectedDataPointOption);
      const programmesToShow = selectedProgrammeOption === "all"
        ? availableProgrammes
        : availableProgrammes;

      programmesToShow.forEach((programme) => {
        const randomData = Array.from({length: 9}, () => Number((Math.random() * 100).toFixed(2)));
        newSeries.push({
          name: programme.name,
          data: randomData
        });
        newColors.push(programme.color);
        newGradientColors.push(programme.color);

        const amount = (Math.random() * 5000).toFixed(2);
        const percentage = (Math.random() * 30).toFixed(2);

        newPeityData.push({
          value: `${Math.floor(Math.random() * 10)}/10`,
          color: programme.color,
          label: programme.name,
          amount: amount,
          percentage: `${percentage}%`,
          amountUnit: dataPoint?.name.includes("GB") ? "GB" : dataPoint?.name.includes("Hours") ? "hrs" : "sessions"
        });
      });
    } else {
      // Show multiple datapoints for single programme
      const programme = availableProgrammes.find(p => p.id === selectedProgrammeOption);

      if (selectedDataPointOption === "multiple") {
        // Show all datapoints for single programme
        availableDataPoints.forEach((dataPoint) => {
          const randomData = Array.from({length: 9}, () => Number((Math.random() * 100).toFixed(2)));
          newSeries.push({
            name: dataPoint.name,
            data: randomData
          });
          newColors.push(dataPoint.color);
          newGradientColors.push(dataPoint.color);

          const amount = (Math.random() * 5000).toFixed(2);
          const percentage = (Math.random() * 30).toFixed(2);

          newPeityData.push({
            value: `${Math.floor(Math.random() * 10)}/10`,
            color: dataPoint.color,
            label: dataPoint.name,
            amount: amount,
            percentage: `${percentage}%`,
            amountUnit: dataPoint.name.includes("GB") ? "GB" : dataPoint.name.includes("Hours") ? "hrs" : "sessions"
          });
        });
      } else {
        // Show single datapoint for single programme
        const dataPoint = availableDataPoints.find(dp => dp.id === selectedDataPointOption);
        if (dataPoint) {
          const randomData = Array.from({length: 9}, () => Number((Math.random() * 100).toFixed(2)));
          newSeries.push({
            name: `${programme?.name} - ${dataPoint.name}`,
            data: randomData
          });
          newColors.push(dataPoint.color);
          newGradientColors.push(dataPoint.color);

          const amount = (Math.random() * 5000).toFixed(2);
          const percentage = (Math.random() * 30).toFixed(2);

          newPeityData.push({
            value: `${Math.floor(Math.random() * 10)}/10`,
            color: dataPoint.color,
            label: dataPoint.name,
            amount: amount,
            percentage: `${percentage}%`,
            amountUnit: dataPoint.name.includes("GB") ? "GB" : dataPoint.name.includes("Hours") ? "hrs" : "sessions"
          });
        }
      }
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
  }, [usageData]); // Removed dependency on selection changes to prevent auto-rebuild

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h5 className="mb-0">{usageData.title}</h5>

          <div className="d-flex align-items-center gap-2">
            {/* Programme Selection */}
            <Form.Select
              size="sm"
              value={selectedProgrammeOption}
              onChange={(e) => handleProgrammeChange(e.target.value)}
              style={{ width: "180px" }}
            >
              <option value="all">All Programmes</option>
              {availableProgrammes.map(programme => (
                <option key={programme.id} value={programme.id}>
                  {programme.name}
                </option>
              ))}
            </Form.Select>

            {/* DataPoint Selection */}
            <Form.Select
              size="sm"
              value={selectedDataPointOption}
              onChange={(e) => handleDataPointChange(e.target.value)}
              style={{ width: "160px" }}
            >
              {isMultipleProgrammes ? (
                // Multiple programmes - single datapoint only
                availableDataPoints.map(dataPoint => (
                  <option key={dataPoint.id} value={dataPoint.id}>
                    {dataPoint.name}
                  </option>
                ))
              ) : (
                // Single programme - allow multiple datapoints option
                <>
                  <option value="multiple">All Data Points</option>
                  {availableDataPoints.map(dataPoint => (
                    <option key={dataPoint.id} value={dataPoint.id}>
                      {dataPoint.name}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>

            <Button
              variant="primary"
              size="sm"
              onClick={applyFilters}
              className="px-3"
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
