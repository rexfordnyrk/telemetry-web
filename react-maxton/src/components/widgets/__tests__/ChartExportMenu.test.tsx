import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from 'react-bootstrap';
import React from 'react';
import ChartExportMenu from '../ChartExportMenu';

const mount = (ref: any) => render(
  <Dropdown show>
    <Dropdown.Toggle id="t">t</Dropdown.Toggle>
    <Dropdown.Menu>
      <ChartExportMenu chartRef={ref} />
    </Dropdown.Menu>
  </Dropdown>
);

test('calls exportToPng on click', () => {
  const png = jest.fn();
  const ref = { current: { chart: { exportToPng: png, exportToSVG: jest.fn() } } };
  mount(ref);
  fireEvent.click(screen.getByText('Export as PNG'));
  expect(png).toHaveBeenCalledTimes(1);
});

test('calls exportToSVG on click', () => {
  const svg = jest.fn();
  const ref = { current: { chart: { exportToPng: jest.fn(), exportToSVG: svg } } };
  mount(ref);
  fireEvent.click(screen.getByText('Export as SVG'));
  expect(svg).toHaveBeenCalledTimes(1);
});

test('handles method throwing without re-throwing', () => {
  const error = new Error('export failed');
  const ref = {
    current: {
      chart: {
        exportToPng: jest.fn(() => {
          throw error;
        }),
        exportToSVG: jest.fn(),
      },
    },
  };
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  mount(ref);
  fireEvent.click(screen.getByText('Export as PNG'));
  expect(consoleSpy).toHaveBeenCalledWith('ChartExportMenu:', 'exportToPng', 'failed', error);
  consoleSpy.mockRestore();
});
