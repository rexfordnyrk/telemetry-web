import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { installFetchInterceptor } from './utils/fetchInterceptor';

// Wrap window.fetch so a 401 from a stale token_version / revoked session
// triggers the same logout-and-redirect flow the thunks use. Required so
// page-level fetches that bypass handleApiError still sign the user out
// when their account is disabled mid-session.
installFetchInterceptor(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
