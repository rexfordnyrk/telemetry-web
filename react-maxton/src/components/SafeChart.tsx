import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class SafeChart extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Chart error caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="chart-error d-flex align-items-center justify-content-center"
            style={{ height: "200px" }}
          >
            <div className="text-center">
              <div className="text-muted">Chart temporarily unavailable</div>
              <small className="text-muted">
                Data visualization will be restored shortly
              </small>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default SafeChart;
