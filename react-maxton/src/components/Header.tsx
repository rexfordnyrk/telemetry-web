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
  const [searchActive, setSearchActive] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarToggled((prev: boolean) => !prev);
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
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

        <div className="search-bar flex-grow-1">
          <div className="position-relative">
            <input
              className="form-control rounded-5 px-5 search-control d-lg-block d-none"
              type="text"
              placeholder="Search"
              onClick={toggleSearch}
            />
            <span className="material-icons-outlined position-absolute d-lg-block d-none ms-3 translate-middle-y start-0 top-50">
              search
            </span>
            <span
              className="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50 search-close"
              onClick={toggleSearch}
              style={{ display: searchActive ? "block" : "none" }}
            >
              close
            </span>

            {searchActive && (
              <div className="search-popup p-3 d-block">
                <div className="card rounded-4 overflow-hidden">
                  <div className="card-header d-lg-none">
                    <div className="position-relative">
                      <input
                        className="form-control rounded-5 px-5 mobile-search-control"
                        type="text"
                        placeholder="Search"
                      />
                      <span className="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">
                        search
                      </span>
                      <span
                        className="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50 mobile-search-close"
                        onClick={toggleSearch}
                      >
                        close
                      </span>
                    </div>
                  </div>
                  <div className="card-body search-content">
                    <p className="search-title">Recent Searches</p>
                    <div className="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">
                      <a href="#" className="kewords">
                        <span>Angular Template</span>
                        <i className="material-icons-outlined fs-6">search</i>
                      </a>
                      <a href="#" className="kewords">
                        <span>Dashboard</span>
                        <i className="material-icons-outlined fs-6">search</i>
                      </a>
                      <a href="#" className="kewords">
                        <span>Admin Template</span>
                        <i className="material-icons-outlined fs-6">search</i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Nav className="gap-1 nav-right-links align-items-center">
          <Nav.Item className="d-lg-none mobile-search-btn">
            <Nav.Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleSearch();
              }}
            >
              <i className="material-icons-outlined">search</i>
            </Nav.Link>
          </Nav.Item>

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
            <Dropdown.Menu>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/01.png" width="20" alt="" />
                <span className="ms-2">English</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/02.png" width="20" alt="" />
                <span className="ms-2">Catalan</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/03.png" width="20" alt="" />
                <span className="ms-2">French</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/04.png" width="20" alt="" />
                <span className="ms-2">Belize</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/05.png" width="20" alt="" />
                <span className="ms-2">Colombia</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/06.png" width="20" alt="" />
                <span className="ms-2">Spanish</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/07.png" width="20" alt="" />
                <span className="ms-2">Georgian</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center py-2">
                <img src="/assets/images/county/08.png" width="20" alt="" />
                <span className="ms-2">Hindi</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Mega Menu */}
          <Dropdown as={Nav.Item} className="position-static d-md-flex d-none">
            <Dropdown.Toggle
              as={Nav.Link}
              className="dropdown-toggle-nocaret"
              data-bs-auto-close="outside"
              id="mega-menu-dropdown"
            >
              <i className="material-icons-outlined">done_all</i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mega-menu shadow-lg p-4 p-lg-5">
              <div className="mega-menu-widgets">
                <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 g-lg-5">
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <div className="mega-menu-icon flex-shrink-0 bg-danger">
                            <i className="material-icons-outlined">
                              question_answer
                            </i>
                          </div>
                          <div className="mega-menu-content">
                            <h5>Marketing</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/02.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Website</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/03.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Subscribers</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/01.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Hubspot</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/11.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Templates</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/13.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Ebooks</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/12.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Sales</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/08.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Tools</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card rounded-4 shadow-none border mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src="/assets/images/megaIcons/09.png"
                            width="40"
                            alt=""
                          />
                          <div className="mega-menu-content">
                            <h5>Academy</h5>
                            <p className="mb-0 f-14">
                              In publishing and graphic design, Lorem ipsum is a
                              placeholder text commonly used to demonstrate the
                              visual form of a document.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Apps Dropdown */}
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle
              as={Nav.Link}
              className="dropdown-toggle-nocaret"
              id="apps-dropdown"
            >
              <i className="material-icons-outlined">apps</i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-apps shadow-lg p-3">
              <div className="border rounded-4 overflow-hidden">
                <div className="row row-cols-3 g-0 border-bottom">
                  <div className="col border-end">
                    <div className="app-wrapper d-flex flex-column gap-2 text-center">
                      <div className="app-icon">
                        <img
                          src="/assets/images/apps/01.png"
                          width="36"
                          alt="Gmail"
                        />
                      </div>
                      <div className="app-name">
                        <p className="mb-0">Gmail</p>
                      </div>
                    </div>
                  </div>
                  <div className="col border-end">
                    <div className="app-wrapper d-flex flex-column gap-2 text-center">
                      <div className="app-icon">
                        <img
                          src="/assets/images/apps/02.png"
                          width="36"
                          alt="Skype"
                        />
                      </div>
                      <div className="app-name">
                        <p className="mb-0">Skype</p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="app-wrapper d-flex flex-column gap-2 text-center">
                      <div className="app-icon">
                        <img
                          src="/assets/images/apps/03.png"
                          width="36"
                          alt="Slack"
                        />
                      </div>
                      <div className="app-name">
                        <p className="mb-0">Slack</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>

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

          {/* Cart */}
          <Nav.Item className="d-md-flex d-none">
            <Nav.Link
              href="#"
              className="position-relative"
              onClick={(e) => {
                e.preventDefault();
                setShowCart(true);
              }}
            >
              <i className="material-icons-outlined">shopping_cart</i>
              <span className="badge-notify">8</span>
            </Nav.Link>
          </Nav.Item>

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
            <Dropdown.Menu className="dropdown-user shadow">
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
