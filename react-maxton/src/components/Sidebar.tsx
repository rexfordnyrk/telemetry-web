import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { useLayout } from "../context/LayoutContext";
import { NavigationItem } from "../types";
import { navigationData } from "../utils/navigationData";
import { usePermissions } from "../hooks/usePermissions";
import LogoutButton from "./LogoutButton";

// Declare global libraries
declare const $: any;

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
}

/**
 * Check if user has permission to see this navigation item
 * 
 * @param item - Navigation item to check
 * @param permissions - User permissions hook
 * @returns True if user has permission to see this item
 */
const hasPermissionToSeeItem = (
  item: NavigationItem,
  permissions: ReturnType<typeof usePermissions>
): boolean => {
  // If no permission requirements, show the item
  if (!item.requiredPermissions && 
      !item.requiredAllPermissions && 
      !item.requiredRoles && 
      !item.requiredAllRoles) {
    return true;
  }

  // Check permissions
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    if (!permissions.hasAnyPermission(item.requiredPermissions)) {
      return false;
    }
  }

  if (item.requiredAllPermissions && item.requiredAllPermissions.length > 0) {
    if (!permissions.hasAllPermissions(item.requiredAllPermissions)) {
      return false;
    }
  }

  // Check roles
  if (item.requiredRoles && item.requiredRoles.length > 0) {
    if (!permissions.hasAnyRole(item.requiredRoles)) {
      return false;
    }
  }

  if (item.requiredAllRoles && item.requiredAllRoles.length > 0) {
    if (!permissions.hasAllRoles(item.requiredAllRoles)) {
      return false;
    }
  }

  return true;
};

/**
 * Filter navigation items based on user permissions
 * 
 * @param items - Array of navigation items to filter
 * @param permissions - User permissions hook
 * @returns Filtered array of navigation items
 */
const filterNavigationItems = (
  items: NavigationItem[],
  permissions: ReturnType<typeof usePermissions>
): NavigationItem[] => {
  return items
    .map(item => {
      // Check if this item should be visible
      if (!hasPermissionToSeeItem(item, permissions)) {
        return null;
      }

      // If item has children, filter them too
      if (item.children) {
        const filteredChildren = filterNavigationItems(item.children, permissions);
        
        // If no children are visible, don't show the parent
        if (filteredChildren.length === 0) {
          return null;
        }

        return {
          ...item,
          children: filteredChildren
        };
      }

      return item;
    })
    .filter((item): item is NavigationItem => item !== null);
};

/**
 * Wrapper component that handles permission checking
 * This ensures hooks are always called in the same order
 */
const SidebarItemWrapper: React.FC<SidebarItemProps> = ({ item, level = 0 }) => {
  const permissions = usePermissions();
  
  // Check if user has permission to see this item
  const hasPermission = hasPermissionToSeeItem(item, permissions);
  
  // If no permission, return null
  if (!hasPermission) {
    return null;
  }
  
  // If user has permission, render the actual sidebar item
  return <SidebarItemContent item={item} level={level} />;
};

/**
 * The actual sidebar item content component
 * This component contains all the hooks and logic
 */
const SidebarItemContent: React.FC<SidebarItemProps> = ({ item, level = 0 }) => {
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
    if (level === 0) {
      // Top level item with children
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
                <SidebarItemContent key={child.id} item={child} level={level + 1} />
              ))}
            </ul>
          </Collapse>
        </li>
      );
    } else {
      // Submenu item with children
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
            <i className="material-icons-outlined">{item.icon}</i>
            {item.title}
          </a>
          <Collapse in={isOpen}>
            <ul className={`mm-collapse ${isOpen ? "mm-show" : ""}`}>
              {item.children.map((child) => (
                <SidebarItemContent key={child.id} item={child} level={level + 1} />
              ))}
            </ul>
          </Collapse>
        </li>
      );
    }
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
  const metismenuRef = useRef<HTMLUListElement>(null);
  const permissions = usePermissions();

  // Filter navigation data based on user permissions
  const filteredNavigationData = filterNavigationItems(navigationData, permissions);

  const handleSidebarClose = () => {
    setSidebarToggled(false);
  };

  useEffect(() => {
    // Capture the current ref value
    const currentRef = metismenuRef.current;

    // Initialize MetisMenu when component mounts
    if (typeof $ !== "undefined" && $.fn.metisMenu && currentRef) {
      try {
        $(currentRef).metisMenu();
      } catch (error) {
        console.warn("MetisMenu initialization failed:", error);
      }
    }

    // Don't initialize PerfectScrollbar in React - let the main.js handle it
    // This prevents cleanup issues during unmounting

    // Cleanup function - minimal cleanup to avoid errors
    return () => {
      // Use the captured ref value for cleanup
      try {
        if (typeof $ !== "undefined" && currentRef) {
          $(currentRef).off();
        }
      } catch (error) {
        // Silently ignore cleanup errors
      }
    };
  }, []);

  return (
    <aside className="sidebar-wrapper">
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
        <ul className="metismenu" id="sidenav" ref={metismenuRef}>
          {filteredNavigationData.map((item) => (
            <SidebarItemWrapper key={item.id} item={item} />
          ))}
        </ul>
        
        {/* Logout Button at the bottom of sidebar */}
        <div className="sidebar-footer" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid var(--bs-border-color)',
        }}>
          <LogoutButton className="btn btn-grd btn-grd-danger w-100">
            <i className="material-icons-outlined me-2">logout</i>
            Logout
          </LogoutButton>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
