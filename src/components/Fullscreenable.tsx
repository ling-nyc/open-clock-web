import { useCallback, useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { ReactNode } from 'react';

/**
 * Fullscreenable component exposes an imperative handle for triggering fullscreen from parent.
 */
const Fullscreenable = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Listen for fullscreen change events
    useEffect(() => {
      const handler = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handler);
      return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Request fullscreen functionality
    const requestFullscreen = useCallback(() => {
      localRef.current?.firstElementChild?.requestFullscreen({
        navigationUI: 'show',
      });
    }, []);

    // Exit fullscreen handler
    const exitFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    return (
      <div ref={localRef} style={{ position: 'relative' }}>
        {isFullscreen && (
          <button
            className="exit-fullscreen-btn"
            onClick={exitFullscreen}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 24,
              transform: 'translateX(-50%)',
              zIndex: 10000,
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.5em 1em',
              fontSize: '1em',
              opacity: 0.92,
            }}
            aria-label="Exit fullscreen"
          >
            Exit Fullscreen
          </button>
        )}
        {children}
      </div>
    );
  }
);

export default Fullscreenable;
