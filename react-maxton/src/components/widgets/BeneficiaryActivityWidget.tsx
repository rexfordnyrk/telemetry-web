import React from "react";
import { Card, Dropdown, Table } from "react-bootstrap";

interface BeneficiaryActivity {
  participant: string;
  mostUsedApp: string;
  mostUsedAppScreentime: string;
  mostUsedAppIcon: string;
  mostVisitedApp: string;
  mostVisitedCount: string;
  mostVisitedAppIcon: string;
  dataUsageApp: string;
  dataUsageAmount: string;
  dataUsageAppIcon: string;
  lastSyncedDate: string;
  lastSyncedTime: string;
}

interface BeneficiaryActivityData {
  title: string;
  activities: BeneficiaryActivity[];
}

interface BeneficiaryActivityWidgetProps {
  data?: BeneficiaryActivityData;
  showDropdown?: boolean;
}

const defaultBeneficiaryData: BeneficiaryActivityData = {
  title: "Beneficiary Activity Overview",
  activities: [
    {
      participant: "Sarah Martinez",
      mostUsedApp: "WhatsApp",
      mostUsedAppScreentime: "4.2 hrs",
      mostUsedAppIcon: "/assets/images/apps/17.png",
      mostVisitedApp: "Instagram",
      mostVisitedCount: "156 visits",
      mostVisitedAppIcon: "/assets/images/apps/19.png",
      dataUsageApp: "YouTube",
      dataUsageAmount: "2.8 GB",
      dataUsageAppIcon: "/assets/images/apps/20.png",
      lastSyncedDate: "10 Jan, 2024",
      lastSyncedTime: "2:30 PM",
    },
    {
      participant: "Michael Johnson",
      mostUsedApp: "Facebook",
      mostUsedAppScreentime: "3.8 hrs",
      mostUsedAppIcon: "/assets/images/apps/03.png",
      mostVisitedApp: "WhatsApp",
      mostVisitedCount: "234 visits",
      mostVisitedAppIcon: "/assets/images/apps/17.png",
      dataUsageApp: "TikTok",
      dataUsageAmount: "3.2 GB",
      dataUsageAppIcon: "/assets/images/apps/twitter-circle.png",
      lastSyncedDate: "10 Jan, 2024",
      lastSyncedTime: "1:45 PM",
    },
    {
      participant: "Emily Davis",
      mostUsedApp: "Instagram",
      mostUsedAppScreentime: "5.1 hrs",
      mostUsedAppIcon: "/assets/images/apps/19.png",
      mostVisitedApp: "TikTok",
      mostVisitedCount: "89 visits",
      mostVisitedAppIcon: "/assets/images/apps/twitter-circle.png",
      dataUsageApp: "Instagram",
      dataUsageAmount: "4.5 GB",
      dataUsageAppIcon: "/assets/images/apps/19.png",
      lastSyncedDate: "10 Jan, 2024",
      lastSyncedTime: "12:15 PM",
    },
    {
      participant: "David Wilson",
      mostUsedApp: "YouTube",
      mostUsedAppScreentime: "6.3 hrs",
      mostUsedAppIcon: "/assets/images/apps/20.png",
      mostVisitedApp: "Facebook",
      mostVisitedCount: "67 visits",
      mostVisitedAppIcon: "/assets/images/apps/03.png",
      dataUsageApp: "YouTube",
      dataUsageAmount: "5.7 GB",
      dataUsageAppIcon: "/assets/images/apps/20.png",
      lastSyncedDate: "09 Jan, 2024",
      lastSyncedTime: "11:30 AM",
    },
    {
      participant: "Lisa Anderson",
      mostUsedApp: "TikTok",
      mostUsedAppScreentime: "3.9 hrs",
      mostUsedAppIcon: "/assets/images/apps/twitter-circle.png",
      mostVisitedApp: "YouTube",
      mostVisitedCount: "145 visits",
      mostVisitedAppIcon: "/assets/images/apps/20.png",
      dataUsageApp: "WhatsApp",
      dataUsageAmount: "1.2 GB",
      dataUsageAppIcon: "/assets/images/apps/17.png",
      lastSyncedDate: "09 Jan, 2024",
      lastSyncedTime: "9:45 AM",
    },
    {
      participant: "James Thompson",
      mostUsedApp: "WhatsApp",
      mostUsedAppScreentime: "4.7 hrs",
      mostUsedAppIcon: "/assets/images/apps/17.png",
      mostVisitedApp: "Instagram",
      mostVisitedCount: "198 visits",
      mostVisitedAppIcon: "/assets/images/apps/19.png",
      dataUsageApp: "Facebook",
      dataUsageAmount: "2.9 GB",
      dataUsageAppIcon: "/assets/images/apps/03.png",
      lastSyncedDate: "09 Jan, 2024",
      lastSyncedTime: "8:20 AM",
    },
  ],
};

const BeneficiaryActivityWidget: React.FC<BeneficiaryActivityWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const activityData = data || defaultBeneficiaryData;

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{activityData.title}</h5>
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
                <Dropdown.Item onClick={() => console.log('Export Data')}>Export Data</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('View Details')}>View Details</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Settings')}>Settings</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="table-responsive">
          <Table className="align-middle mb-0 table-striped">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Most Used App</th>
                <th>Most Visited</th>
                <th>Data Usage</th>
                <th>Last Synced</th>
              </tr>
            </thead>
            <tbody>
              {activityData.activities?.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <h6 className="mb-0">{activity.participant}</h6>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center flex-row gap-2">
                      <div>
                        <img
                          src={activity.mostUsedAppIcon || "/assets/images/apps/01.png"}
                          width="24"
                          alt={activity.mostUsedApp}
                        />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">{activity.mostUsedApp}</h6>
                        <p className="mb-0 small text-muted">{activity.mostUsedAppScreentime}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center flex-row gap-2">
                      <div>
                        <img
                          src={activity.mostVisitedAppIcon || "/assets/images/apps/01.png"}
                          width="24"
                          alt={activity.mostVisitedApp}
                        />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">{activity.mostVisitedApp}</h6>
                        <p className="mb-0 small text-muted">{activity.mostVisitedCount}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center flex-row gap-2">
                      <div>
                        <img
                          src={activity.dataUsageAppIcon || "/assets/images/apps/01.png"}
                          width="24"
                          alt={activity.dataUsageApp}
                        />
                      </div>
                      <div>
                        <h6 className="mb-0 fs-6">{activity.dataUsageApp}</h6>
                        <p className="mb-0 small text-muted">{activity.dataUsageAmount}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h6 className="mb-0 fs-6">{activity.lastSyncedDate}</h6>
                      <p className="mb-0 small text-muted">{activity.lastSyncedTime}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BeneficiaryActivityWidget;
