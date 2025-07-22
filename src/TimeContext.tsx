import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ZonedDateTime } from '@js-joda/core';
import { ReactNode } from 'react';

interface TimeContextType {
  time: ZonedDateTime;
  setCustomTime: (time: ZonedDateTime | null) => void;
  customTime: ZonedDateTime | null;
}

const TimeContext = createContext<TimeContextType>({
  time: ZonedDateTime.now(),
  setCustomTime: () => {},
  customTime: null,
});

/** Access the current `ZonedDateTime` and custom time controls provided by `TimeProvider`. */
export const useTime = () => useContext(TimeContext).time;
export const useTimeContext = () => useContext(TimeContext);
export const TimeConsumer = TimeContext.Consumer;

/**
 * Provides the current time and updates precisely on second boundaries.
 * Also supports custom time override for preview purposes.
 */
export const TimeProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [now, setNow] = useState(() => ZonedDateTime.now());
  const [customTime, setCustomTime] = useState<ZonedDateTime | null>(null);

  useEffect(() => {
    // Only run real-time updates if no custom time is set
    if (customTime) return;

    const tick = () => setNow(ZonedDateTime.now());

    // Initial tick to sync immediately
    tick();

    const delay = 1000 - (Date.now() % 1000);
    let intervalId: NodeJS.Timeout | undefined;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 1000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [customTime]);

  const contextValue = {
    time: customTime || now,
    setCustomTime,
    customTime,
  };

  return <TimeContext.Provider value={contextValue}>{children}</TimeContext.Provider>;
};
