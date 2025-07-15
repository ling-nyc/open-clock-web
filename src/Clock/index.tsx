import { FunctionComponent, useMemo, useEffect } from 'react';
import { ClockWrapper } from '../open-clock';
import './clock.css';
import Layer from './Layer';
import MaybeWrapper from './MaybeWrapper';
import { useAssets } from './useAssets';
import { useAssetWarnings } from './AssetWarningContext';

// Add some basic styling for the warnings
const styles = {
  assetWarnings: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  fontWarning: {
    padding: '8px 12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '4px',
    color: '#856404',
    fontSize: '14px',
    marginBottom: '8px'
  },
  imageWarning: {
    padding: '8px 12px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    fontSize: '14px'
  },
  warningLink: {
    color: '#0366d6',
    textDecoration: 'underline'
  }
};

interface Props {
  clock: ClockWrapper;
  ratio?: number;
  height: number;
  wrapper?: boolean;
}

/**
 * Render an Open Clock Standard definition as an SVG clock.
 */
const Clock: FunctionComponent<Props> = ({
  clock,
  ratio = 0.82,
  height,
  wrapper = true,
}) => {
  // Use the context-based warning system
  const { warnings, addWarning, clearWarnings } = useAssetWarnings();

  // Calculate width and other layout properties
  const width = ratio * height;
  const style = useMemo(
    () => ({ width: `${width}px`, height: `${height}px` }),
    [ratio, height]
  );

  // Get decoded assets from the clock file
  const assets = useAssets(clock?.assets);

  // Clear warnings when the clock changes
  useEffect(() => {
    clearWarnings();
  }, [clock, clearWarnings]);

  // Group warnings by type for display
  const fontWarnings = warnings
    .filter(w => w.type === 'font')
    .map(w => w.name);

  const imageWarnings = warnings
    .filter(w => w.type === 'image')
    .map(w => w.name);

  // Function to add a missing image warning
  const handleMissingImage = (name: string) => {
    addWarning({ type: 'image', name });
  };

  // Function to add a missing font warning
  const handleMissingFont = (name: string) => {
    addWarning({ type: 'font', name });
  };

  const viewBox = `${-100 * ratio} -100 ${200 * ratio} 200`;

  return (
    <div>
      <MaybeWrapper render={wrapper} style={style}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="clockwidget"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {clock.clockStandard.layers.map((layer) => (
            <Layer
              assets={assets}
              ratio={ratio}
              layer={layer}
              key={layer.zIndex}
              onMissingImage={handleMissingImage}
              onMissingFont={handleMissingFont}
            />
          ))}
        </svg>
      </MaybeWrapper>

      {/* Display warnings */}
      <div style={styles.assetWarnings}>
        {/* Font warnings first */}
        {fontWarnings.length > 0 && (
          <div style={styles.fontWarning}>
            <p>
              This file uses {fontWarnings.length === 1 ? 'a font' : `${fontWarnings.length} fonts`} that {fontWarnings.length === 1 ? 'is' : 'are'} not available on your system:
              <strong style={{ fontWeight: 'bold', display: 'inline-block', marginLeft: '4px' }}>
                {fontWarnings.join(', ')}
              </strong>.
              Missing fonts will be replaced with a default font, which may affect the appearance.
            </p>
          </div>
        )}

        {/* Image warnings below, styled in red */}
        {imageWarnings.length > 0 && (
          <div style={styles.imageWarning}>
            <p>
              This file requests {imageWarnings.length === 1 ? 'an image' : `${imageWarnings.length} images`} that {imageWarnings.length === 1 ? 'is' : 'are'} not included:
              <strong style={{ fontWeight: 'bold', display: 'inline-block', marginLeft: '4px' }}>
                {imageWarnings.join(', ')}
              </strong>.
              Check <a
                href="https://github.com/orff/OpenClockStandard"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.warningLink, color: '#007bff' }}
              >
                Open Clock Standard documentation
              </a> for more information on embedding images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Clock.defaultProps = {
  ratio: 0.82,
  wrapper: true,
};

export default Clock;
