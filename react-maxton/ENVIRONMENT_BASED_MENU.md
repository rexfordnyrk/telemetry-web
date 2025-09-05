# Environment-Based Menu Visibility

This document explains how the sidebar menu items are hidden based on the environment (development vs production).

## Overview

The application now supports hiding specific menu items when running in production mode. This is determined by checking if the `REACT_APP_API_BASE_URL` environment variable is set.

## How It Works

### Environment Detection

- **Production Mode**: When `REACT_APP_API_BASE_URL` is set (even to an empty string)
- **Development Mode**: When `REACT_APP_API_BASE_URL` is not set or undefined

### Menu Items Hidden in Production

The following menu items are hidden when the app is running in production:

1. **Widgets** (entire section and all sub-items)
2. **Authentication** (entire section and all sub-items)
3. **Dashboard/Analysis** (sub-item under Dashboard)
4. **Dashboard/eCommerce** (sub-item under Dashboard)

## Implementation Details

### Files Modified

1. **`src/utils/environment.ts`** - Environment detection utilities
2. **`src/types/index.ts`** - Added `devOnly` property to `NavigationItem` interface
3. **`src/utils/navigationData.ts`** - Marked specific items as `devOnly: true`
4. **`src/components/Sidebar.tsx`** - Updated filtering logic to respect `devOnly` property

### Key Functions

- `isProduction()` - Returns true if `REACT_APP_API_BASE_URL` is set
- `isDevelopment()` - Returns true if `REACT_APP_API_BASE_URL` is not set
- `getEnvironment()` - Returns 'production' or 'development'

### Usage in Navigation Data

```typescript
{
  id: "widgets",
  title: "Widgets",
  icon: "widgets",
  devOnly: true, // Only show in development mode
  children: [...]
}
```

## Testing

The environment detection is thoroughly tested in `src/utils/__tests__/environment.test.ts` with the following scenarios:

- Production mode when `REACT_APP_API_BASE_URL` is set
- Production mode when `REACT_APP_API_BASE_URL` is set to empty string
- Development mode when `REACT_APP_API_BASE_URL` is not set
- Development mode when `REACT_APP_API_BASE_URL` is undefined

## Usage

To run the app in development mode (showing all menu items):
```bash
# Don't set REACT_APP_API_BASE_URL
npm start
```

To run the app in production mode (hiding dev-only menu items):
```bash
# Set REACT_APP_API_BASE_URL to any value
REACT_APP_API_BASE_URL=https://api.example.com npm start
# or
REACT_APP_API_BASE_URL= npm start
```

## Benefits

1. **Clean Production UI**: Removes development/testing features from production
2. **Environment-Aware**: Automatically adapts based on environment configuration
3. **Maintainable**: Easy to add/remove dev-only items by setting `devOnly: true`
4. **Type-Safe**: Full TypeScript support with proper type definitions
5. **Well-Tested**: Comprehensive test coverage for environment detection
