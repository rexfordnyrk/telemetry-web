import React from "react";
import { Card } from "react-bootstrap";

interface CongratulationsData {
  userName: string;
  message: string;
  amount: string;
  targetPercentage: string;
  buttonText: string;
  partyImage: string;
  giftImage: string;
}

interface CongratulationsCardProps {
  data?: CongratulationsData;
}

const defaultCongratulationsData: CongratulationsData = {
  userName: "Jhon",
  message: "You are the best seller of this month",
  amount: "$168.5K",
  targetPercentage: "58% of sales target",
  buttonText: "View Details",
  partyImage: "/assets/images/apps/party-popper.png",
  giftImage: "/assets/images/apps/gift-box-3.png",
};

const CongratulationsCard: React.FC<CongratulationsCardProps> = ({ data }) => {
  const cardData = data || defaultCongratulationsData;

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <h5 className="mb-0">
              Congratulations <span className="fw-600">{cardData.userName}</span>
            </h5>
            <img
              src={cardData.partyImage}
              width="24"
              height="24"
              alt="party popper"
            />
          </div>
          <p className="mb-4">{cardData.message}</p>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="mb-0 text-indigo">{cardData.amount}</h3>
              <p className="mb-3">{cardData.targetPercentage}</p>
              <button className="btn btn-grd btn-grd-primary rounded-5 border-0 px-4">
                {cardData.buttonText}
              </button>
            </div>
            <img
              src={cardData.giftImage}
              width="100"
              alt="gift box"
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CongratulationsCard;
