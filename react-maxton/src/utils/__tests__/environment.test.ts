/**
 * Tests for environment utility functions
 * 
 * These tests verify that the environment detection works correctly
 * based on the REACT_APP_API_BASE_URL environment variable.
 */

import { isProduction, isDevelopment, getEnvironment } from '../environment';

// Mock process.env to test different scenarios
const originalEnv = process.env;

describe('Environment Utilities', () => {
  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original process.env after all tests
    process.env = originalEnv;
  });

  describe('isProduction', () => {
    it('should return true when REACT_APP_API_BASE_URL is set', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
      expect(isProduction()).toBe(true);
    });

    it('should return true when REACT_APP_API_BASE_URL is set to empty string', () => {
      process.env.REACT_APP_API_BASE_URL = '';
      expect(isProduction()).toBe(true);
    });

    it('should return false when REACT_APP_API_BASE_URL is not set', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      expect(isProduction()).toBe(false);
    });

    it('should return false when REACT_APP_API_BASE_URL is undefined', () => {
      process.env.REACT_APP_API_BASE_URL = undefined;
      expect(isProduction()).toBe(false);
    });
  });

  describe('isDevelopment', () => {
    it('should return false when REACT_APP_API_BASE_URL is set', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
      expect(isDevelopment()).toBe(false);
    });

    it('should return true when REACT_APP_API_BASE_URL is not set', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      expect(isDevelopment()).toBe(true);
    });

    it('should return true when REACT_APP_API_BASE_URL is undefined', () => {
      process.env.REACT_APP_API_BASE_URL = undefined;
      expect(isDevelopment()).toBe(true);
    });
  });

  describe('getEnvironment', () => {
    it('should return "production" when REACT_APP_API_BASE_URL is set', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
      expect(getEnvironment()).toBe('production');
    });

    it('should return "development" when REACT_APP_API_BASE_URL is not set', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      expect(getEnvironment()).toBe('development');
    });
  });
});
