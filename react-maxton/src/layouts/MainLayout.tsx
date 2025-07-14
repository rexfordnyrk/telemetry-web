import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ThemeCustomizer from "../components/ThemeCustomizer";
import ErrorBoundary from "../components/ErrorBoundary";
import { ComponentProps } from "../types";

interface MainLayoutProps extends ComponentProps {
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="app-root">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <main className="main-wrapper">
        <div className="main-content">
          {title && (
            <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
              <div className="breadcrumb-title pe-3">{title}</div>
              <div className="ps-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="#">
                        <i className="bx bx-home-alt"></i>
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {title}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          )}
          {children}
        </div>
      </main>

      <footer className="page-footer">
        <p className="mb-0">Copyright © 2024. All right reserved.</p>
      </footer>

      <ThemeCustomizer />
      <div className="overlay btn-toggle"></div>
    </div>
  );
};

export default MainLayout;
