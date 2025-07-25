import React from "react";
import { Card } from "react-bootstrap";
import SafeApexChart from "../SafeApexChart";

interface MonthlyRevenueData {
  title: string;
  subtitle: string;
  percentageValue: string;
  percentageChange: string;
  percentageDirection: "up" | "down";
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
}

interface MonthlyRevenueWidgetProps {
  data?: MonthlyRevenueData;
}

const defaultMonthlyRevenueData: MonthlyRevenueData = {
  title: "Monthly Revenue",
  subtitle: "Average monthly sale for every author",
  percentageValue: "68.9%",
  percentageChange: "34.5%",
  percentageDirection: "up",
  series: [
    {
      name: "Revenue",
      data: [14, 41, 35, 51, 25, 18, 21, 35, 15],
    },
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#2af598"],
  gradientColors: ["#009efd"],
};

const MonthlyRevenueWidget: React.FC<MonthlyRevenueWidgetProps> = ({ data }) => {
  const revenueData = data || defaultMonthlyRevenueData;

  const chartOptions = {
    series: revenueData.series,
    chart: {
      foreColor: "#9ba7b2",
      height: 280,
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
      width: 1,
      curve: "smooth" as const,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "45%",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: revenueData.gradientColors,
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    colors: revenueData.colors,
    grid: {
      show: true,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    xaxis: {
      categories: revenueData.categories,
    },
    tooltip: {
      theme: "dark",
      marker: {
        show: false,
      },
    },
  };

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="text-center">
          <h6 className="mb-0">{revenueData.title}</h6>
        </div>
        <div className="mt-4">
          <SafeApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="bar"
            height={280}
          />
        </div>
        <p>{revenueData.subtitle}</p>
        <div className="d-flex align-items-center gap-3 mt-4">
          <div>
            <h1 className="mb-0 text-primary">{revenueData.percentageValue}</h1>
          </div>
          <div className="d-flex align-items-center align-self-end">
            <p className={`mb-0 ${revenueData.percentageDirection === "up" ? "text-success" : "text-danger"}`}>
              {revenueData.percentageChange}
            </p>
            <span className={`material-icons-outlined ${revenueData.percentageDirection === "up" ? "text-success" : "text-danger"}`}>
              {revenueData.percentageDirection === "up" ? "expand_less" : "expand_more"}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MonthlyRevenueWidget;
