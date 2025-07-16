import { FunctionComponent, useState, useEffect } from 'react';
import { ZonedDateTime, LocalTime, LocalDate } from '@js-joda/core';

interface TimeCustomizerProps {
  customTime: ZonedDateTime | null;
  onTimeChange: (time: ZonedDateTime | null) => void;
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * Time customization menu that allows users to set a specific time for preview
 */
const TimeCustomizer: FunctionComponent<TimeCustomizerProps> = ({
  customTime,
  onTimeChange,
  isVisible,
  onToggle,
}) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [useRealTime, setUseRealTime] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update local state when customTime changes
  useEffect(() => {
    if (customTime) {
      setHours(customTime.hour());
      setMinutes(customTime.minute());
      setSeconds(customTime.second());
      setUseRealTime(false);
    } else {
      setUseRealTime(true);
      setIsPlaying(false);
    }
  }, [customTime]);

  // Handle animated time updates when playing
  useEffect(() => {
    if (!isPlaying || useRealTime) return;

    const interval = setInterval(() => {
      const now = ZonedDateTime.now();
      const customDate = LocalDate.of(now.year(), now.month(), now.dayOfMonth());
      let newSeconds = seconds + 1;
      let newMinutes = minutes;
      let newHours = hours;

      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes += 1;
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
          if (newHours >= 24) {
            newHours = 0;
          }
        }
      }

      setSeconds(newSeconds);
      setMinutes(newMinutes);
      setHours(newHours);

      const customLocalTime = LocalTime.of(newHours, newMinutes, newSeconds);
      const newTime = ZonedDateTime.of(customDate, customLocalTime, now.zone());
      onTimeChange(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, useRealTime, hours, minutes, seconds, onTimeChange]);

  const handleTimeChange = () => {
    if (useRealTime) {
      onTimeChange(null);
      setIsPlaying(false);
    } else {
      const now = ZonedDateTime.now();
      const customDate = LocalDate.of(now.year(), now.month(), now.dayOfMonth());
      const customLocalTime = LocalTime.of(hours, minutes, seconds);
      const newTime = ZonedDateTime.of(customDate, customLocalTime, now.zone());
      onTimeChange(newTime);
    }
  };

  useEffect(() => {
    handleTimeChange();
  }, [hours, minutes, seconds, useRealTime]);

  const handlePresetTime = (h: number, m: number = 0, s: number = 0) => {
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setUseRealTime(false);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (useRealTime) return;
    setIsPlaying(!isPlaying);
  };

  const handleModeChange = (realTime: boolean) => {
    setUseRealTime(realTime);
    setIsPlaying(false);
  };

  // Mobile version with toggle button
  if (isMobile) {
    return (
      <>
        {/* Toggle button */}
        <button
          className="time-customizer-toggle"
          onClick={onToggle}
          title="Customize preview time"
        >
          🕐
        </button>

        {/* Menu panel */}
        {isVisible && (
          <div className="time-customizer-panel time-customizer-mobile">
            <h3>Preview Time</h3>

            <div className="time-mode-selector">
              <label>
                <input
                  type="radio"
                  checked={useRealTime}
                  onChange={() => handleModeChange(true)}
                />
                Real Time
              </label>
              <label>
                <input
                  type="radio"
                  checked={!useRealTime}
                  onChange={() => handleModeChange(false)}
                />
                Custom Time
              </label>
            </div>

            {!useRealTime && (
              <>
                <div className="time-controls">
                  <div className="time-inputs">
                    <div className="time-input-group">
                      <label>Hours:</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                        disabled={isPlaying}
                      />
                    </div>
                    <div className="time-input-group">
                      <label>Minutes:</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                        disabled={isPlaying}
                      />
                    </div>
                    <div className="time-input-group">
                      <label>Seconds:</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                        disabled={isPlaying}
                      />
                    </div>
                  </div>

                  <div className="play-control">
                    <button
                      className={`play-button ${isPlaying ? 'playing' : ''}`}
                      onClick={handlePlayPause}
                      title={isPlaying ? 'Pause time' : 'Start time animation'}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <span className="play-label">
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                  </div>
                </div>

                <div className="time-presets">
                  <h4>Quick Presets:</h4>
                  <div className="preset-buttons">
                    <button onClick={() => handlePresetTime(12, 0, 0)}>12:00</button>
                    <button onClick={() => handlePresetTime(3, 0, 0)}>3:00</button>
                    <button onClick={() => handlePresetTime(6, 0, 0)}>6:00</button>
                    <button onClick={() => handlePresetTime(9, 0, 0)}>9:00</button>
                    <button onClick={() => handlePresetTime(10, 10, 0)}>10:10</button>
                    <button onClick={() => handlePresetTime(2, 20, 0)}>2:20</button>
                    <button onClick={() => handlePresetTime(4, 40, 0)}>4:40</button>
                    <button onClick={() => handlePresetTime(8, 20, 0)}>8:20</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  // Desktop version - always visible with all controls shown
  return (
    <div className="time-customizer-panel time-customizer-desktop">
      <h3>Preview Time</h3>

      <div className="time-mode-selector">
        <label>
          <input
            type="radio"
            checked={useRealTime}
            onChange={() => handleModeChange(true)}
          />
          Real Time
        </label>
        <label>
          <input
            type="radio"
            checked={!useRealTime}
            onChange={() => handleModeChange(false)}
          />
          Custom Time
        </label>
      </div>

      {/* Always show time controls */}
      <div className="time-controls">
        <div className="time-inputs">
          <div className="time-input-group">
            <label>Hours:</label>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              disabled={isPlaying || useRealTime}
            />
          </div>
          <div className="time-input-group">
            <label>Minutes:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              disabled={isPlaying || useRealTime}
            />
          </div>
          <div className="time-input-group">
            <label>Seconds:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              disabled={isPlaying || useRealTime}
            />
          </div>
        </div>

        {/* Always show play control */}
        <div className="play-control">
          <button
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            disabled={useRealTime}
            title={isPlaying ? 'Pause time' : 'Start time animation'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <span className="play-label">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Always show presets */}
      <div className="time-presets">
        <h4>Quick Presets:</h4>
        <div className="preset-buttons">
          <button onClick={() => handlePresetTime(12, 0, 0)} disabled={useRealTime}>12:00</button>
          <button onClick={() => handlePresetTime(3, 0, 0)} disabled={useRealTime}>3:00</button>
          <button onClick={() => handlePresetTime(6, 0, 0)} disabled={useRealTime}>6:00</button>
          <button onClick={() => handlePresetTime(9, 0, 0)} disabled={useRealTime}>9:00</button>
          <button onClick={() => handlePresetTime(10, 10, 0)} disabled={useRealTime}>10:10</button>
          <button onClick={() => handlePresetTime(2, 20, 0)} disabled={useRealTime}>2:20</button>
          <button onClick={() => handlePresetTime(4, 40, 0)} disabled={useRealTime}>4:40</button>
          <button onClick={() => handlePresetTime(8, 20, 0)} disabled={useRealTime}>8:20</button>
        </div>
      </div>
    </div>
  );
};

export default TimeCustomizer;
