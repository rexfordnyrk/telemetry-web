/**
 * Main App Component
 * 
 * This is the root component of the React application that sets up:
 * - Redux store provider
 * - Authentication initialization
 * - Routing with protected and public routes
 * - Global error handling
 * - Theme and styling setup
 * 
 * The app uses a layered architecture:
 * 1. Redux Provider (state management)
 * 2. Error Boundary (error handling)
 * 3. Auth Initializer (authentication setup)
 * 4. Layout Provider (UI layout)
 * 5. Router (navigation)
 * 6. Routes (page components)
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { LayoutProvider } from "./context/LayoutContext";

// Authentication components
import AuthInitializer from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Page components
import Dashboard from "./pages/Dashboard";
import EcommerceDashboard from "./pages/EcommerceDashboard";
import WidgetsData from "./pages/WidgetsData";
import WidgetsDataComponents from "./pages/WidgetsDataComponents";
import BasicLogin from "./pages/BasicLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import RolesPermissions from "./pages/RolesPermissions";
import Devices from "./pages/Devices";
import DeviceDetails from "./pages/DeviceDetails";
import Beneficiaries from "./pages/Beneficiaries";
import BeneficiaryDetails from "./pages/BeneficiaryDetails";
import NotFound from "./pages/NotFound";
import MainComponents from "./pages/MainComponents";

// Utility components
import ErrorBoundary from "./components/ErrorBoundary";
import Alert from "./components/Alert";

// Styles and assets
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./sass/main.scss";
import "./sass/dark-theme.scss";
import "./sass/blue-theme.scss";
import "./sass/semi-dark.scss";
import "./sass/bordered-theme.scss";
import "./sass/responsive.scss";
import "./sass/theme-text-fixes.scss";
// import "./styles/table-fixes.css"; // Temporarily disabled for observations
// import "./assets/css/theme-fixes.css"; // Temporarily disabled - causing icon font issues

/**
 * Main App component that sets up the entire application
 * 
 * This component is responsible for:
 * - Setting up global error handling
 * - Configuring the Redux store
 * - Initializing authentication
 * - Setting up routing with protection
 * - Applying global styles and themes
 */
function App() {
  // ============================================================================
  // GLOBAL SETUP EFFECT
  // ============================================================================
  
  /**
   * Effect to set up global application configuration
   * This runs once when the app starts
   */
  useEffect(() => {
    // Set the language attribute for accessibility
    document.documentElement.setAttribute("lang", "en");

    // Add global error handler to prevent app crashes
    // This catches JavaScript errors that might break the app
    const handleError = (event: ErrorEvent) => {
      // Specifically handle ApexCharts node errors (common chart library issue)
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

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn("Unhandled promise rejection:", event.reason);
      // Prevent unhandled rejections from breaking the app
      event.preventDefault();
    };

    // Add event listeners for error handling
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    // Redux Provider - Makes the store available to all components
    <Provider store={store}>
      {/* Error Boundary - Catches and handles React errors */}
      <ErrorBoundary>
        {/* Auth Initializer - Sets up authentication state */}
        <AuthInitializer>
          {/* Layout Provider - Manages UI layout and theme */}
          <LayoutProvider>
            {/* Router - Handles navigation and routing */}
            <Router>
              {/* Routes - Define all application routes */}
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                {/* These routes are accessible without authentication */}
                {/* They automatically redirect authenticated users to dashboard */}
                
                {/* Login page - Public route that redirects authenticated users */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <BasicLogin />
                    </PublicRoute>
                  } 
                />
                
                {/* Forgot password page - Public route */}
                <Route 
                  path="/forgot-password" 
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  } 
                />
                
                {/* Reset password page - Public route */}
                <Route 
                  path="/reset-password" 
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  } 
                />

                {/* ===== PROTECTED ROUTES ===== */}
                {/* These routes require authentication */}
                {/* They automatically redirect unauthenticated users to login */}
                
                {/* Dashboard - Main dashboard page */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Dashboard with explicit path */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* E-commerce dashboard */}
                <Route
                  path="/dashboard/ecommerce"
                  element={
                    <ProtectedRoute>
                      <EcommerceDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Widgets data page */}
                <Route
                  path="/widgets/data"
                  element={
                    <ProtectedRoute>
                      <WidgetsData />
                    </ProtectedRoute>
                  }
                />

                {/* Widgets data components page */}
                <Route
                  path="/widgets/data-components"
                  element={
                    <ProtectedRoute>
                      <WidgetsDataComponents />
                    </ProtectedRoute>
                  }
                />

                {/* Main components page */}
                <Route
                  path="/widgets/main-components"
                  element={
                    <ProtectedRoute>
                      <MainComponents />
                    </ProtectedRoute>
                  }
                />
                
                {/* ===== USER MANAGEMENT ROUTES ===== */}
                
                {/* Users list page */}
                <Route 
                  path="/user-management/users" 
                  element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Individual user details page */}
                <Route
                  path="/user-management/users/:id"
                  element={
                    <ProtectedRoute>
                      <UserDetails />
                    </ProtectedRoute>
                  }
                />
                
                {/* Roles and permissions page */}
                <Route
                  path="/user-management/roles-permissions"
                  element={
                    <ProtectedRoute>
                      <RolesPermissions />
                    </ProtectedRoute>
                  }
                />
                
                {/* ===== DEVICE MANAGEMENT ROUTES ===== */}
                
                {/* Devices list page */}
                <Route 
                  path="/device-management/devices" 
                  element={
                    <ProtectedRoute>
                      <Devices />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Individual device details page */}
                <Route
                  path="/device-management/devices/:id"
                  element={
                    <ProtectedRoute>
                      <DeviceDetails />
                    </ProtectedRoute>
                  }
                />
                
                {/* ===== BENEFICIARY MANAGEMENT ROUTES ===== */}
                
                {/* Beneficiaries list page */}
                <Route
                  path="/beneficiary-management/beneficiaries"
                  element={
                    <ProtectedRoute>
                      <Beneficiaries />
                    </ProtectedRoute>
                  }
                />
                
                {/* Individual beneficiary details page */}
                <Route
                  path="/beneficiary-management/beneficiaries/:id"
                  element={
                    <ProtectedRoute>
                      <BeneficiaryDetails />
                    </ProtectedRoute>
                  }
                />
                
                {/* ===== FALLBACK ROUTE ===== */}
                {/* 404 page for any unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global alert component for notifications */}
              <Alert />
            </Router>
          </LayoutProvider>
        </AuthInitializer>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
