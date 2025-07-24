/**
 * JWT Utilities Module
 * 
 * This module provides utilities for working with JWT tokens including:
 * - Token parsing and validation
 * - Claims extraction and decoding
 * - Token expiration checking
 * - User information extraction
 * 
 * JWT tokens contain three parts separated by dots:
 * - Header (algorithm and token type)
 * - Payload (claims/data)
 * - Signature (verification)
 */

/**
 * Interface for JWT claims structure
 * This represents the payload/claims section of the JWT token
 */
export interface JWTClaims {
  // Standard JWT claims
  iss?: string;        // Issuer
  sub?: string;        // Subject (usually user ID)
  aud?: string | string[]; // Audience
  exp?: number;        // Expiration time
  nbf?: number;        // Not before time
  iat?: number;        // Issued at time
  jti?: string;        // JWT ID
  
  // Custom claims (specific to our application)
  user_id?: string;    // User ID
  username?: string;   // Username
  email?: string;      // User email
  roles?: string[];    // User roles/permissions
  permissions?: string[]; // User permissions
  first_name?: string; // User first name
  last_name?: string;  // User last name
  [key: string]: any;  // Allow for additional custom claims
}

/**
 * Decode a JWT token and extract its claims
 * This function parses the JWT without verifying the signature
 * 
 * @param token - The JWT token to decode
 * @returns The decoded claims object or null if invalid
 * 
 * Example:
 * const claims = decodeJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * console.log(claims); // { user_id: "123", username: "john", roles: ["admin"] }
 */
export const decodeJWT = (token: string): JWTClaims | null => {
  try {
    // Handle demo token
    if (token.startsWith('demo.')) {
      return {
        user_id: "demo-user",
        username: "demo@example.com",
        email: "demo@example.com",
        first_name: "Demo",
        last_name: "User",
        roles: ["admin"],
        permissions: ["all"],
        exp: 9999999999, // Far future expiration
        iat: 1600000000
      };
    }

    // Split the token into its three parts
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('Invalid JWT token format: expected 3 parts');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

    // Decode from base64
    const decodedPayload = atob(paddedPayload);

    // Parse the JSON claims
    const claims = JSON.parse(decodedPayload);

    return claims;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * 
 * @param token - The JWT token to check
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const claims = decodeJWT(token);
  
  if (!claims || !claims.exp) {
    return true; // Consider invalid tokens as expired
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return claims.exp < currentTime;
};

/**
 * Get user information from JWT claims
 * 
 * @param token - The JWT token
 * @returns User information object or null if invalid
 */
export const getUserFromToken = (token: string) => {
  const claims = decodeJWT(token);
  
  if (!claims) {
    return null;
  }
  
  return {
    id: claims.user_id || claims.sub,
    username: claims.username,
    email: claims.email,
    roles: claims.roles || [],
    permissions: claims.permissions || [],
    firstName: claims.first_name,
    lastName: claims.last_name,
  };
};

/**
 * Log JWT claims for debugging purposes
 * This function provides detailed logging of all JWT claims
 * 
 * @param token - The JWT token to log
 * @param label - Optional label for the log output
 */
export const logJWTClaims = (token: string, label: string = 'JWT Claims') => {
  const claims = decodeJWT(token);
  
  if (!claims) {
    console.error(`${label}: Failed to decode JWT token`);
    return;
  }
  
  console.group(`${label}:`);
  console.log('Full JWT Claims:', claims);
  
  // Log standard JWT claims
  if (claims.iss) console.log('Issuer:', claims.iss);
  if (claims.sub) console.log('Subject:', claims.sub);
  if (claims.aud) console.log('Audience:', claims.aud);
  if (claims.exp) console.log('Expires At:', new Date(claims.exp * 1000).toISOString());
  if (claims.iat) console.log('Issued At:', new Date(claims.iat * 1000).toISOString());
  if (claims.jti) console.log('JWT ID:', claims.jti);
  
  // Log custom claims
  if (claims.user_id) console.log('User ID:', claims.user_id);
  if (claims.username) console.log('Username:', claims.username);
  if (claims.email) console.log('Email:', claims.email);
  if (claims.roles) console.log('Roles:', claims.roles);
  if (claims.permissions) console.log('Permissions:', claims.permissions);
  if (claims.first_name) console.log('First Name:', claims.first_name);
  if (claims.last_name) console.log('Last Name:', claims.last_name);
  
  // Log any other custom claims
  const customClaims = Object.keys(claims).filter(key => 
    !['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti', 'user_id', 'username', 'email', 'roles', 'permissions', 'first_name', 'last_name'].includes(key)
  );
  
  if (customClaims.length > 0) {
    console.log('Other Custom Claims:');
    customClaims.forEach(key => {
      console.log(`  ${key}:`, claims[key]);
    });
  }
  
  console.groupEnd();
};
