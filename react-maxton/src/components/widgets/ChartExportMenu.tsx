import React from 'react';
import { Dropdown } from 'react-bootstrap';

export interface ChartExportMenuProps {
  // ApexCharts wrapper ref. The underlying chart instance is at
  // ref.current?.chart (SafeApexChart / react-apexcharts convention).
  chartRef: React.RefObject<{ chart?: any } | null>;
}

const ChartExportMenu: React.FC<ChartExportMenuProps> = ({ chartRef }) => {
  const call = (method: 'exportToPng' | 'exportToSVG') => {
    try {
      const chart = chartRef.current?.chart;
      if (chart && typeof chart[method] === 'function') {
        chart[method]();
      } else {
        // eslint-disable-next-line no-console
        console.warn('ChartExportMenu: chart or method unavailable', method);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('ChartExportMenu:', method, 'failed', e);
    }
  };
  return (
    <>
      <Dropdown.Item onClick={() => call('exportToPng')}>Export as PNG</Dropdown.Item>
      <Dropdown.Item onClick={() => call('exportToSVG')}>Export as SVG</Dropdown.Item>
    </>
  );
};

export default ChartExportMenu;
