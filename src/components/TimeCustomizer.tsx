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

  // Auto-open on desktop, closed on mobile
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleUseRealTime = () => {
    setIsCustomTime(false);
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
    const customTime = now
      .withHour(customHour)
      .withMinute(customMinute)
      .withSecond(customSecond)
      .withNano(0);
    onTimeChange(customTime);
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'second', value: number) => {
    if (type === 'hour') {
      setCustomHour(value);
    } else if (type === 'minute') {
      setCustomMinute(value);
    } else {
      setCustomSecond(value);
    }
    
    if (isCustomTime) {
      const now = ZonedDateTime.now();
      const customTime = now
        .withHour(type === 'hour' ? value : customHour)
        .withMinute(type === 'minute' ? value : customMinute)
        .withSecond(type === 'second' ? value : customSecond)
        .withNano(0);
      onTimeChange(customTime);
    }
  };

  // Convert time to total seconds for slider
  const timeToSeconds = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
  const secondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const handleTimeInputChange = (value: string) => {
    // Parse HH:MM:SS format
    const timeRegex = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const match = value.match(timeRegex);
    
    if (match) {
      const [, h, m, s] = match;
      const hour = Math.max(0, Math.min(23, parseInt(h)));
      const minute = Math.max(0, Math.min(59, parseInt(m)));
      const second = Math.max(0, Math.min(59, parseInt(s)));
      
      setCustomHour(hour);
      setCustomMinute(minute);
      setCustomSecond(second);
      
      if (isCustomTime) {
        const now = ZonedDateTime.now();
        const customTime = now
          .withHour(hour)
          .withMinute(minute)
          .withSecond(second)
          .withNano(0);
        onTimeChange(customTime);
      }
    }
  };

  const handleSliderChange = (totalSeconds: number) => {
    const { hours, minutes, seconds } = secondsToTime(totalSeconds);
    setCustomHour(hours);
    setCustomMinute(minutes);
    setCustomSecond(seconds);
    
    if (isCustomTime) {
      const now = ZonedDateTime.now();
      const customTime = now
        .withHour(hours)
        .withMinute(minutes)
        .withSecond(seconds)
        .withNano(0);
      onTimeChange(customTime);
    }
  };

  const presetTimes = [
    { label: '12:00:00', hour: 12, minute: 0, second: 0 },
    { label: '3:15:30', hour: 15, minute: 15, second: 30 },
    { label: '6:30:45', hour: 18, minute: 30, second: 45 },
    { label: '9:45:15', hour: 21, minute: 45, second: 15 },
    { label: '10:10:10', hour: 10, minute: 10, second: 10 },
  ];

  const handlePresetClick = (hour: number, minute: number, second: number) => {
    setCustomHour(hour);
    setCustomMinute(minute);
    setCustomSecond(second);
    setIsCustomTime(true);
    
    const now = ZonedDateTime.now();
    const customTime = now
      .withHour(hour)
      .withMinute(minute)
      .withSecond(second)
      .withNano(0);
    onTimeChange(customTime);
  };

  // Don't render on mobile if not visible
  if (isMobile && !isVisible) {
    return null;
  }

  return (
    <div className={`time-customizer ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Desktop: always show content, Mobile: show toggle */}
      {isMobile ? (
        <button
          className="time-customizer-toggle"
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <span className={`time-customizer-arrow ${isOpen ? 'open' : ''}`}>
            ▶
          </span>
          Time: {customTime ? 
            `${customTime.hour().toString().padStart(2, '0')}:${customTime.minute().toString().padStart(2, '0')}:${customTime.second().toString().padStart(2, '0')}` : 
            'Live'
          }
        </button>
      ) : (
        <div className="time-customizer-header">
          <h3>Time Controls</h3>
        </div>
      )}
      
      {/* Content - always visible on desktop, toggleable on mobile */}
      {(isOpen || !isMobile) && (
        <div className="time-customizer-content">
          <div className="time-mode-controls">
            <button
              className={`time-mode-btn ${!isCustomTime ? 'active' : ''}`}
              onClick={handleUseRealTime}
            >
              Live Time
            </button>
            <button
              className={`time-mode-btn ${isCustomTime && !isAnimating ? 'active' : ''}`}
              onClick={handleUseCustomTime}
            >
              Custom Time
            </button>
          </div>
          
          {/* Always show custom time controls */}
          <div className="time-input-section">
            <label className="time-input-label">Set Time:</label>
            
            {/* Single Time Input Field */}
            <div className="single-time-input">
              <input
                type="text"
                placeholder="HH:MM:SS"
                value={`${customHour.toString().padStart(2, '0')}:${customMinute.toString().padStart(2, '0')}:${customSecond.toString().padStart(2, '0')}`}
                onChange={(e) => handleTimeInputChange(e.target.value)}
                className="time-text-input"
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                disabled={!isCustomTime}
              />
            </div>

            {/* Time Slider */}
            <div className="time-slider-section">
              <label className="slider-label">Or drag to set time:</label>
              <input
                type="range"
                min="0"
                max="86399"
                value={timeToSeconds(customHour, customMinute, customSecond)}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="time-slider"
                disabled={!isCustomTime}
              />
              <div className="slider-time-display">
                {`${customHour.toString().padStart(2, '0')}:${customMinute.toString().padStart(2, '0')}:${customSecond.toString().padStart(2, '0')}`}
              </div>
            </div>
          </div>

          {/* Start/Stop Animation Button */}
          <div className="animation-controls">
            <button
              className={`animation-btn ${isAnimating ? 'active' : ''}`}
              onClick={isAnimating ? handleStopAnimation : handleStartTime}
              title={isAnimating ? 'Pause time animation' : 'Start time animation from current time'}
              disabled={!isCustomTime}
            >
              <span className="animation-icon">
                {isAnimating ? '⏸️' : '▶️'}
              </span>
              {isAnimating ? 'Pause' : 'Start'}
            </button>
          </div>
          
          <div className="time-presets">
            <label>Quick Presets:</label>
            <div className="preset-buttons">
              {presetTimes.map((preset, index) => (
                <button
                  key={index}
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