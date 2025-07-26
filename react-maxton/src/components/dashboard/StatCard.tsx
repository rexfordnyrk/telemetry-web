import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface StatCardData {
  title: string;
  value: string;
  subtitle: string;
  changePercentage?: string;
  changeDirection?: "up" | "down";
  chartComponent?: React.ReactNode;
  showDropdown?: boolean;
}

interface StatCardProps {
  data?: StatCardData;
}

const defaultStatCardData: StatCardData = {
  title: "Total Accounts",
  value: "85,247",
  subtitle: "accounts registered",
  changePercentage: "23.7%",
  changeDirection: "down",
  showDropdown: false,
};

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const cardData = data || defaultStatCardData;

  return (
    <Card className="rounded-4">
      <Card.Body>
        <div className="d-flex align-items-center gap-3 mb-2">
          <div>
            <h3 className="mb-0">{cardData.value}</h3>
          </div>
          {cardData.changePercentage && (
            <div className="flex-grow-0">
              <p className={`dash-lable d-flex align-items-center gap-1 rounded mb-0 ${
                cardData.changeDirection === "up" 
                  ? "bg-success text-success" 
                  : "bg-danger text-danger"
                } bg-opacity-10`}>
                <span className="material-icons-outlined fs-6">
                  {cardData.changeDirection === "up" ? "arrow_upward" : "arrow_downward"}
                </span>
                {cardData.changePercentage}
              </p>
            </div>
          )}
          {cardData.showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Action</Dropdown.Item>
                <Dropdown.Item>Another action</Dropdown.Item>
                <Dropdown.Item>Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <p className="mb-0">{cardData.title}</p>
        {cardData.chartComponent && (
          <div>
            {cardData.chartComponent}
          </div>
        )}
        {cardData.subtitle && cardData.subtitle !== cardData.title && (
          <div className="text-center">
            <p className="mb-0 font-12">{cardData.subtitle}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatCard;
