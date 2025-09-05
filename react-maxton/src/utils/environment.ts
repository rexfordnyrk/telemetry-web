/**
 * Environment detection utilities
 * 
 * This module provides utilities to determine the current environment
 * and control feature visibility based on environment settings.
 */

/**
 * Check if the application is running in production mode
 * 
 * Production mode is determined by the presence of REACT_APP_API_BASE_URL
 * environment variable. If this variable is set (even to an empty string),
 * the app is considered to be in production mode.
 * 
 * @returns {boolean} True if running in production mode, false otherwise
 */
export const isProduction = (): boolean => {
  return process.env.REACT_APP_API_BASE_URL !== undefined;
};

/**
 * Check if the application is running in development mode
 * 
 * Development mode is the opposite of production mode - when
 * REACT_APP_API_BASE_URL is not set.
 * 
 * @returns {boolean} True if running in development mode, false otherwise
 */
export const isDevelopment = (): boolean => {
  return !isProduction();
};

/**
 * Get the current environment name
 * 
 * @returns {string} 'production' or 'development'
 */
export const getEnvironment = (): string => {
  return isProduction() ? 'production' : 'development';
};
