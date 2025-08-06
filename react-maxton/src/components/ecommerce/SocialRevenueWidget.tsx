import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface SocialPlatform {
  name: string;
  category: string;
  icon: string;
  revenue: string;
  change: string;
  changeDirection: "up" | "down";
}

interface SocialRevenueData {
  title: string;
  totalRevenue: string;
  totalChange: string;
  totalChangeDirection: "up" | "down";
  subtitle: string;
  platforms: SocialPlatform[];
}

interface SocialRevenueWidgetProps {
  data?: SocialRevenueData;
  showDropdown?: boolean;
}

const defaultSocialRevenueData: SocialRevenueData = {
  title: "Social Revenue",
  totalRevenue: "48,569",
  totalChange: "27%",
  totalChangeDirection: "up",
  subtitle: "Last 1 Year Income",
  platforms: [
    {
      name: "Facebook",
      category: "Social Media",
      icon: "/assets/images/apps/17.png",
      revenue: "45,689",
      change: "+28.5%",
      changeDirection: "up",
    },
    {
      name: "Twitter",
      category: "Social Media",
      icon: "/assets/images/apps/twitter-circle.png",
      revenue: "34,248",
      change: "-14.5%",
      changeDirection: "down",
    },
    {
      name: "Tik Tok",
      category: "Entertainment",
      icon: "/assets/images/apps/03.png",
      revenue: "45,689",
      change: "+28.5%",
      changeDirection: "up",
    },
    {
      name: "Instagram",
      category: "Social Media",
      icon: "/assets/images/apps/19.png",
      revenue: "67,249",
      change: "-43.5%",
      changeDirection: "down",
    },
    {
      name: "Snapchat",
      category: "Conversation",
      icon: "/assets/images/apps/20.png",
      revenue: "89,178",
      change: "+24.7%",
      changeDirection: "up",
    },
  ],
};

const SocialRevenueWidget: React.FC<SocialRevenueWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const revenueData = data || defaultSocialRevenueData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{revenueData.title}</h5>
          </div>
          {showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
                as="button"
                style={{ border: "none", background: "none" }}
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('Action')}>Action</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Another action')}>Another action</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Something else here')}>Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="mb-4">
          <div className="d-flex align-items-center gap-3">
            <h3 className="mb-0">{revenueData.totalRevenue}</h3>
            <p className={`mb-0 gap-3 ${revenueData.totalChangeDirection === "up" ? "text-success" : "text-danger"}`}>
              {revenueData.totalChange}
              <span className="material-icons-outlined fs-6">
                {revenueData.totalChangeDirection === "up" ? "arrow_upward" : "arrow_downward"}
              </span>
            </p>
          </div>
          <p className="mb-0 font-13">{revenueData.subtitle}</p>
        </div>
        <div className="table-responsive">
          <div className="d-flex flex-column gap-4">
            {revenueData.platforms?.map((platform, index) => (
              <div key={index} className="d-flex align-items-center gap-3">
                <div className="social-icon d-flex align-items-center gap-3 flex-grow-1">
                  <img
                    src={platform.icon || "/assets/images/apps/01.png"}
                    width="40"
                    alt={platform.name}
                  />
                  <div>
                    <h6 className="mb-0">{platform.name}</h6>
                    <p className="mb-0">{platform.category}</p>
                  </div>
                </div>
                <h5 className="mb-0">{platform.revenue}</h5>
                <div className={`card-lable ${platform.changeDirection === "up" ? "bg-success text-success" : "bg-danger text-danger"} bg-opacity-10`}>
                  <p className={`${platform.changeDirection === "up" ? "text-success" : "text-red"} mb-0`}>
                    {platform.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SocialRevenueWidget;
