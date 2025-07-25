import React, { useEffect, useRef } from "react";
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
