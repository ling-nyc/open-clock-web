import React, { useState, useEffect } from 'react';
import { ZonedDateTime } from '@js-joda/core';

interface TimeCustomizerProps {
  onTimeChange: (time: ZonedDateTime | null) => void;
  customTime: ZonedDateTime | null;
  isMobile?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

const TimeCustomizer: React.FC<TimeCustomizerProps> = ({ 
  onTimeChange, 
  customTime, 
  isMobile = false, 
  isVisible = true,
  onToggleVisibility
}) => {
  const [isOpen, setIsOpen] = useState(!isMobile); // Open by default on desktop
  const [customHour, setCustomHour] = useState(12);
  const [customMinute, setCustomMinute] = useState(0);
  const [customSecond, setCustomSecond] = useState(0);
  const [isCustomTime, setIsCustomTime] = useState(false); // Default to live time
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInput, setActiveInput] = useState<'hour' | 'minute' | 'second' | null>(null);

  // Auto-open on desktop, closed on mobile
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  // Helper functions defined before usage
  const updateCustomTimeWithValues = (h: number, m: number, s: number) => {
    const now = ZonedDateTime.now();
    const newCustomTime = now
      .withHour(h)
      .withMinute(m)
      .withSecond(s)
      .withNano(0);
    onTimeChange(newCustomTime);
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
    if ((window as any).timeAnimationInterval) {
      clearInterval((window as any).timeAnimationInterval);
      (window as any).timeAnimationInterval = null;
    }
  };

  const updateCustomTime = () => {
    handleStopAnimation(); // Stop any existing animation
    const now = ZonedDateTime.now();
    const newCustomTime = now
      .withHour(customHour)
      .withMinute(customMinute)
      .withSecond(customSecond)
      .withNano(0);
    onTimeChange(newCustomTime);
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (onToggleVisibility) {
      onToggleVisibility();
    }
  };

  const handleUseRealTime = () => {
    setIsCustomTime(false);
    handleStopAnimation();
    onTimeChange(null);
  };

  const handleUseCustomTime = () => {
    setIsCustomTime(true);
    setIsAnimating(false);
    updateCustomTime();
  };

  const handleStartTime = () => {
    setIsCustomTime(true);
    setIsAnimating(true);
    // Start with current custom time but let it animate
    const baseTime = ZonedDateTime.now()
      .withHour(customHour)
      .withMinute(customMinute)
      .withSecond(customSecond)
      .withNano(0);
    
    let currentTime = baseTime;
    const interval = setInterval(() => {
      currentTime = currentTime.plusSeconds(1);
      onTimeChange(currentTime);
    }, 1000);

    // Store interval ID to clear it later
    (window as any).timeAnimationInterval = interval;
  };

  // Convert time to total seconds for slider
  const timeToSeconds = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
  const secondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  // Mobile-friendly individual input handlers
  const handleHourChange = (value: string) => {
    const hour = Math.max(0, Math.min(23, parseInt(value, 10) || 0));
    setCustomHour(hour);
    if (isCustomTime) updateCustomTimeWithValues(hour, customMinute, customSecond);
  };

  const handleMinuteChange = (value: string) => {
    const minute = Math.max(0, Math.min(59, parseInt(value, 10) || 0));
    setCustomMinute(minute);
    if (isCustomTime) updateCustomTimeWithValues(customHour, minute, customSecond);
  };

  const handleSecondChange = (value: string) => {
    const second = Math.max(0, Math.min(59, parseInt(value, 10) || 0));
    setCustomSecond(second);
    if (isCustomTime) updateCustomTimeWithValues(customHour, customMinute, second);
  };

  const handleTimeInputChange = (value: string) => {
    // Parse HH:MM:SS format
    const timeRegex = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const match = value.match(timeRegex);
    
    if (match) {
      const [, h, m, s] = match;
      const hour = Math.max(0, Math.min(23, parseInt(h, 10)));
      const minute = Math.max(0, Math.min(59, parseInt(m, 10)));
      const second = Math.max(0, Math.min(59, parseInt(s, 10)));

      setCustomHour(hour);
      setCustomMinute(minute);
      setCustomSecond(second);
      
      if (isCustomTime) {
        updateCustomTimeWithValues(hour, minute, second);
      }
    }
  };

  const handleSliderChange = (totalSeconds: number) => {
    const { hours, minutes, seconds } = secondsToTime(totalSeconds);
    setCustomHour(hours);
    setCustomMinute(minutes);
    setCustomSecond(seconds);
    
    if (isCustomTime) {
      updateCustomTimeWithValues(hours, minutes, seconds);
    }
  };

  const presetTimes = [
    { label: '9:00 AM', hour: 9, minute: 0, second: 0 },
    { label: '12:00 PM', hour: 12, minute: 0, second: 0 },
    { label: '3:15 PM', hour: 15, minute: 15, second: 30 },
    { label: '6:30 PM', hour: 18, minute: 30, second: 45 },
    { label: '9:45 PM', hour: 21, minute: 45, second: 15 },
    { label: '11:59 PM', hour: 23, minute: 59, second: 50 },
  ];

