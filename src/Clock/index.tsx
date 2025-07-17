import { FunctionComponent, useMemo, useEffect } from 'react';
import { ClockWrapper } from '../open-clock';
import './clock.css';
import Layer from './Layer';
import MaybeWrapper from './MaybeWrapper';
import { useAssets } from './useAssets';
import { useAssetWarnings } from './AssetWarningContext';
import React, { useState } from 'react';
import { addFontToCache } from '../components/FontCacheMenu';
import Toast from '../components/Toast';

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
  // State to track cancelled font imports to prevent reopening
  const [cancelledFonts, setCancelledFonts] = useState<Set<string>>(new Set());
  // State for toast notifications
  const [showFontToast, setShowFontToast] = useState(false);
  const [showImageToast, setShowImageToast] = useState(false);

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
    setCancelledFonts(new Set());
    setShowFontToast(false);
    setShowImageToast(false);
  }, [clock, clearWarnings]);

  // Group warnings by type for display
  const fontWarnings = warnings
    .filter((w) => w.type === 'font')
    .map((w) => w.name);

  const imageWarnings = warnings
    .filter((w) => w.type === 'image')
    .map((w) => w.name);

  // Show toasts when warnings appear
  useEffect(() => {
    if (fontWarnings.length > 0 && !showFontToast) {
      setShowFontToast(true);
    }
  }, [fontWarnings.length, showFontToast]);

  useEffect(() => {
    if (imageWarnings.length > 0 && !showImageToast) {
      setShowImageToast(true);
    }
  }, [imageWarnings.length, showImageToast]);

  // Function to add a missing image warning
  const handleMissingImage = (name: string) => {
    addWarning({ type: 'image', name });
  };

  // Function to add a missing font warning
  const handleMissingFont = (name: string) => {
    // Don't show popup automatically anymore - just add warning
    addWarning({ type: 'font', name });
  };

  // Function to handle font upload from toast
  const handleFontUpload = (fontName: string) => {
    setImportFont(fontName);
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    if (importFont) {
      setCancelledFonts((prev) => new Set(prev).add(importFont));
    }
    setImportFont(null);
    setImportError(null);
  };

  const viewBox = `${-100 * ratio} -100 ${200 * ratio} 200`;

  return (
    <div>
      {/* Missing font import popup */}
      {importFont && (
        <div className="font-import-popup-overlay">
          <div
            className={`font-import-popup${dragActive ? ' drag-active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
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
                  addFontToCache({
                    name: importFont,
                    type: 'truetype',
                    data: base64,
                  });
                  window.dispatchEvent(new Event('fontcachechange'));
                  setImportFont(null);
                  setTimeout(() => window.location.reload(), 100);
                }
              };
              reader.onerror = () =>
                setImportError('Failed to read font file.');
              reader.readAsDataURL(file);
            }}
          >
            <h3>Missing Font: {importFont}</h3>
            <p>
              This clock uses a font that is not installed. Please import a .ttf
              file for <b>{importFont}</b> to display it correctly.
              <br />
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
                    addFontToCache({
                      name: importFont,
                      type: 'truetype',
                      data: base64,
                    });
                    window.dispatchEvent(new Event('fontcachechange'));
                    setImportFont(null);
                    setTimeout(() => window.location.reload(), 100); // reload to refresh font usage
                  }
                };
                reader.onerror = () =>
                  setImportError('Failed to read font file.');
                reader.readAsDataURL(file);
              }}
            />
            {importError && (
              <div className="font-import-error">{importError}</div>
            )}
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {showFontToast && fontWarnings.length > 0 && (
        <Toast
          type="warning"
          title={`Missing ${fontWarnings.length === 1 ? 'Font' : 'Fonts'}`}
          items={fontWarnings}
          onClose={() => setShowFontToast(false)}
          onUpload={handleFontUpload} // Use the correct prop name
        />
      )}
      {showImageToast && imageWarnings.length > 0 && (
        <Toast
          type="error"
          title={`Missing ${imageWarnings.length === 1 ? 'Image' : 'Images'}`}
          items={imageWarnings}
          onClose={() => setShowImageToast(false)}
        />
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
    </div>
  );
};

Clock.defaultProps = {
  ratio: 0.82,
  wrapper: true,
};

export default Clock;
