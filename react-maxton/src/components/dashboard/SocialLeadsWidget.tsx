import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface SocialLead {
  name: string;
  icon: string;
  percentage: string;
  data: string;
  color: string;
}

interface SocialLeadsData {
  title: string;
  leads: SocialLead[];
}

interface SocialLeadsWidgetProps {
  data?: SocialLeadsData;
  showDropdown?: boolean;
}

const defaultSocialLeadsData: SocialLeadsData = {
  title: "Social Leads",
  leads: [
    {
      name: "Facebook",
      icon: "/assets/images/apps/17.png",
      percentage: "55%",
      data: "5/7",
      color: "#0d6efd",
    },
    {
      name: "LinkedIn",
      icon: "/assets/images/apps/18.png",
      percentage: "67%",
      data: "5/7",
      color: "#fc185a",
    },
    {
      name: "Instagram",
      icon: "/assets/images/apps/19.png",
      percentage: "78%",
      data: "5/7",
      color: "#02c27a",
    },
    {
      name: "Snapchat",
      icon: "/assets/images/apps/20.png",
      percentage: "46%",
      data: "5/7",
      color: "#fd7e14",
    },
    {
      name: "Google",
      icon: "/assets/images/apps/05.png",
      percentage: "38%",
      data: "5/7",
      color: "#0dcaf0",
    },
    {
      name: "Altaba",
      icon: "/assets/images/apps/08.png",
      percentage: "15%",
      data: "5/7",
      color: "#6f42c1",
    },
    {
      name: "Spotify",
      icon: "/assets/images/apps/07.png",
      percentage: "12%",
      data: "5/7",
      color: "#ff00b3",
    },
  ],
};

const SocialLeadsWidget: React.FC<SocialLeadsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const socialData = data || defaultSocialLeadsData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0 fw-bold">{socialData.title}</h5>
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
        <div className="d-flex flex-column justify-content-between gap-4">
          {socialData.leads.map((lead, index) => (
            <div key={index} className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                <img src={lead.icon} width="32" alt={lead.name} />
                <p className="mb-0">{lead.name}</p>
              </div>
              <div>
                <p className="mb-0 fs-6">{lead.percentage}</p>
              </div>
              <div>
                <div
                  className="circular-progress"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: `conic-gradient(${lead.color} 0deg ${
                      (parseInt(lead.percentage.replace("%", "")) / 100) * 360
                    }deg, rgba(255, 255, 255, 0.15) ${
                      (parseInt(lead.percentage.replace("%", "")) / 100) * 360
                    }deg 360deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "var(--bs-body-bg, #ffffff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: "600",
                      color: lead.color,
                    }}
                  >
                    {parseInt(lead.percentage.replace("%", ""))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SocialLeadsWidget;
