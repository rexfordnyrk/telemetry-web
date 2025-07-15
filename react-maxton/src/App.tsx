import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutContext";
import Dashboard from "./pages/Dashboard";
import EcommerceDashboard from "./pages/EcommerceDashboard";
import WidgetsData from "./pages/WidgetsData";
import BasicLogin from "./pages/BasicLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  useEffect(() => {
    // Set the theme to match original HTML
    document.documentElement.setAttribute("data-bs-theme", "blue-theme");
    document.documentElement.setAttribute("lang", "en");

    // Add global error handler to prevent app crashes
    const handleError = (event: ErrorEvent) => {
      // Specifically handle ApexCharts node errors
      if (
        event.error &&
        event.error.message &&
        event.error.message.includes("node")
      ) {
        console.warn("Chart-related error suppressed:", event.error.message);
        event.preventDefault();
        return true;
      }
      console.warn("Global error caught:", event.error);
      // Prevent the error from breaking the app
      event.preventDefault();
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn("Unhandled promise rejection:", event.reason);
      // Prevent unhandled rejections from breaking the app
      event.preventDefault();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/dashboard/ecommerce"
              element={<EcommerceDashboard />}
            />
            <Route path="/widgets/data" element={<WidgetsData />} />
            <Route path="/login" element={<BasicLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/user-management/users" element={<Users />} />
            <Route
              path="/user-management/users/:id"
              element={<UserDetails />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LayoutProvider>
    </ErrorBoundary>
  );
}

export default App;
