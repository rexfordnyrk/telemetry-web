import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface DataConsumerApp {
  name: string;
  category: string;
  icon: string;
  dataUsage: string;
  change: string;
  changeDirection: "up" | "down";
}

interface DataConsumerAppsData {
  title: string;
  totalDataUsage: string;
  totalChange: string;
  totalChangeDirection: "up" | "down";
  subtitle: string;
  apps: DataConsumerApp[];
}

interface DataConsumerAppsWidgetProps {
  data?: DataConsumerAppsData;
  showDropdown?: boolean;
}

const defaultDataConsumerData: DataConsumerAppsData = {
  title: "Top 5 Data Consumer Apps",
  totalDataUsage: "89.2 GB",
  totalChange: "+22%",
  totalChangeDirection: "up",
  subtitle: "total Data consumed this month",
  apps: [
    {
      name: "YouTube",
      category: "Entertainment",
      icon: "/assets/images/apps/20.png",
      dataUsage: "28.5 GB",
      change: "+31.2%",
      changeDirection: "up",
    },
    {
      name: "Instagram",
      category: "Social Media",
      icon: "/assets/images/apps/19.png",
      dataUsage: "22.1 GB",
      change: "+18.5%",
      changeDirection: "up",
    },
    {
      name: "TikTok",
      category: "Entertainment",
      icon: "/assets/images/apps/twitter-circle.png",
      dataUsage: "18.9 GB",
      change: "-5.2%",
      changeDirection: "down",
    },
    {
      name: "Facebook",
      category: "Social Media",
      icon: "/assets/images/apps/03.png",
      dataUsage: "12.4 GB",
      change: "+15.8%",
      changeDirection: "up",
    },
    {
      name: "Netflix",
      category: "Entertainment",
      icon: "/assets/images/apps/17.png",
      dataUsage: "7.3 GB",
      change: "+42.1%",
      changeDirection: "up",
    },
  ],
};

const DataConsumerAppsWidget: React.FC<DataConsumerAppsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const dataConsumerData = data || defaultDataConsumerData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{dataConsumerData.title}</h5>
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
            <h3 className="mb-0">{dataConsumerData.totalDataUsage}</h3>
            <p className={`mb-0 gap-3 ${dataConsumerData.totalChangeDirection === "up" ? "text-success" : "text-danger"}`}>
              {dataConsumerData.totalChange}
              <span className="material-icons-outlined fs-6">
                {dataConsumerData.totalChangeDirection === "up" ? "arrow_upward" : "arrow_downward"}
              </span>
            </p>
          </div>
          <p className="mb-0 font-13">{dataConsumerData.subtitle}</p>
        </div>
        <div className="table-responsive">
          <div className="d-flex flex-column gap-4">
            {dataConsumerData.apps?.map((app, index) => (
              <div key={index} className="d-flex align-items-center gap-3">
                <div className="social-icon d-flex align-items-center gap-3 flex-grow-1">
                  <img
                    src={app.icon || "/assets/images/apps/01.png"}
                    width="40"
                    alt={app.name}
                  />
                  <div>
                    <h6 className="mb-0">{app.name}</h6>
                    <p className="mb-0">{app.category}</p>
                  </div>
                </div>
                <h5 className="mb-0">{app.dataUsage}</h5>
                <div className={`card-lable ${app.changeDirection === "up" ? "bg-success text-success" : "bg-danger text-danger"} bg-opacity-10`}>
                  <p className={`${app.changeDirection === "up" ? "text-success" : "text-red"} mb-0`}>
                    {app.change}
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

export default DataConsumerAppsWidget;
