import React, { useEffect, useRef, useState } from "react";

interface CustomChartProps {
  options: any;
  series: any;
  type: string;
  height: number;
  width?: string | number;
}

const CustomChart: React.FC<CustomChartProps> = ({
  options,
  series,
  type,
  height,
  width = "100%",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let chartInstance: any = null;

    const initChart = async () => {
      if (!chartRef.current || !mounted) return;

      try {
        // Dynamically import ApexCharts to ensure it's available
        const ApexCharts = (window as any).ApexCharts;

        if (!ApexCharts) {
          console.warn("ApexCharts not available");
          return;
        }

        // Create chart configuration
        const config = {
          ...options,
          series: series,
          chart: {
            ...options.chart,
            type: type,
            height: height,
            width: width,
          },
        };

        // Create chart instance
        chartInstance = new ApexCharts(chartRef.current, config);
        chartInstanceRef.current = chartInstance;

        // Render chart
        await chartInstance.render();
      } catch (error) {
        console.warn("Chart initialization failed:", error);
      }
    };

    // Set mounted flag and initialize with delay
    setMounted(true);
    const timer = setTimeout(initChart, 100);

    return () => {
      setMounted(false);
      clearTimeout(timer);

      // Cleanup chart instance
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        } catch (error) {
          // Silently ignore cleanup errors
        }
      }
    };
  }, [options, series, type, height, width]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: `${height}px` }}
      className="chart-container"
    />
  );
};

export default CustomChart;
