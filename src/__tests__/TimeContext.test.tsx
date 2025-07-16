import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeProvider, useTime } from '../TimeContext';

jest.useFakeTimers();

test('time updates every second', () => {
  const { result } = renderHook(() => useTime(), { wrapper: TimeProvider });
  const first = result.current;

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(result.current.equals(first)).toBe(false);
});
