import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutContext";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
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
