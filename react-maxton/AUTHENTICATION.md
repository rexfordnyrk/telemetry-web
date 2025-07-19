# Authentication Implementation

This document describes the authentication system implemented in the React application.

## Overview

The authentication system uses Redux Toolkit for state management and integrates with the Telemetry App API for login/logout functionality.

## Features

- **Login**: Authenticate users with username/email and password
- **Token Management**: JWT tokens are stored in localStorage
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Logout**: Clear authentication state and redirect to login
- **Loading States**: Visual feedback during authentication operations
- **Error Handling**: Display authentication errors to users

## Configuration

### API Base URL

The API base URL is configurable through environment variables:

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Set your API server URL in `.env`:
   ```
   REACT_APP_API_BASE_URL=http://your-api-server.com
   ```

### Default Configuration

- **Development**: `http://localhost:8000`
- **Production**: Set via `REACT_APP_API_BASE_URL` environment variable

## API Endpoints

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

## Components

### BasicLogin
The main login page component that handles user authentication.

**Features:**
- Form validation
- Loading states
- Error display
- Password visibility toggle
- Remember me functionality

### ProtectedRoute
Wrapper component that protects routes requiring authentication.

**Usage:**
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### PublicRoute
Wrapper component for public routes (like login) that redirects authenticated users.

**Usage:**
```tsx
<PublicRoute>
  <BasicLogin />
</PublicRoute>
```

### AuthInitializer
Component that initializes authentication state on app startup.

### LogoutButton
Reusable logout button component.

**Usage:**
```tsx
<LogoutButton className="btn btn-danger">
  Sign Out
</LogoutButton>
```

## Redux State

### Auth Slice
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### Actions
- `loginUser(credentials)`: Authenticate user
- `logoutUser()`: Logout user
- `clearError()`: Clear authentication errors
- `setToken(token)`: Set authentication token
- `clearAuth()`: Clear all authentication state

## Usage Examples

### Login Form
```tsx
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const handleLogin = async (credentials) => {
  try {
    await dispatch(loginUser(credentials)).unwrap();
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Check Authentication Status
```tsx
import { useSelector } from 'react-redux';

const { isAuthenticated, user, loading } = useSelector(state => state.auth);
```

### Logout
```tsx
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

const handleLogout = async () => {
  await dispatch(logoutUser());
  navigate('/login');
};
```

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage
2. **Token Validation**: Implement token validation on app startup
3. **Automatic Logout**: Consider implementing token expiration handling
4. **HTTPS**: Always use HTTPS in production
5. **CSRF Protection**: Ensure your API implements CSRF protection

## Error Handling

The authentication system handles various error scenarios:

- **Network Errors**: Display user-friendly messages
- **Invalid Credentials**: Show specific error messages
- **Server Errors**: Handle 500-level errors gracefully
- **Token Expiration**: Automatically redirect to login

## Testing

To test the authentication system:

1. Start your API server
2. Set the correct API base URL in `.env`
3. Run the React application
4. Navigate to `/login`
5. Use valid credentials to test login
6. Test protected routes
7. Test logout functionality

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check API server is running
   - Verify API base URL configuration
   - Check network connectivity

2. **Login Not Working**
   - Verify credentials are correct
   - Check API endpoint is accessible
   - Review browser console for errors

3. **Token Not Persisting**
   - Check localStorage is enabled
   - Verify token is being saved correctly

4. **Protected Routes Not Working**
   - Ensure ProtectedRoute is wrapping components
   - Check authentication state in Redux DevTools
   - Verify token is present in localStorage 