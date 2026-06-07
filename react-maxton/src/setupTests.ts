// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => children ?? null,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Polyline: () => null,
  useMap: () => ({}),
}));
