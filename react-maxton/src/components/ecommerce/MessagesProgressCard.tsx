import React from "react";
import { Card } from "react-bootstrap";

interface MessagesProgressData {
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  progress: number;
  progressBgClass: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  subtitle: string;
}

interface MessagesProgressCardProps {
  data?: MessagesProgressData;
}

const defaultMessagesProgressData: MessagesProgressData = {
  title: "Messages",
  value: "986",
  icon: "shopping_cart",
  iconBgClass: "bg-grd-danger",
  progress: 60,
  progressBgClass: "bg-grd-danger",
  changePercentage: "+34.7%",
  changeDirection: "up",
  subtitle: "from last month",
};

const MessagesProgressCard: React.FC<MessagesProgressCardProps> = ({ data }) => {
  const cardData = data || defaultMessagesProgressData;

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="mb-1">{cardData.title}</p>
            <h3 className="mb-0">{cardData.value}</h3>
          </div>
          <div className={`wh-42 d-flex align-items-center justify-content-center rounded-circle ${cardData.iconBgClass}`}>
            <span className="material-icons-outlined fs-5 text-white">
              {cardData.icon}
            </span>
          </div>
        </div>
        <div className="progress mb-0" style={{ height: "6px" }}>
          <div
            className={`progress-bar ${cardData.progressBgClass}`}
            role="progressbar"
            style={{ width: `${cardData.progress}%` }}
            aria-valuenow={cardData.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <div className="d-flex align-items-center mt-3 gap-2">
          <div className={`card-lable ${cardData.changeDirection === "up" ? "bg-success" : "bg-danger"} bg-opacity-10`}>
            <p className={`${cardData.changeDirection === "up" ? "text-success" : "text-danger"} mb-0`}>
              {cardData.changePercentage}
            </p>
          </div>
          <p className="mb-0 font-13">{cardData.subtitle}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MessagesProgressCard;
