import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { useLayout } from "../context/LayoutContext";
import { NavigationItem } from "../types";
import { navigationData } from "../utils/navigationData";

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Check if current item or any child is active
  const isActiveRoute = (item: NavigationItem): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => isActiveRoute(child));
    }
    return false;
  };

  const isActive = isActiveRoute(item);

  useEffect(() => {
    if (isActive && item.children) {
      setIsOpen(true);
    }
  }, [isActive, item.children]);

  // Render menu label (category separator)
  if (!item.icon && item.children?.length === 0) {
    return <li className="menu-label">{item.title}</li>;
  }

  // Render item with children (submenu)
  if (item.children && item.children.length > 0) {
    return (
      <li className={isActive ? "mm-active" : ""}>
        <a
          href="javascript:;"
          className={`has-arrow ${isActive ? "mm-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
        >
          <div className="parent-icon">
            <i className="material-icons-outlined">{item.icon}</i>
          </div>
          <div className="menu-title">{item.title}</div>
        </a>
        <Collapse in={isOpen}>
          <ul className={`mm-collapse ${isOpen ? "mm-show" : ""}`}>
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </ul>
        </Collapse>
      </li>
    );
  }

  // Render single item (leaf node)
  if (item.path) {
    if (level === 0) {
      // Top level item
      return (
        <li className={location.pathname === item.path ? "mm-active" : ""}>
          <NavLink
            to={item.path}
            className={({ isActive }) => (isActive ? "mm-active" : "")}
          >
            <div className="parent-icon">
              <i className="material-icons-outlined">{item.icon}</i>
            </div>
            <div className="menu-title">{item.title}</div>
          </NavLink>
        </li>
      );
    } else {
      // Submenu item
      return (
        <li className={location.pathname === item.path ? "mm-active" : ""}>
          <NavLink
            to={item.path}
            className={({ isActive }) => (isActive ? "mm-active" : "")}
          >
            <i className="material-icons-outlined">{item.icon}</i>
            {item.title}
          </NavLink>
        </li>
      );
    }
  }

  // Render item without path (not clickable)
  if (level === 0) {
    // Top level item
    return (
      <li>
        <a href="javascript:;" onClick={(e) => e.preventDefault()}>
          <div className="parent-icon">
            <i className="material-icons-outlined">{item.icon}</i>
          </div>
          <div className="menu-title">{item.title}</div>
        </a>
      </li>
    );
  } else {
    // Submenu item
    return (
      <li>
        <a href="javascript:;" onClick={(e) => e.preventDefault()}>
          <i className="material-icons-outlined">{item.icon}</i>
          {item.title}
        </a>
      </li>
    );
  }
};

const Sidebar: React.FC = () => {
  const { setSidebarToggled } = useLayout();

  const handleSidebarClose = () => {
    setSidebarToggled(false);
  };

  return (
    <aside className="sidebar-wrapper" data-simplebar="true">
      <div className="sidebar-header">
        <div className="logo-icon">
          <img src="assets/images/logo-icon.png" className="logo-img" alt="" />
        </div>
        <div className="logo-name flex-grow-1">
          <h5 className="mb-0">Maxton</h5>
        </div>
        <div className="sidebar-close" onClick={handleSidebarClose}>
          <span className="material-icons-outlined">close</span>
        </div>
      </div>

      <div className="sidebar-nav">
        <ul className="metismenu" id="sidenav">
          {navigationData.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
