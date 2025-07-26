import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface Vendor {
  name: string;
  sales: string;
  avatar: string;
  rating: number;
}

interface TopVendorsData {
  title: string;
  vendors: Vendor[];
}

interface TopVendorsWidgetProps {
  data?: TopVendorsData;
  showDropdown?: boolean;
}

const defaultTopVendorsData: TopVendorsData = {
  title: "Top Vendors",
  vendors: [
    {
      name: "Ajay Sidhu",
      sales: "Sale: 879",
      avatar: "/assets/images/avatars/01.png",
      rating: 5,
    },
    {
      name: "Ajay Sidhu",
      sales: "Sale: 879",
      avatar: "/assets/images/avatars/02.png",
      rating: 4,
    },
    {
      name: "Ajay Sidhu",
      sales: "Sale: 879",
      avatar: "/assets/images/avatars/03.png",
      rating: 3,
    },
    {
      name: "Ajay Sidhu",
      sales: "Sale: 879",
      avatar: "/assets/images/avatars/04.png",
      rating: 2,
    },
    {
      name: "Ajay Sidhu",
      sales: "Sale: 879",
      avatar: "/assets/images/avatars/08.png",
      rating: 1,
    },
  ],
};

const TopVendorsWidget: React.FC<TopVendorsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const vendorsData = data || defaultTopVendorsData;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`material-icons-outlined fs-5 ${
            i <= rating ? "text-warning" : ""
          }`}
        >
          star
        </span>
      );
    }
    return stars;
  };

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{vendorsData.title}</h5>
          </div>
          {showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
                as="a"
                href="javascript:;"
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="javascript:;">Action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Another action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="d-flex flex-column gap-4">
          {vendorsData.vendors.map((vendor, index) => (
            <div key={index} className="d-flex align-items-center gap-3">
              <img
                src={vendor.avatar}
                width="55"
                className="rounded-circle"
                alt={vendor.name}
              />
              <div className="flex-grow-1">
                <h6 className="mb-0">{vendor.name}</h6>
                <p className="mb-0">{vendor.sales}</p>
              </div>
              <div className="ratings">
                {renderStars(vendor.rating)}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TopVendorsWidget;
