import { NavigationItem } from "../types";

export const navigationData: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "home",
    children: [
      {
        id: "dashboard-overview",
        title: "Overview",
        path: "/dashboard",
        icon: "arrow_right",
      },
      {
        id: "dashboard-analysis",
        title: "Analysis",
        path: "/dashboard/analysis",
        icon: "arrow_right",
        devOnly: true, // Only show in development mode
      },
      {
        id: "dashboard-ecommerce",
        title: "eCommerce",
        path: "/dashboard/ecommerce",
        icon: "arrow_right",
        devOnly: true, // Only show in development mode
      },
    ],
  },
  {
    id: "widgets",
    title: "Widgets",
    icon: "widgets",
    devOnly: true, // Only show in development mode
    children: [
      {
        id: "widgets-data",
        title: "Data",
        path: "/widgets/data",
        icon: "arrow_right",
      },
      {
        id: "widgets-data-components",
        title: "Data Components",
        path: "/widgets/data-components",
        icon: "arrow_right",
      },
      {
        id: "widgets-main-components",
        title: "Main Components",
        path: "/widgets/main-components",
        icon: "arrow_right",
      },
      {
        id: "widgets-ecommerce-components",
        title: "eCommerce Components",
        path: "/widgets/ecommerce-components",
        icon: "arrow_right",
      },
    ],
  },

  {
    id: "user-management-label",
    title: "User Management",
    icon: undefined,
    children: [],
  },
  {
    id: "user-management",
    title: "User Management",
    icon: "people",
    children: [
      {
        id: "users",
        title: "Users",
        path: "/user-management/users",
        icon: "arrow_right",
        requiredPermissions: ["list_users"], // Require list_users permission to see this menu item
      },
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        path: "/user-management/roles-permissions",
        icon: "arrow_right",
        requiredPermissions: ["list_roles", "list_permissions"], // Require either list_roles or list_permissions
      },
    ],
  },
  {
    id: "device-management-label",
    title: "Device Management",
    icon: undefined,
    children: [],
  },
  {
    id: "device-management",
    title: "Device Management",
    icon: "devices",
    children: [
      {
        id: "devices",
        title: "Devices",
        path: "/device-management/devices",
        icon: "arrow_right",
      },

      {
        id: "device-assignments",
        title: "Device Assignments",
        path: "/device-management/device-assignments",
        icon: "arrow_right",
      },
      {
        id: "device-tracking",
        title: "Device Tracking",
        path: "/device-management/device-tracking",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "beneficiary-management-label",
    title: "Beneficiary Management",
    icon: undefined,
    children: [],
  },
  {
    id: "beneficiary-management",
    title: "Beneficiary Management",
    icon: "people_outline",
    children: [
      {
        id: "beneficiaries",
        title: "Beneficiaries",
        path: "/beneficiary-management/beneficiaries",
        icon: "arrow_right",
      },
    ],
  },

  {
    id: "authentication",
    title: "Authentication",
    icon: "lock",
    devOnly: true, // Only show in development mode
    children: [
      {
        id: "auth-basic",
        title: "Basic",
        icon: "arrow_right",
        children: [
          {
            id: "auth-basic-login",
            title: "Login",
            path: "/auth/basic/login",
            icon: "arrow_right",
          },
          {
            id: "auth-basic-register",
            title: "Register",
            path: "/auth/basic/register",
            icon: "arrow_right",
          },
          {
            id: "auth-basic-forgot-password",
            title: "Forgot Password",
            path: "/auth/basic/forgot-password",
            icon: "arrow_right",
          },
          {
            id: "auth-basic-reset-password",
            title: "Reset Password",
            path: "/auth/basic/reset-password",
            icon: "arrow_right",
          },
        ],
      },

    ],
  },
];
