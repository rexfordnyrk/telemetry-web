import { renderHook } from '@testing-library/react';
import { useVisiblePolling } from '../useVisiblePolling';

jest.useFakeTimers();

test('fires on interval while visible', () => {
  const cb = jest.fn();
  renderHook(() => useVisiblePolling(cb, 1000));
  expect(cb).toHaveBeenCalledTimes(0);
  jest.advanceTimersByTime(2500);
  expect(cb).toHaveBeenCalledTimes(2);
});

test('pauses when tab becomes hidden and resumes when visible', () => {
  const cb = jest.fn();
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  renderHook(() => useVisiblePolling(cb, 1000));
  jest.advanceTimersByTime(1500);
  expect(cb).toHaveBeenCalledTimes(1);

  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  jest.advanceTimersByTime(3000);
  expect(cb).toHaveBeenCalledTimes(1); // no new calls

  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  expect(cb).toHaveBeenCalledTimes(2); // immediate fire on visible
});
