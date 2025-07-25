import React from "react";
import { Card, Dropdown, Table } from "react-bootstrap";

interface RecentOrder {
  id: number;
  product: string;
  image: string;
  amount: string;
  vendor: string;
  status: string;
  statusClass: string;
  rating: number;
}

interface RecentOrdersData {
  title: string;
  orders: RecentOrder[];
}

interface RecentOrdersWidgetProps {
  data?: RecentOrdersData;
  showDropdown?: boolean;
  showSearch?: boolean;
}

const defaultRecentOrdersData: RecentOrdersData = {
  title: "Recent Orders",
  orders: [
    {
      id: 1,
      product: "Sports Shoes",
      image: "/assets/images/top-products/01.png",
      amount: "$149",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 5.0,
    },
    {
      id: 2,
      product: "Golden Watch",
      image: "/assets/images/top-products/02.png",
      amount: "$168",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 5.0,
    },
    {
      id: 3,
      product: "Men Polo Tshirt",
      image: "/assets/images/top-products/03.png",
      amount: "$124",
      vendor: "Julia Sunota",
      status: "Pending",
      statusClass: "bg-warning",
      rating: 4.0,
    },
    {
      id: 4,
      product: "Blue Jeans Casual",
      image: "/assets/images/top-products/04.png",
      amount: "$289",
      vendor: "Julia Sunota",
      status: "Completed",
      statusClass: "bg-success",
      rating: 3.0,
    },
    {
      id: 5,
      product: "Fancy Shirts",
      image: "/assets/images/top-products/06.png",
      amount: "$389",
      vendor: "Julia Sunota",
      status: "Canceled",
      statusClass: "bg-danger",
      rating: 2.0,
    },
  ],
};

const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({
  data,
  showDropdown = true,
  showSearch = true,
}) => {
  const ordersData = data || defaultRecentOrdersData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{ordersData.title}</h5>
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
        {showSearch && (
          <div className="order-search position-relative my-3">
            <input
              className="form-control rounded-5 px-5"
              type="text"
              placeholder="Search"
            />
            <span className="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">
              search
            </span>
          </div>
        )}
        <div className="table-responsive">
          <Table className="table align-middle">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Amount</th>
                <th>Vendor</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <img
                          src={order.image}
                          className="rounded-circle"
                          width="50"
                          height="50"
                          alt={order.product}
                        />
                      </div>
                      <p className="mb-0">{order.product}</p>
                    </div>
                  </td>
                  <td>{order.amount}</td>
                  <td>{order.vendor}</td>
                  <td>
                    <p
                      className={`dash-lable mb-0 ${order.statusClass} bg-opacity-10 text-${order.statusClass.replace("bg-", "")} rounded-2`}
                    >
                      {order.status}
                    </p>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <p className="mb-0">{order.rating}</p>
                      <i className="material-icons-outlined text-warning fs-6">
                        star
                      </i>
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

export default RecentOrdersWidget;
