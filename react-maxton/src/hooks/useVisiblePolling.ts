import { useEffect } from 'react';

export function useVisiblePolling(cb: () => void, intervalMs: number): void {
  useEffect(() => {
    let id: number | undefined;
    const start = () => { id = window.setInterval(cb, intervalMs); };
    const stop = () => { if (id !== undefined) { window.clearInterval(id); id = undefined; } };
    const onVis = () => {
      if (document.visibilityState === 'visible') { cb(); start(); }
      else { stop(); }
    };
    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [cb, intervalMs]);
}
