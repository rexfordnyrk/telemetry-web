import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import App from './App';

test('renders without crashing', () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        expiresIn: null,
        mfaPending: false,
        mfaToken: null,
        mfaMethods: [],
        mfaEmailOtpSent: false,
        loading: false,
        error: null,
        initialized: true,
        formData: { email: '', password: '', rememberMe: false },
      },
    },
  });

  expect(() =>
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  ).not.toThrow();
});
