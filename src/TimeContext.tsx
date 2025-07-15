import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ZonedDateTime } from '@js-joda/core';

const TimeContext = createContext<ZonedDateTime>(ZonedDateTime.now());

/**
 * Access the current time updated every second.
 */
export const useTime = () => useContext(TimeContext);
export const TimeConsumer = TimeContext.Consumer;

/**
 * Provide the current time to descendant components and update it every second.
 */
export const TimeProvider: FunctionComponent = ({ children }) => {
  const [now, setNow] = useState(() => ZonedDateTime.now());
  useEffect(() => {
    // TODO: synchronize so that the first update occurs at 0ms after a new second
    const intervalId = setInterval(() => {
      setNow(ZonedDateTime.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setNow]);

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>;
};
