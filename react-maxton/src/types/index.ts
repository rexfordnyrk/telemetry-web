// Theme types
export type ThemeVariant =
  | "blue-theme"
  | "light"
  | "dark"
  | "semi-dark"
  | "bordered-theme";

// Navigation types
export interface NavigationItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: NavigationItem[];
  badge?: {
    text: string;
    variant:
      | "primary"
      | "secondary"
      | "success"
      | "danger"
      | "warning"
      | "info";
  };
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  avatar?: string;
}

// Chart data types
export interface ChartData {
  series: any[];
  options: any;
}

// Dashboard statistics
export interface DashboardStat {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: {
    percentage: number;
    direction: "up" | "down";
  };
}

// Layout context types
export interface LayoutContextType {
  sidebarToggled: boolean;
  theme: ThemeVariant;
  setSidebarToggled: (toggled: boolean) => void;
  setTheme: (theme: ThemeVariant) => void;
}

// Component props types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends ComponentProps {
  title?: string;
}
