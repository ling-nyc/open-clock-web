import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ZonedDateTime } from '@js-joda/core';
import { ReactNode } from 'react';

const TimeContext = createContext<ZonedDateTime>(ZonedDateTime.now());

/** Access the current `ZonedDateTime` provided by `TimeProvider`. */
export const useTime = () => useContext(TimeContext);
export const TimeConsumer = TimeContext.Consumer;

/**
 * Provides the current time and updates precisely on second boundaries.
 */
export const TimeProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [now, setNow] = useState(() => ZonedDateTime.now());
  useEffect(() => {
    const tick = () => setNow(ZonedDateTime.now());

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
  }, [setNow]);

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>;
};
