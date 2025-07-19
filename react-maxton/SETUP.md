# Authentication Setup Guide

This guide will help you set up and configure the authentication system for the React application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to the Telemetry App API server

## Quick Setup

### 1. Install Dependencies

```bash
cd react-maxton
npm install
```

### 2. Configure API Base URL

1. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and set your API server URL:
   ```
   REACT_APP_API_BASE_URL=http://your-api-server.com
   ```

   For local development:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

### 3. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Testing the Authentication

### 1. Navigate to Login

Go to `http://localhost:3000/login`

### 2. Test Login

Use the credentials from your API server:
- **Email**: Your registered email
- **Password**: Your password

### 3. Verify Authentication

After successful login:
- You should be redirected to `/dashboard`
- Protected routes should be accessible
- The authentication state should persist across page refreshes

## API Endpoints

The authentication system expects these API endpoints:

### Login
- **URL**: `POST /api/v1/auth/login`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `username`: User's email or username
  - `password`: User's password
- **Response**: 
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

### Logout
- **URL**: `POST /api/v1/auth/logout`
- **Headers**: `Authorization: Bearer <token>`

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | API server base URL | `http://localhost:8000` |

### Custom Configuration

You can modify the API configuration in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  // ... other configuration
};
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if your API server is running
   - Verify the API base URL in `.env`
   - Check network connectivity

2. **Login Not Working**
   - Verify credentials are correct
   - Check browser console for errors
   - Ensure API endpoint is accessible

3. **Protected Routes Not Working**
   - Check if `ProtectedRoute` is wrapping components
   - Verify authentication state in Redux DevTools
   - Check if token is present in localStorage

4. **Token Not Persisting**
   - Check if localStorage is enabled
   - Verify token is being saved correctly

### Debug Mode

To enable debug logging, add this to your `.env`:

```
REACT_APP_DEBUG=true
```

This will log authentication events to the console.

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Token Expiration**: Implement token refresh logic if needed
4. **CSRF Protection**: Ensure your API implements CSRF protection

## Production Deployment

1. Set the correct API base URL in environment variables
2. Enable HTTPS
3. Configure proper CORS settings on your API server
4. Consider implementing token refresh logic
5. Add error monitoring (e.g., Sentry)

## API Integration

The authentication system is designed to work with the Telemetry App API. If you're using a different API:

1. Update the API endpoints in `src/config/api.ts`
2. Modify the request/response handling in `src/store/slices/authSlice.ts`
3. Update the API service in `src/services/apiService.ts`

## Testing

Run the test suite:

```bash
npm test
```

This will run tests for authentication components and functionality. 