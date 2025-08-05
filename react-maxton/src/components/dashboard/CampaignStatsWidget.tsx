import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface CampaignStat {
  title: string;
  value: string;
  percentage: string;
  icon: string;
  bgClass: string;
  textClass: string;
}

interface CampaignStatsData {
  title: string;
  stats: CampaignStat[];
}

interface CampaignStatsWidgetProps {
  data?: CampaignStatsData;
  showDropdown?: boolean;
}

const defaultCampaignStatsData: CampaignStatsData = {
  title: "Campaign Stats",
  stats: [
    {
      title: "Campaigns",
      value: "54",
      percentage: "28%",
      icon: "calendar_today",
      bgClass: "bg-grd-primary",
      textClass: "text-success",
    },
    {
      title: "Emailed",
      value: "245",
      percentage: "15%",
      icon: "email",
      bgClass: "bg-grd-success",
      textClass: "text-danger",
    },
    {
      title: "Opened",
      value: "54",
      percentage: "30.5%",
      icon: "open_in_new",
      bgClass: "bg-grd-branding",
      textClass: "text-success",
    },
    {
      title: "Clicked",
      value: "859",
      percentage: "34.6%",
      icon: "ads_click",
      bgClass: "bg-grd-warning",
      textClass: "text-danger",
    },
    {
      title: "Subscribed",
      value: "24,758",
      percentage: "53%",
      icon: "subscriptions",
      bgClass: "bg-grd-info",
      textClass: "text-success",
    },
    {
      title: "Spam Message",
      value: "548",
      percentage: "47%",
      icon: "inbox",
      bgClass: "bg-grd-danger",
      textClass: "text-danger",
    },
    {
      title: "Views Mails",
      value: "9845",
      percentage: "68%",
      icon: "visibility",
      bgClass: "bg-grd-deep-blue",
      textClass: "text-success",
    },
  ],
};

const CampaignStatsWidget: React.FC<CampaignStatsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const campaignData = data || defaultCampaignStatsData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h6 className="mb-0 fw-bold">{campaignData.title}</h6>
          </div>
          {showDropdown && (
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
        <ul className="list-group list-group-flush">
          {campaignData.stats?.map((stat, index) => (
            <li
              key={index}
              className="list-group-item px-0 bg-transparent"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`wh-42 d-flex align-items-center justify-content-center rounded-3 ${stat.bgClass}`}
                >
                  <span className="material-icons-outlined text-white">
                    {stat.icon}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{stat.title}</h6>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <p className="mb-0">{stat.value}</p>
                  <p className={`mb-0 fw-bold ${stat.textClass}`}>
                    {stat.percentage}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default CampaignStatsWidget;
