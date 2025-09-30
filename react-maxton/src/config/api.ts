/**
 * API Configuration Module
 * 
 * This module centralizes all API-related configuration including:
 * - Base URL configuration
 * - API endpoint definitions
 * - Helper functions for building URLs and headers
 * 
 * The base URL can be configured via environment variables for different environments
 * (development, staging, production).
 */

// API Configuration object that holds all API-related settings
export const API_CONFIG = {
  // Base URL for all API requests
  // Can be configured via REACT_APP_API_BASE_URL environment variable
  // Falls back to localhost:8000 for development if not set
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  
  // Organized collection of all API endpoints
  // Each endpoint is grouped by functionality (auth, users, etc.)
  ENDPOINTS: {
    // Authentication-related endpoints
    AUTH: {
      LOGIN: '/api/v1/auth/login',           // User login endpoint
      LOGOUT: '/api/v1/auth/logout',         // User logout endpoint
      REFRESH: '/api/v1/auth/refresh',       // Token refresh endpoint (for future use)
    },
    
    // User management endpoints
    USERS: {
      LIST: '/api/v1/users',                 // Get all users
      CREATE: '/api/v1/users',               // Create new user
      UPDATE: (id: string) => `/api/v1/users/${id}`,     // Update specific user
      DELETE: (id: string) => `/api/v1/users/${id}`,     // Delete specific user
    },
    
    // Beneficiary management endpoints
    BENEFICIARIES: {
      LIST: '/api/v1/beneficiaries',         // Get all beneficiaries
      CREATE: '/api/v1/beneficiaries',       // Create new beneficiary
      UPDATE: (id: string) => `/api/v1/beneficiaries/${id}`,     // Update specific beneficiary
      DELETE: (id: string) => `/api/v1/beneficiaries/${id}`,     // Delete specific beneficiary
      PMS_IMPORT: '/api/v1/beneficiaries/import/pms', // Legacy PMS import endpoint (sync)
      IMPORT: '/api/v1/beneficiaries/import', // Queue async import job
      IMPORT_JOB: (jobId: string) => `/api/v1/beneficiaries/import/jobs/${jobId}`, // Get job status
      IMPORT_JOBS: '/api/v1/beneficiaries/import/jobs', // List jobs
      IMPORT_JOB_CANCEL: (jobId: string) => `/api/v1/beneficiaries/import/jobs/${jobId}/cancel`, // Cancel job
    },

    // CIC endpoints
    CICS: {
      LIST: '/api/v1/cics',
      CREATE: '/api/v1/cics',
      DETAIL: (id: string) => `/api/v1/cics/${id}`,
      UPDATE: (id: string) => `/api/v1/cics/${id}`,
      DELETE: (id: string) => `/api/v1/cics/${id}`,
    },

    // Lookup endpoints for select lists
    LOOKUPS: {
      DISTRICTS: '/api/v1/lookups/districts',
      INTERVENTIONS: '/api/v1/lookups/interventions',
      PARTNERS: '/api/v1/lookups/partners',
    },

    // Regions endpoints
    REGIONS: {
      LIST: '/api/v1/regions',
      CREATE: '/api/v1/regions',
      DETAIL: (id: string) => `/api/v1/regions/${id}`,
      UPDATE: (id: string) => `/api/v1/regions/${id}`,
      DELETE: (id: string) => `/api/v1/regions/${id}`,
    },

    // Districts endpoints
    DISTRICTS: {
      LIST: '/api/v1/districts',
      CREATE: '/api/v1/districts',
      DETAIL: (id: string) => `/api/v1/districts/${id}`,
      UPDATE: (id: string) => `/api/v1/districts/${id}`,
      DELETE: (id: string) => `/api/v1/districts/${id}`,
    },

    // Implementing partners endpoints
    IMPLEMENTING_PARTNERS: {
      LIST: '/api/v1/implementing-partners',
      CREATE: '/api/v1/implementing-partners',
      DETAIL: (id: string) => `/api/v1/implementing-partners/${id}`,
      UPDATE: (id: string) => `/api/v1/implementing-partners/${id}`,
      DELETE: (id: string) => `/api/v1/implementing-partners/${id}`,
    },

    // Interventions endpoints
    INTERVENTIONS: {
      LIST: '/api/v1/interventions',
      CREATE: '/api/v1/interventions',
      DETAIL: (id: string) => `/api/v1/interventions/${id}`,
      UPDATE: (id: string) => `/api/v1/interventions/${id}`,
      DELETE: (id: string) => `/api/v1/interventions/${id}`,
    },

    // Device management endpoints
    DEVICES: {
      LIST: '/api/v1/devices',               // Get all devices
      CREATE: '/api/v1/devices',             // Create new device
      UPDATE: (id: string) => `/api/v1/devices/${id}`,           // Update specific device
      DELETE: (id: string) => `/api/v1/devices/${id}`,           // Delete specific device
    },
    
    // Device assignment endpoints
    DEVICE_ASSIGNMENTS: {
      LIST: '/api/v1/devices/assignments',    // Get all device assignments with search/filter support
      CREATE: '/api/v1/devices/assignments',  // Create new device assignment
      UPDATE: (id: string) => `/api/v1/devices/assignments/${id}`, // Update specific assignment
      DELETE: (id: string) => `/api/v1/devices/assignments/${id}`, // Delete specific assignment
      UNASSIGN: (id: string) => `/api/v1/devices/assignments/${id}/unassign`, // Unassign device from beneficiary
    },
    
    // Analytics endpoints for data visualization
    ANALYTICS: {
      OVERVIEW: '/api/v1/analytics/dashboard/overview',                                  // Get overview dashboard data
      AGGREGATE: (period: string) => `/api/v1/analytics/aggregate/${period}`,           // Get aggregate analytics
      DEVICE_STATS: (period: string) => `/api/v1/analytics/device-stats/${period}`,     // Get device statistics
      DEVICE_USAGE: (deviceId: string, period: string) => `/api/v1/analytics/device/${deviceId}/usage/${period}`,     // Get specific device usage
      BENEFICIARY_USAGE: (beneficiaryId: string, period: string) => `/api/v1/analytics/beneficiary/${beneficiaryId}/usage/${period}`, // Get beneficiary usage
    },
    
    // Location analytics endpoints
    LOCATION_ANALYTICS: {
      DEVICE_HISTORY: (deviceId: string, limit?: number) => {
        const baseUrl = `/api/v1/location-analytics/devices/${deviceId}/history`;
        return limit ? `${baseUrl}?limit=${limit}` : baseUrl;
      },
    },
  },
};

/**
 * Helper function to build complete API URLs
 * 
 * @param endpoint - The API endpoint path (e.g., '/api/v1/auth/login')
 * @returns Complete URL with base URL prepended
 * 
 * Example:
 * buildApiUrl('/api/v1/auth/login') 
 * → 'http://localhost:8000/api/v1/auth/login'
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Helper function to get authentication headers for API requests
 * 
 * @param token - Optional JWT token for authenticated requests
 * @returns Headers object with Content-Type and optional Authorization
 * 
 * This function creates the standard headers needed for API requests:
 * - Content-Type: application/json (for JSON requests)
 * - Accept: application/json (to expect JSON responses)
 * - Authorization: Bearer <token> (if token is provided)
 * 
 * Example:
 * getAuthHeaders('abc123') 
 * → { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer abc123' }
 */
export const getAuthHeaders = (token?: string): HeadersInit => {
  // Start with standard headers for JSON API communication
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add authorization header if token is provided
  // This enables authenticated API requests
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
