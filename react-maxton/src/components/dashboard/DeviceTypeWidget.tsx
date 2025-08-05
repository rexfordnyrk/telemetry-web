import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import SafeApexChart from "../SafeApexChart";

interface DeviceTypeData {
  title: string;
  centerTitle: string;
  centerValue: string;
  series: number[];
  labels: string[];
  colors: string[];
  gradientColors: string[];
  devices: {
    name: string;
    icon: string;
    percentage: string;
    iconColor: string;
  }[];
}

interface DeviceTypeWidgetProps {
  data?: DeviceTypeData;
  showDropdown?: boolean;
}

const defaultDeviceTypeData: DeviceTypeData = {
  title: "Device Type",
  centerTitle: "Total Views",
  centerValue: "68%",
  series: [58, 25, 25],
  labels: ["Desktop", "Tablet", "Mobile"],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  devices: [
    {
      name: "Desktop",
      icon: "desktop_windows",
      percentage: "35%",
      iconColor: "text-primary",
    },
    {
      name: "Tablet",
      icon: "tablet_mac",
      percentage: "48%",
      iconColor: "text-danger",
    },
    {
      name: "Mobile",
      icon: "phone_android",
      percentage: "27%",
      iconColor: "text-success",
    },
  ],
};

const DeviceTypeWidget: React.FC<DeviceTypeWidgetProps> = ({ 
  data, 
  showDropdown = true 
}) => {
  const deviceData = data || defaultDeviceTypeData;

  const chartOptions = {
    series: deviceData.series,
    chart: {
      height: 290,
      type: "donut" as const,
    },
    legend: {
      position: "bottom" as const,
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: deviceData.gradientColors,
        shadeIntensity: 1,
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    colors: deviceData.colors,
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "85%",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 270,
          },
          legend: {
            position: "bottom" as const,
            show: false,
          },
        },
      },
    ],
  };

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h5 className="mb-0">{deviceData.title}</h5>
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
          <div className="position-relative">
            <div className="piechart-legend">
              <h2 className="mb-1">{deviceData.centerValue}</h2>
              <h6 className="mb-0">{deviceData.centerTitle}</h6>
            </div>
            <SafeApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="donut"
              height={290}
            />
          </div>
          <div className="d-flex flex-column gap-3">
            {deviceData.devices?.map((device, index) => (
              <div key={index} className="d-flex align-items-center justify-content-between">
                <p className="mb-0 d-flex align-items-center gap-2 w-25">
                  <span className={`material-icons-outlined fs-6 ${device.iconColor}`}>
                    {device.icon}
                  </span>
                  {device.name}
                </p>
                <div>
                  <p className="mb-0">{device.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DeviceTypeWidget;
