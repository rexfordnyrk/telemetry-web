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
      {
        id: "widgets-static",
        title: "Static",
        path: "/widgets/static",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "apps",
    title: "Apps",
    icon: "apps",
    children: [
      {
        id: "apps-email",
        title: "Email Box",
        path: "/apps/email",
        icon: "arrow_right",
      },
      {
        id: "apps-chat",
        title: "Chat",
        path: "/apps/chat",
        icon: "arrow_right",
      },
      {
        id: "apps-calendar",
        title: "Calendar",
        path: "/apps/calendar",
        icon: "arrow_right",
      },
      {
        id: "apps-todo",
        title: "To do",
        path: "/apps/todo",
        icon: "arrow_right",
      },
      {
        id: "apps-invoice",
        title: "Invoice",
        path: "/apps/invoice",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "ui-elements-label",
    title: "UI Elements",
    icon: undefined,
    children: [],
  },
  {
    id: "cards",
    title: "Cards",
    icon: "inventory_2",
    path: "/cards",
  },
  {
    id: "ecommerce",
    title: "eCommerce",
    icon: "shopping_bag",
    children: [
      {
        id: "ecommerce-add-product",
        title: "Add Product",
        path: "/ecommerce/add-product",
        icon: "arrow_right",
      },
      {
        id: "ecommerce-products",
        title: "Products",
        path: "/ecommerce/products",
        icon: "arrow_right",
      },
      {
        id: "ecommerce-customers",
        title: "Customers",
        path: "/ecommerce/customers",
        icon: "arrow_right",
      },
      {
        id: "ecommerce-orders",
        title: "Orders",
        path: "/ecommerce/orders",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "components",
    title: "Components",
    icon: "card_giftcard",
    children: [
      {
        id: "components-alerts",
        title: "Alerts",
        path: "/components/alerts",
        icon: "arrow_right",
      },
      {
        id: "components-buttons",
        title: "Buttons",
        path: "/components/buttons",
        icon: "arrow_right",
      },
      {
        id: "components-badges",
        title: "Badges",
        path: "/components/badges",
        icon: "arrow_right",
      },
      {
        id: "components-cards",
        title: "Cards",
        path: "/components/cards",
        icon: "arrow_right",
      },
      {
        id: "components-modals",
        title: "Modals",
        path: "/components/modals",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "forms-tables-label",
    title: "Forms & Tables",
    icon: undefined,
    children: [],
  },
  {
    id: "forms",
    title: "Forms",
    icon: "toc",
    children: [
      {
        id: "forms-elements",
        title: "Form Elements",
        path: "/forms/elements",
        icon: "arrow_right",
      },
      {
        id: "forms-layouts",
        title: "Forms Layouts",
        path: "/forms/layouts",
        icon: "arrow_right",
      },
      {
        id: "forms-validation",
        title: "Form Validation",
        path: "/forms/validation",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "tables",
    title: "Tables",
    icon: "api",
    children: [
      {
        id: "tables-basic",
        title: "Basic Table",
        path: "/tables/basic",
        icon: "arrow_right",
      },
      {
        id: "tables-datatable",
        title: "Data Table",
        path: "/tables/datatable",
        icon: "arrow_right",
      },
    ],
  },
  {
    id: "charts-maps-label",
    title: "Charts & Maps",
    icon: null,
    children: [],
  },
  {
    id: "charts",
    title: "Charts",
    icon: "fitbit",
    children: [
      {
        id: "charts-apex",
        title: "Apex Charts",
        path: "/charts/apex",
        icon: "arrow_right",
      },
    ],
  },
];
