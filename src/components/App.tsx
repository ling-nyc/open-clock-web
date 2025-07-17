import { FunctionComponent, useMemo, useState, useRef, useEffect } from 'react';
import parser, { ClockParseResult, ParseResult } from '../parser';
import Clock from '../Clock';
import { TimeProvider, useTimeContext } from '../TimeContext';
import EntryArea from './EntryArea';
import Fullscreenable from './Fullscreenable';
import MultipleClocks from './MultipleClocks';
import DarkModeToggle from './DarkModeToggle';
import { AssetWarningProvider } from '../Clock/AssetWarningContext';
import FontCacheMenu from './FontCacheMenu';
import TimeCustomizer from './TimeCustomizer';

// Helper to make error messages user-friendly
function formatErrorMessage(error: any): string {
  // Try to parse known schema validation errors
  if (typeof error === 'string') {
    try {
      const errObj = JSON.parse(error);
      if (
        errObj.instancePath &&
        errObj.schemaPath &&
        errObj.instancePath.includes('dateTimeFormat')
      ) {
        // Extract layer number if present
        const match = /layers","(\d+)"/.exec(
          JSON.stringify(errObj.instancePath)
        );
        const layer = match ? match[1] : '?';
        return `Layer ${layer}: Invalid or unsupported dateTimeFormat value in textOptions.`;
      }
    } catch {}
  }
  // Fallback: show the error as a string
  return typeof error === 'string' ? error : JSON.stringify(error);
}

const getMessage = (rs: ParseResult[]): string[] =>
  rs.flatMap((r) => {
    if ('errors' in r) {
      return r.errors.map((e) => JSON.stringify(e));
    } else if ('exception' in r) {
      return [r.exception];
    } else {
      return [];
    }
  });

/**
 * Render either a list of clocks or an error message based on parse results.
 *
 * @param parseResults - Results returned by the clock JSON parser.
 * @param height - Height of each clock.
 * @param ratio - Width/height ratio for the clocks.
 */
const ClocksOrError: FunctionComponent<{
  parseResults: ParseResult[];
  height?: number;
  ratio?: number;
}> = ({ parseResults, height = 400, ratio = 0.82 }) => {
  const errors = getMessage(parseResults);
  if (errors.length > 0) {
    return (
      <div className="error">
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          Error loading clock file:
        </div>
        <ul style={{ textAlign: 'left', margin: 0, paddingLeft: 18 }}>
          {errors.map((e, i) => (
            <li key={i}>{formatErrorMessage(e)}</li>
          ))}
        </ul>
        <div style={{ marginTop: 8, fontSize: '0.95em', color: '#666' }}>
          Check your file for typos or unsupported values. Only certain
          dateTimeFormat values are allowed.
        </div>
      </div>
    );
  } else if (parseResults.length === 0) {
    return null;
  } else if (parseResults.length === 1 && 'clock' in parseResults[0]) {
    // If there is exactly one valid clock, render it in fullscreen mode
    return (
      <Fullscreenable>
        <Clock clock={parseResults[0].clock} height={height} ratio={ratio} />
      </Fullscreenable>
    );
  } else {
    // If there are multiple valid clocks, render them all
    const clocks = (parseResults as ClockParseResult[]).map(
      ({ clock }) => clock
    );
    return <MultipleClocks clocks={clocks} height={height} ratio={ratio} />;
  }
};

/**
 * Inner App component that has access to TimeContext
 */
const AppInner: FunctionComponent = () => {
  // State to hold the uploaded JSON strings
  const [jsons, setJsons] = useState<string[]>([]);
  // State for time customizer visibility (only used on mobile)
  const [isTimeCustomizerVisible, setIsTimeCustomizerVisible] = useState(false);
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Memoized parse results from the uploaded JSONs
  const parseResults = useMemo(() => jsons.map(parser), [jsons]);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Access time context
  const { customTime, setCustomTime } = useTimeContext();

  // Helper to check if any clock or error is present
  const hasContent = parseResults.length > 0;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handler to trigger fullscreen on the preview
  const handleFullscreen = () => {
    const node = fullscreenRef.current;
    if (
      node &&
      node.firstElementChild &&
      (node.firstElementChild as any).requestFullscreen
    ) {
      (node.firstElementChild as any).requestFullscreen({
        navigationUI: 'show',
      });
    }
  };

  // Render the app with time context, file input, and clocks or error display
  return (
    <div className="app-container">
      {/* Font cache menu bottom right */}
      <FontCacheMenu />
      {/* Dark mode toggle button at top right */}
      <DarkModeToggle />
      
      {/* Mobile time customizer toggle - top left */}
      {isMobile && hasContent && (
        <button
          className="mobile-time-toggle"
          onClick={() => setIsTimeCustomizerVisible(!isTimeCustomizerVisible)}
          aria-label="Toggle time customizer"
        >
          🕐
        </button>
      )}

      {/* File input area for uploading JSON clock data, with fullscreen handler */}
      <EntryArea
        jsons={jsons}
        setJsons={setJsons}
        onFullscreen={handleFullscreen}
      />

      {/* Main content area with clock preview and time customizer */}
      {hasContent && (
        <div className="main-content">
          {/* Time customizer - left side on desktop, overlay on mobile */}
          <TimeCustomizer
            customTime={customTime}
            onTimeChange={setCustomTime}
            isMobile={isMobile}
            isVisible={isMobile ? isTimeCustomizerVisible : true}
            onToggleVisibility={() => setIsTimeCustomizerVisible(!isTimeCustomizerVisible)}
          />
          
          {/* Clock preview - directly in main content */}
          <div ref={fullscreenRef} className="preview-pill">
            <ClocksOrError parseResults={parseResults} />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Top level application component providing the time context and file input.
 * Handles the state for uploaded JSON clock data and parses it for rendering.
 */
const App: FunctionComponent = () => {
  return (
    <TimeProvider>
      <AssetWarningProvider>
        <AppInner />
      </AssetWarningProvider>
    </TimeProvider>
  );
};

export default App;