  const handlePresetClick = (hour: number, minute: number, second: number) => {
    setCustomHour(hour);
    setCustomMinute(minute);
    setCustomSecond(second);
    setIsCustomTime(true);
    
    updateCustomTimeWithValues(hour, minute, second);
  };

  // Don't render on mobile if not visible
  if (isMobile && !isVisible) {
    return null;
  }

  const formatTime = (h: number, m: number, s: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  return (
    <div className={`time-customizer ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Mobile toggle button with better status display */}
      {isMobile && (
        <button
          type="button"
          className="time-customizer-toggle"
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <span className="time-status-indicator">
            <span className={`status-dot ${isCustomTime ? (isAnimating ? 'animating' : 'custom') : 'live'}`} />
            {isCustomTime ? (isAnimating ? 'Animating' : 'Custom') : 'Live Time'}
          </span>
          <span className="current-time-display">
            {customTime ?
              formatTime(customTime.hour(), customTime.minute(), customTime.second()) :
              'Real Time'
            }
          </span>
          <span className={`time-customizer-arrow ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>
      )}

      {/* Desktop header */}
      {!isMobile && (
        <div className="time-customizer-header">
          <h3>Time Controls</h3>
        </div>
      )}
      
      {/* Content - always visible on desktop, toggleable on mobile */}
      {(isOpen || !isMobile) && (
        <div className="time-customizer-content">
          {/* Mode toggle buttons with clearer labels */}
          <div className="time-mode-controls">
            <button
              type="button"
              className={`time-mode-btn ${!isCustomTime ? 'active' : ''}`}
              onClick={handleUseRealTime}
            >
              <span className="mode-icon">🕐</span>
              Live Time
            </button>
            <button
              type="button"
              className={`time-mode-btn ${isCustomTime && !isAnimating ? 'active' : ''}`}
              onClick={handleUseCustomTime}
            >
              <span className="mode-icon">⏰</span>
              Set Time
            </button>
          </div>
          
          {/* Time input controls - different layouts for mobile vs desktop */}
          <div className="time-input-section">
            {isMobile ? (
              // Mobile: Individual number inputs with large touch targets
              <div className="mobile-time-inputs">
                <label className="time-input-group">
                  <span className="time-input-label">Hour</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={customHour.toString().padStart(2, '0')}
                    onChange={(e) => handleHourChange(e.target.value)}
                    className={`mobile-time-input ${activeInput === 'hour' ? 'active' : ''}`}
                    onFocus={() => setActiveInput('hour')}
                    onBlur={() => setActiveInput(null)}
                    disabled={!isCustomTime}
                  />
                </label>
                <span className="time-separator">:</span>
                <label className="time-input-group">
                  <span className="time-input-label">Min</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customMinute.toString().padStart(2, '0')}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className={`mobile-time-input ${activeInput === 'minute' ? 'active' : ''}`}
                    onFocus={() => setActiveInput('minute')}
                    onBlur={() => setActiveInput(null)}
                    disabled={!isCustomTime}
                  />
                </label>
                <span className="time-separator">:</span>
                <label className="time-input-group">
                  <span className="time-input-label">Sec</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSecond.toString().padStart(2, '0')}
                    onChange={(e) => handleSecondChange(e.target.value)}
                    className={`mobile-time-input ${activeInput === 'second' ? 'active' : ''}`}
                    onFocus={() => setActiveInput('second')}
                    onBlur={() => setActiveInput(null)}
                    disabled={!isCustomTime}
                  />
                </label>
              </div>
            ) : (
              // Desktop: Single text input
              <div className="single-time-input">
                <input
                  type="text"
                  placeholder="HH:MM:SS"
                  value={formatTime(customHour, customMinute, customSecond)}
                  onChange={(e) => handleTimeInputChange(e.target.value)}
                  className="time-text-input"
                  pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  disabled={!isCustomTime}
                />
              </div>
            )}

            {/* Time slider - hidden on mobile for better UX */}
            {!isMobile && (
              <div className="time-slider-section">
                <input
                  type="range"
                  min="0"
                  max="86399"
                  value={timeToSeconds(customHour, customMinute, customSecond)}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                  className="time-slider"
                  disabled={!isCustomTime}
                />
              </div>
            )}
          </div>

          {/* Animation controls with better mobile layout */}
          <div className="animation-controls">
            <button
              type="button"
              className={`animation-btn ${isAnimating ? 'active' : ''}`}
              onClick={isAnimating ? handleStopAnimation : handleStartTime}
              title={isAnimating ? 'Pause time animation' : 'Start time animation from current time'}
              disabled={!isCustomTime}
            >
              <span className="animation-icon">
                {isAnimating ? '⏸️' : '▶️'}
              </span>
              {isAnimating ? 'Pause' : 'Animate'}
            </button>
          </div>

          {/* Quick presets with more intuitive times for mobile */}
          <div className="time-presets">
            <label htmlFor="preset-buttons">Quick Times:</label>
            <div id="preset-buttons" className={`preset-buttons ${isMobile ? 'mobile-presets' : ''}`}>
              {presetTimes.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePresetClick(preset.hour, preset.minute, preset.second)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeCustomizer;

