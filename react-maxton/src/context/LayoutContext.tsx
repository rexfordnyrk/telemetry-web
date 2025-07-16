import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LayoutContextType, ThemeVariant } from "../types";

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [theme, setTheme] = useState<ThemeVariant>("blue-theme");

  // Apply theme to document
  useEffect(() => {
    console.log("Setting theme to:", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);

    // Force a re-render by toggling a CSS class
    document.body.classList.remove("theme-transition");
    requestAnimationFrame(() => {
      document.body.classList.add("theme-transition");
    });
  }, [theme]);

  // Apply sidebar toggle class to body
  useEffect(() => {
    if (sidebarToggled) {
      document.body.classList.add("toggled");
    } else {
      document.body.classList.remove("toggled");
    }

    return () => {
      document.body.classList.remove("toggled");
    };
  }, [sidebarToggled]);

  const value: LayoutContextType = {
    sidebarToggled,
    theme,
    setSidebarToggled,
    setTheme,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
