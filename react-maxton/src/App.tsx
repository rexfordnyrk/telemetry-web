import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutContext";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  useEffect(() => {
    // Set the theme to match original HTML
    document.documentElement.setAttribute("data-bs-theme", "blue-theme");
    document.documentElement.setAttribute("lang", "en");
  }, []);

  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard/ecommerce" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
