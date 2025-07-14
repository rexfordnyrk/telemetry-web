import React, { useEffect, useRef, useState, useCallback } from "react";

interface SafeApexChartProps {
  options: any;
  series: any;
  type: string;
  height: number;
  width?: string | number;
}

const SafeApexChart: React.FC<SafeApexChartProps> = ({
  options,
  series,
  type,
  height,
  width = "100%",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [isError, setIsError] = useState(false);
  const mountedRef = useRef(true);

  const destroyChart = useCallback(() => {
    if (chartInstanceRef.current) {
      try {
        if (typeof chartInstanceRef.current.destroy === "function") {
          chartInstanceRef.current.destroy();
        }
      } catch (error) {
        // Silently ignore destroy errors
      } finally {
        chartInstanceRef.current = null;
      }
    }
  }, []);

  const createChart = useCallback(async () => {
    if (!chartRef.current || !mountedRef.current) return;

    try {
      // Check if ApexCharts is available
      const ApexCharts = (window as any).ApexCharts;
      if (!ApexCharts) {
        throw new Error("ApexCharts not loaded");
      }

      // Destroy existing chart
      destroyChart();

      // Create new chart
      const chartConfig = {
        ...options,
        series: series,
        chart: {
          ...options.chart,
          type: type,
          height: height,
          width: width,
        },
      };

      chartInstanceRef.current = new ApexCharts(chartRef.current, chartConfig);

      if (mountedRef.current) {
        await chartInstanceRef.current.render();
      }
    } catch (error) {
      console.warn("Chart creation failed:", error);
      setIsError(true);
    }
  }, [options, series, type, height, width, destroyChart]);

  useEffect(() => {
    mountedRef.current = true;

    // Create chart with delay to ensure DOM is ready
    const timer = setTimeout(createChart, 150);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      destroyChart();
    };
  }, [createChart, destroyChart]);

  // Update chart when props change
  useEffect(() => {
    if (chartInstanceRef.current && mountedRef.current) {
      try {
        chartInstanceRef.current.updateOptions({
          ...options,
          series: series,
        });
      } catch (error) {
        console.warn("Chart update failed, recreating:", error);
        createChart();
      }
    }
  }, [options, series, createChart]);

  if (isError) {
    return (
      <div
        className="chart-error d-flex align-items-center justify-content-center"
        style={{ height: `${height}px`, width: "100%" }}
      >
        <div className="text-center">
          <div className="text-muted small">Chart unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: `${height}px` }}
      className="safe-chart-container"
    />
  );
};

export default SafeApexChart;
