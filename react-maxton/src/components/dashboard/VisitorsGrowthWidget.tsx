import React from "react";
import { Card } from "react-bootstrap";
import SafeApexChart from "../SafeApexChart";

interface ProgressItem {
  label: string;
  value: string;
  progress: number;
  bgClass: string;
}

interface VisitorsGrowthData {
  title: string;
  mainPercentage: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
  progressItems: ProgressItem[];
}

interface VisitorsGrowthWidgetProps {
  data?: VisitorsGrowthData;
}

const defaultVisitorsGrowthData: VisitorsGrowthData = {
  title: "Visitors Growth",
  mainPercentage: "36.7%",
  changePercentage: "34.5%",
  changeDirection: "up",
  series: [
    {
      name: "Total Sales",
      data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
    },
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  progressItems: [
    {
      label: "Clicks",
      value: "2589",
      progress: 65,
      bgClass: "bg-grd-primary",
    },
    {
      label: "Likes",
      value: "6748",
      progress: 55,
      bgClass: "bg-grd-warning",
    },
    {
      label: "Upvotes",
      value: "9842",
      progress: 45,
      bgClass: "bg-grd-info",
    },
  ],
};

const VisitorsGrowthWidget: React.FC<VisitorsGrowthWidgetProps> = ({ data }) => {
  const visitorsData = data || defaultVisitorsGrowthData;

  const chartOptions = {
    series: visitorsData.series,
    chart: {
      height: 210,
      type: "area" as const,
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
      curve: "straight" as const,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: visitorsData.gradientColors,
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 0.7,
        opacityTo: 0.0,
      },
    },
    colors: visitorsData.colors,
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
    markers: {
      show: false,
      size: 5,
    },
    xaxis: {
      categories: visitorsData.categories,
    },
  };

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div>
          <SafeApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="area"
            height={210}
          />
        </div>
        <div className="d-flex align-items-center gap-3 mt-4">
          <div>
            <h1 className="mb-0">{visitorsData.mainPercentage}</h1>
          </div>
          <div className="d-flex align-items-center align-self-end gap-2">
            <span className={`material-icons-outlined ${visitorsData.changeDirection === "up" ? "text-success" : "text-danger"}`}>
              {visitorsData.changeDirection === "up" ? "trending_up" : "trending_down"}
            </span>
            <p className={`mb-0 ${visitorsData.changeDirection === "up" ? "text-success" : "text-danger"}`}>
              {visitorsData.changePercentage}
            </p>
          </div>
        </div>
        <p className="mb-4">{visitorsData.title}</p>
        <div className="d-flex flex-column gap-3">
          {visitorsData.progressItems.map((item, index) => (
            <div key={index}>
              <p className="mb-1">
                {item.label} <span className="float-end">{item.value}</span>
              </p>
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className={`progress-bar ${item.bgClass}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default VisitorsGrowthWidget;
