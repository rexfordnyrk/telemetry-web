import React from "react";
import { Card, Row, Col } from "react-bootstrap";

interface WelcomeData {
  userName: string;
  userAvatar: string;
  todaysSales: string;
  growthRate: string;
  salesProgress: number;
  growthProgress: number;
  welcomeImage: string;
}

interface WelcomeCardProps {
  data?: WelcomeData;
}

interface ConfigurableWelcomeCardProps {
  userName: string;
  userAvatar?: string;
  userInitials?: string;
  primaryValue: string;
  secondaryValue: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryProgress: number;
  secondaryProgress: number;
  showWelcomeImage?: boolean;
  welcomeImage?: string;
}

const defaultWelcomeData: WelcomeData = {
  userName: "Jhon Anderson",
  userAvatar: "/assets/images/avatars/01.png",
  todaysSales: "$65.4K",
  growthRate: "78.4%",
  salesProgress: 60,
  growthProgress: 60,
  welcomeImage: "/assets/images/gallery/welcome-back-3.png",
};

const WelcomeCard: React.FC<WelcomeCardProps> = ({ data }) => {
  const welcomeData = data || defaultWelcomeData;

  return (
    <Card className="w-100 overflow-hidden rounded-4">
      <Card.Body className="position-relative p-4">
        <Row>
          <Col xs={12} sm={7}>
            <div className="d-flex align-items-center gap-3 mb-5">
              <img
                src={welcomeData.userAvatar}
                className="rounded-circle bg-grd-info p-1"
                width="60"
                height="60"
                alt="user"
              />
              <div>
                <p className="mb-0 fw-semibold">Welcome back</p>
                <h4 className="fw-semibold mb-0 fs-4">{welcomeData.userName}!</h4>
              </div>
            </div>
            <div className="d-flex align-items-center gap-5">
              <div>
                <h4 className="mb-1 fw-semibold d-flex align-content-center">
                  {welcomeData.todaysSales}
                  <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                </h4>
                <p className="mb-3">Today's Sales</p>
                <div className="progress mb-0" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-grd-success"
                    role="progressbar"
                    style={{ width: `${welcomeData.salesProgress}%` }}
                    aria-valuenow={welcomeData.salesProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              <div className="vr"></div>
              <div>
                <h4 className="mb-1 fw-semibold d-flex align-content-center">
                  {welcomeData.growthRate}
                  <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                </h4>
                <p className="mb-3">Growth Rate</p>
                <div className="progress mb-0" style={{ height: "5px" }}>
                  <div
                    className="progress-bar bg-grd-danger"
                    role="progressbar"
                    style={{ width: `${welcomeData.growthProgress}%` }}
                    aria-valuenow={welcomeData.growthProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={5}>
            <div className="welcome-back-img pt-4">
              <img
                src={welcomeData.welcomeImage}
                height="180"
                alt="Welcome back"
              />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export const ConfigurableWelcomeCard: React.FC<ConfigurableWelcomeCardProps> = ({
  userName,
  userAvatar,
  userInitials = "U",
  primaryValue,
  secondaryValue,
  primaryLabel,
  secondaryLabel,
  primaryProgress,
  secondaryProgress,
  showWelcomeImage = true,
  welcomeImage = "/assets/images/gallery/welcome-back-3.png"
}) => {
  return (
    <Card className="w-100 overflow-hidden rounded-4">
        <Card.Body className="position-relative p-4">
          <Row>
            <Col xs={12} sm={showWelcomeImage ? 7 : 12}>
              <div className="d-flex align-items-center gap-3 mb-5">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    className="rounded-circle bg-grd-info p-1"
                    width="60"
                    height="60"
                    alt="user"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', fontSize: '22px', fontWeight: 'bold', aspectRatio: '1' }}>
                    {userInitials}
                  </div>
                )}
                <div>
                  <p className="mb-0 fw-semibold">Welcome back</p>
                  <h4 className="fw-semibold mb-0 fs-4">{userName}!</h4>
                </div>
              </div>
              <div className="d-flex align-items-center gap-5">
                <div>
                  <h4 className="mb-1 fw-semibold d-flex align-content-center">
                    {primaryValue}
                    <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                  </h4>
                  <p className="mb-3">{primaryLabel}</p>
                  <div className="progress mb-0" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-grd-success"
                      role="progressbar"
                      style={{ width: `${primaryProgress}%` }}
                      aria-valuenow={primaryProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
                <div className="vr"></div>
                <div>
                  <h4 className="mb-1 fw-semibold d-flex align-content-center">
                    {secondaryValue}
                    <i className="ti ti-arrow-up-right fs-5 lh-base text-success"></i>
                  </h4>
                  <p className="mb-3">{secondaryLabel}</p>
                  <div className="progress mb-0" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-grd-danger"
                      role="progressbar"
                      style={{ width: `${secondaryProgress}%` }}
                      aria-valuenow={secondaryProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
            </Col>
            {showWelcomeImage && (
              <Col xs={12} sm={5}>
                <div className="welcome-back-img pt-4">
                  <img
                    src={welcomeImage}
                    height="180"
                    alt="Welcome back"
                  />
                </div>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
  );
};

export default WelcomeCard;
