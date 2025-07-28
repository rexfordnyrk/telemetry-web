import React, { useState } from "react";
import { Dropdown, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { useLayout } from "../context/LayoutContext";
import { User, Notification } from "../types";

interface HeaderProps {
  user?: User;
  notifications?: Notification[];
}

const Header: React.FC<HeaderProps> = ({
  user = {
    id: "1",
    name: "Jhon Anderson",
    email: "jhon@example.com",
    avatar: "/assets/images/avatars/01.png",
    role: "Admin",
  },
  notifications = [],
}) => {
  const { setSidebarToggled } = useLayout();
  const [showCart, setShowCart] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarToggled((prev: boolean) => !prev);
  };

  return (
    <header className="top-header">
      <Navbar className="navbar-expand align-items-center gap-4">
        <div className="btn-toggle">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleToggleSidebar();
            }}
          >
            <i className="material-icons-outlined">menu</i>
          </a>
        </div>

        {/* Removed search bar */}
        <div className="flex-grow-1"></div>

        <Nav className="gap-1 nav-right-links align-items-center">
          {/* Removed mobile search button */}

          {/* Language Dropdown */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle
              as={Nav.Link}
              className="dropdown-toggle-nocaret"
              id="language-dropdown"
            >
              <img
                src="/assets/images/county/02.png"
                width="22"
                alt="Language"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/01.png" width="20" alt="" />
                <span className="ms-2">English</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/03.png" width="20" alt="" />
                <span className="ms-2">French</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Removed Mega Menu and Apps Dropdown */}

          {/* Notifications Dropdown */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle
              as={Nav.Link}
              className="dropdown-toggle-nocaret position-relative"
              data-bs-auto-close="outside"
              id="notifications-dropdown"
            >
              <i className="material-icons-outlined">notifications</i>
              <span className="badge-notify">5</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-notify shadow">
              <div className="px-3 py-1 d-flex align-items-center justify-content-between border-bottom">
                <h5 className="notiy-title mb-0">Notifications</h5>
                <Dropdown className="dropdown">
                  <Dropdown.Toggle
                    className="btn btn-secondary dropdown-toggle dropdown-toggle-nocaret option"
                    variant="secondary"
                  >
                    <span className="material-icons-outlined">more_vert</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-option shadow">
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                      <i className="material-icons-outlined fs-6">
                        inventory_2
                      </i>
                      Archive All
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                      <i className="material-icons-outlined fs-6">done_all</i>
                      Mark all as read
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                      <i className="material-icons-outlined fs-6">mic_off</i>
                      Disable Notifications
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                      <i className="material-icons-outlined fs-6">grade</i>
                      What's new ?
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                      <i className="material-icons-outlined fs-6">
                        leaderboard
                      </i>
                      Reports
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="notify-list">
                <Dropdown.Item className="border-bottom py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <img
                        src="/assets/images/avatars/01.png"
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="notify-title">Congratulations Jhon</h5>
                      <p className="mb-0 notify-desc">
                        Many congtars jhon. You have won the gifts.
                      </p>
                      <p className="mb-0 notify-time">Today</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="border-bottom py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="user-wrapper bg-primary text-primary bg-opacity-10">
                      <span>RS</span>
                    </div>
                    <div>
                      <h5 className="notify-title">New Account Created</h5>
                      <p className="mb-0 notify-desc">
                        From USA an user has registered.
                      </p>
                      <p className="mb-0 notify-time">Yesterday</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="border-bottom py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <img
                        src="/assets/images/apps/13.png"
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="notify-title">Payment Recived</h5>
                      <p className="mb-0 notify-desc">
                        New payment recived successfully
                      </p>
                      <p className="mb-0 notify-time">1d ago</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="border-bottom py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <img
                        src="/assets/images/apps/14.png"
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="notify-title">New Order Recived</h5>
                      <p className="mb-0 notify-desc">
                        Recived new order from michle
                      </p>
                      <p className="mb-0 notify-time">2:15 AM</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="border-bottom py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <img
                        src="/assets/images/avatars/06.png"
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="notify-title">Congratulations Jhon</h5>
                      <p className="mb-0 notify-desc">
                        Many congtars jhon. You have won the gifts.
                      </p>
                      <p className="mb-0 notify-time">Today</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item className="py-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="user-wrapper bg-danger text-danger bg-opacity-10">
                      <span>PK</span>
                    </div>
                    <div>
                      <h5 className="notify-title">New Account Created</h5>
                      <p className="mb-0 notify-desc">
                        From USA an user has registered.
                      </p>
                      <p className="mb-0 notify-time">Yesterday</p>
                    </div>
                    <div className="notify-close position-absolute end-0 me-3">
                      <i className="material-icons-outlined fs-6">close</i>
                    </div>
                  </div>
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Removed Cart */}

          {/* User Profile */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle
              as={Nav.Link}
              className="dropdown-toggle-nocaret"
              id="user-dropdown"
            >
              <img
                src={user.avatar}
                className="rounded-circle p-1 border"
                width="45"
                height="45"
                alt="User"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-user shadow dropdown-menu-end">
              <Dropdown.Item className="gap-2 py-2">
                <div className="text-center">
                  <img
                    src={user.avatar}
                    className="rounded-circle p-1 shadow mb-3"
                    width="90"
                    height="90"
                    alt=""
                  />
                  <h5 className="user-name mb-0 fw-bold">Hello, {user.name}</h5>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">person_outline</i>Profile
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">local_bar</i>Setting
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">dashboard</i>Dashboard
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">account_balance</i>
                Earning
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">cloud_download</i>
                Downloads
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                <i className="material-icons-outlined">power_settings_new</i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      {/* Cart Offcanvas */}
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
      >
        <Offcanvas.Header className="border-bottom h-70">
          <Offcanvas.Title id="offcanvasRightLabel">
            8 New Orders
          </Offcanvas.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowCart(false)}
          ></button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="order-list">
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/01.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">White Men Shoes</h5>
                <p className="mb-0 order-price">$289</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/02.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Red Airpods</h5>
                <p className="mb-0 order-price">$149</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/03.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Men Polo Tshirt</h5>
                <p className="mb-0 order-price">$139</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/04.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Blue Jeans Casual</h5>
                <p className="mb-0 order-price">$485</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/05.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Fancy Shirts</h5>
                <p className="mb-0 order-price">$758</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/06.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Home Sofa Set</h5>
                <p className="mb-0 order-price">$546</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/07.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Black iPhone</h5>
                <p className="mb-0 order-price">$1049</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
            <div className="order-item d-flex align-items-center gap-3 p-3 border-bottom">
              <div className="order-img">
                <img
                  src="/assets/images/orders/08.png"
                  className="img-fluid rounded-3"
                  width="75"
                  alt=""
                />
              </div>
              <div className="order-info flex-grow-1">
                <h5 className="mb-1 order-title">Goldan Watch</h5>
                <p className="mb-0 order-price">$689</p>
              </div>
              <div className="d-flex">
                <a className="order-delete">
                  <span className="material-icons-outlined">delete</span>
                </a>
                <a className="order-delete">
                  <span className="material-icons-outlined">visibility</span>
                </a>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
        <div className="offcanvas-footer h-70 p-3 border-top">
          <div className="d-grid">
            <button
              type="button"
              className="btn btn-grd btn-grd-primary"
              onClick={() => setShowCart(false)}
            >
              View Products
            </button>
          </div>
        </div>
      </Offcanvas>
    </header>
  );
};

export default Header;
