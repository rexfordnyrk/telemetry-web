import { NavigationItem } from "../types";

export const navigationData: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "home",
    children: [
      {
        id: "dashboard-analysis",
        title: "Analysis",
        path: "/",
        icon: "arrow_right",
      },
      {
        id: "dashboard-ecommerce",
        title: "eCommerce",
        path: "/dashboard/ecommerce",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "widgets",
    title: "Widgets",
    icon: "widgets",
    children: [
      {
        id: "widgets-data",
        title: "Data",
        path: "/widgets/data",
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
      },
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        path: "/user-management/roles-permissions",
        icon: "arrow_right",
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
        id: "device-details",
        title: "Device Details",
        path: "/device-management/device-details",
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
      {
        id: "auth-cover",
        title: "Cover",
        icon: "arrow_right",
        children: [
          {
            id: "auth-cover-login",
            title: "Login",
            path: "/auth/cover/login",
            icon: "arrow_right",
          },
          {
            id: "auth-cover-register",
            title: "Register",
            path: "/auth/cover/register",
            icon: "arrow_right",
          },
          {
            id: "auth-cover-forgot-password",
            title: "Forgot Password",
            path: "/auth/cover/forgot-password",
            icon: "arrow_right",
          },
          {
            id: "auth-cover-reset-password",
            title: "Reset Password",
            path: "/auth/cover/reset-password",
            icon: "arrow_right",
          },
        ],
      },
      {
        id: "auth-boxed",
        title: "Boxed",
        icon: "arrow_right",
        children: [
          {
            id: "auth-boxed-login",
            title: "Login",
            path: "/auth/boxed/login",
            icon: "arrow_right",
          },
          {
            id: "auth-boxed-register",
            title: "Register",
            path: "/auth/boxed/register",
            icon: "arrow_right",
          },
          {
            id: "auth-boxed-forgot-password",
            title: "Forgot Password",
            path: "/auth/boxed/forgot-password",
            icon: "arrow_right",
          },
          {
            id: "auth-boxed-reset-password",
            title: "Reset Password",
            path: "/auth/boxed/reset-password",
            icon: "arrow_right",
          },
        ],
      },
    ],
  },

  {
    id: "charts-maps-label",
    title: "Charts & Maps",
    icon: undefined,
    children: [],
  },
  {
    id: "charts",
    title: "Charts",
    icon: "show_chart",
    children: [
      {
        id: "charts-apex",
        title: "Apex",
        path: "/charts/apex",
        icon: "arrow_right",
      },
      {
        id: "charts-chartjs",
        title: "Chartjs",
        path: "/charts/chartjs",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "maps",
    title: "Maps",
    icon: "map",
    children: [
      {
        id: "maps-google",
        title: "Google Maps",
        path: "/maps/google",
        icon: "arrow_right",
      },
      {
        id: "maps-vector",
        title: "Vector Maps",
        path: "/maps/vector",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "others-label",
    title: "Others",
    icon: undefined,
    children: [],
  },

  {
    id: "documentation",
    title: "Documentation",
    icon: "description",
    path: "/documentation",
  },
  {
    id: "support",
    title: "Support",
    icon: "support",
    path: "/support",
  },
];
