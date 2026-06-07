import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { buildApiUrl, API_CONFIG } from '../config/api';
import { logoutUser, refreshSession } from '../store/slices/authSlice';

export interface SessionConfig {
  idle_timeout_minutes: number;
  idle_warning_minutes: number;
  access_expiry_minutes: number;
}

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart', 'focus'] as const;
const REFRESH_BUFFER_SECONDS = 60;

export function useSessionManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, expiresIn } = useSelector((state: RootState) => state.auth);

  const [showWarning, setShowWarning] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const handleIdleLogout = useCallback(async () => {
    setShowWarning(false);
    clearIdleTimers();
    clearRefreshTimer();
    await dispatch(logoutUser());
    window.location.href = '/login?reason=session_expired';
  }, [clearIdleTimers, clearRefreshTimer, dispatch]);

  const scheduleIdleTimers = useCallback(() => {
    if (!sessionConfig) return;

    clearIdleTimers();
    setShowWarning(false);

    const idleMs = sessionConfig.idle_timeout_minutes * 60 * 1000;
    const warningMs = sessionConfig.idle_warning_minutes * 60 * 1000;
    const warningDelay = Math.max(idleMs - warningMs, 0);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, warningDelay);

    logoutTimerRef.current = setTimeout(() => {
      handleIdleLogout();
    }, idleMs);
  }, [clearIdleTimers, handleIdleLogout, sessionConfig]);

  const resetIdleTimer = useCallback(() => {
    if (!isAuthenticated || !sessionConfig) return;
    scheduleIdleTimers();
  }, [isAuthenticated, scheduleIdleTimers, sessionConfig]);

  const scheduleTokenRefresh = useCallback(() => {
    if (!isAuthenticated) return;

    clearRefreshTimer();

    const expirySeconds =
      expiresIn ?? (sessionConfig?.access_expiry_minutes ?? 15) * 60;
    const refreshDelayMs = Math.max((expirySeconds - REFRESH_BUFFER_SECONDS) * 1000, 0);

    refreshTimerRef.current = setTimeout(() => {
      dispatch(refreshSession());
      scheduleTokenRefresh();
    }, refreshDelayMs);
  }, [clearRefreshTimer, dispatch, expiresIn, isAuthenticated, sessionConfig]);

  const stayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearIdleTimers();
      clearRefreshTimer();
      setShowWarning(false);
      return;
    }

    let cancelled = false;

    const loadSessionConfig = async () => {
      try {
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.SESSION_CONFIG));
        if (!response.ok) return;
        const config: SessionConfig = await response.json();
        if (!cancelled) {
          setSessionConfig(config);
        }
      } catch {
        if (!cancelled) {
          setSessionConfig({
            idle_timeout_minutes: 30,
            idle_warning_minutes: 2,
            access_expiry_minutes: 15,
          });
        }
      }
    };

    loadSessionConfig();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, clearIdleTimers, clearRefreshTimer]);

  useEffect(() => {
    if (!isAuthenticated || !sessionConfig) return;

    scheduleIdleTimers();
    scheduleTokenRefresh();

    const onActivity = () => resetIdleTimer();
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onActivity, { passive: true });
    });

    return () => {
      clearIdleTimers();
      clearRefreshTimer();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onActivity);
      });
    };
  }, [
    isAuthenticated,
    sessionConfig,
    scheduleIdleTimers,
    scheduleTokenRefresh,
    resetIdleTimer,
    clearIdleTimers,
    clearRefreshTimer,
  ]);

  return {
    showWarning,
    warningMinutes: sessionConfig?.idle_warning_minutes ?? 2,
    stayLoggedIn,
    handleIdleLogout,
  };
}
