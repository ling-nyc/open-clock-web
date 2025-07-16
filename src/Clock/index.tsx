import { FunctionComponent, useMemo, useEffect } from 'react';
import { ClockWrapper } from '../open-clock';
import './clock.css';
import Layer from './Layer';
import MaybeWrapper from './MaybeWrapper';
import { useAssets } from './useAssets';
import { useAssetWarnings } from './AssetWarningContext';
import React, { useState } from 'react';
import { addFontToCache } from '../components/FontCacheMenu';

// Add some basic styling for the warnings
const styles = {
  assetWarnings: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  fontWarning: {
    padding: '8px 12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '4px',
    color: '#856404',
    fontSize: '14px',
    marginBottom: '8px',
  },
  imageWarning: {
    padding: '8px 12px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    fontSize: '14px',
  },
  warningLink: {
    color: '#0366d6',
    textDecoration: 'underline',
  },
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

  // State for missing font popup
  const [importFont, setImportFont] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  // State for drag-and-drop
  const [dragActive, setDragActive] = useState(false);

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
    .filter((w) => w.type === 'font')
    .map((w) => w.name);

  const imageWarnings = warnings
    .filter((w) => w.type === 'image')
    .map((w) => w.name);

  // Function to add a missing image warning
  const handleMissingImage = (name: string) => {
    addWarning({ type: 'image', name });
  };

  // Function to add a missing font warning
  const handleMissingFont = (name: string) => {
    addWarning({ type: 'font', name });
    setImportFont(name);
  };

  const viewBox = `${-100 * ratio} -100 ${200 * ratio} 200`;

  return (
    <div>
      {/* Missing font import popup */}
      {importFont && (
        <div className="font-import-popup-overlay">
          <div
            className={`font-import-popup${dragActive ? ' drag-active' : ''}`}
            onDragOver={e => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={e => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={e => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (!file) return;
              const ext = file.name.split('.').pop()?.toLowerCase();
              if (ext !== 'ttf') {
                setImportError('Only .ttf files are supported.');
                return;
              }
              const reader = new FileReader();
              reader.onload = (ev) => {
                const result = ev.target?.result;
                if (typeof result === 'string') {
                  const base64 = result.split(',')[1];
                  addFontToCache({ name: importFont, type: 'truetype', data: base64 });
                  window.dispatchEvent(new Event('fontcachechange'));
                  setImportFont(null);
                  setTimeout(() => window.location.reload(), 100);
                }
              };
              reader.onerror = () => setImportError('Failed to read font file.');
              reader.readAsDataURL(file);
            }}
          >
            <h3>Missing Font: {importFont}</h3>
            <p>
              This clock uses a font that is not installed. Please import a .ttf file for <b>{importFont}</b> to display it correctly.<br />
              <span style={{ fontSize: '0.97em', color: '#888' }}>
                You can also drag and drop a .ttf file here.
              </span>
            </p>
            <input
              type="file"
              accept=".ttf,font/ttf,application/x-font-ttf"
              onChange={async (e) => {
                setImportError(null);
                const file = e.target.files?.[0];
                if (!file) return;
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (ext !== 'ttf') {
                  setImportError('Only .ttf files are supported.');
                  return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const result = ev.target?.result;
                  if (typeof result === 'string') {
                    // base64 encode
                    const base64 = result.split(',')[1];
                    addFontToCache({ name: importFont, type: 'truetype', data: base64 });
                    window.dispatchEvent(new Event('fontcachechange'));
                    setImportFont(null);
                    setTimeout(() => window.location.reload(), 100); // reload to refresh font usage
                  }
                };
                reader.onerror = () => setImportError('Failed to read font file.');
                reader.readAsDataURL(file);
              }}
            />
            {importError && <div className="font-import-error">{importError}</div>}
            <button onClick={() => setImportFont(null)}>Cancel</button>
          </div>
        </div>
      )}
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
              This file uses{' '}
              {fontWarnings.length === 1
                ? 'a font'
                : `${fontWarnings.length} fonts`}{' '}
              that {fontWarnings.length === 1 ? 'is' : 'are'} not available on
              your system:
              <strong
                style={{
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginLeft: '4px',
                }}
              >
                {fontWarnings.join(', ')}
              </strong>
              . Missing fonts will be replaced with a default font, which may
              affect the appearance.
            </p>
          </div>
        )}

        {/* Image warnings below, styled in red */}
        {imageWarnings.length > 0 && (
          <div style={styles.imageWarning}>
            <p>
              This file requests{' '}
              {imageWarnings.length === 1
                ? 'an image'
                : `${imageWarnings.length} images`}{' '}
              that {imageWarnings.length === 1 ? 'is' : 'are'} not included:
              <strong
                style={{
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginLeft: '4px',
                }}
              >
                {imageWarnings.join(', ')}
              </strong>
              . Check{' '}
              <a
                href="https://github.com/orff/OpenClockStandard"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.warningLink, color: '#007bff' }}
              >
                Open Clock Standard documentation
              </a>{' '}
              for more information on embedding images.
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
