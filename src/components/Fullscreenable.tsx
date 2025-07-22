import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface FullscreenRef {
  enterFullscreen: () => Promise<boolean>;
  exitFullscreen: () => Promise<boolean>;
  isFullscreen: boolean;
}

interface FullscreenProps {
  children: React.ReactNode;
}

/**
 * Fullscreenable component exposes an imperative handle for triggering fullscreen from parent.
 */
const Fullscreenable = forwardRef<FullscreenRef, FullscreenProps>(
  ({ children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Enter fullscreen mode
    const enterFullscreen = useCallback(async (): Promise<boolean> => {
      if (!containerRef.current) return false;

      try {
        await containerRef.current.requestFullscreen();
        return true;
      } catch (error) {
        console.warn('Fullscreen failed:', error);
        return false;
      }
    }, []);

    // Exit fullscreen mode
    const exitFullscreen = useCallback(async (): Promise<boolean> => {
      if (!document.fullscreenElement) return true;

      try {
        await document.exitFullscreen();
        return true;
      } catch (error) {
        console.warn('Exit fullscreen failed:', error);
        return false;
      }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () =>
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle ESC key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          exitFullscreen();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, exitFullscreen]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        enterFullscreen,
        exitFullscreen,
        isFullscreen,
      }),
      [enterFullscreen, exitFullscreen, isFullscreen]
    );

    return (
      <div
        ref={containerRef}
        className={`fullscreen-container ${
          isFullscreen ? 'is-fullscreen' : ''
        }`}
      >
        {children}
        {isFullscreen && (
          <button
            className="fullscreen-exit-button"
            onClick={exitFullscreen}
            aria-label="Exit fullscreen"
          >
            Exit Fullscreen
          </button>
        )}
      </div>
    );
  }
);

Fullscreenable.displayName = 'Fullscreenable';

export default Fullscreenable;