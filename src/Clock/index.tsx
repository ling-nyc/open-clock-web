import { FunctionComponent, useMemo, useEffect } from 'react';
import { ClockWrapper } from '../open-clock';
import './clock.css';
import Layer from './Layer';

import { useAssets } from './useAssets';
import { useAssetWarnings } from './AssetWarningContext';
import React, { useState } from 'react';
import { addFontToCache } from '../components/FontCacheMenu';
import ToastContainer from '../components/ToastContainer';
import FontUploadModal from '../components/FontUploadModal';
import { useClockWarnings } from './useClockWarnings';

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
  // Use simplified warning system
  const { toasts, setToasts, addWarning, clearAllWarnings } = useClockWarnings();

  // State for font upload modal
  const [importFont, setImportFont] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Calculate width and other layout properties based on canvas settings
  const canvas = clock.clockStandard.canvas;
  const canvasWidth = canvas?.width ?? 199.0;
  const canvasHeight = canvas?.height ?? 242.0;
  const canvasRatio = canvasWidth / canvasHeight;

  // Use canvas ratio if available, otherwise fall back to provided ratio
  const effectiveRatio = canvas ? canvasRatio : ratio;
  const width = effectiveRatio * height;

  const style = useMemo(
    () => ({ width: `${width}px`, height: `${height}px` }),
    [width, height]
  );

  // Get decoded assets from the clock file
  const assets = useAssets(clock?.assets);

  // Clear warnings when the clock changes
  useEffect(() => {
    clearAllWarnings();
  }, [clock, clearAllWarnings]);

  // Handle font upload from toast
  const handleFontUpload = (fontName: string) => {
    setImportFont(fontName);
  };

  // Update toasts to handle font upload
  useEffect(() => {
    setToasts(prev => prev.map(toast =>
      toast.id === 'font-warnings'
        ? { ...toast, onUpload: handleFontUpload }
        : toast
    ));
  }, [setToasts]);

  // Function to add a missing image warning
  const handleMissingImage = (name: string) => {
    addWarning({ type: 'image', name });
  };

  // Function to add a missing font warning
  const handleMissingFont = (name: string) => {
    // Don't show popup automatically anymore - just add warning
    addWarning({ type: 'font', name });
  };

  // Function to handle actual font file upload in modal
  const handleFontFileUpload = async (file: File) => {
    setImportError(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext || '')) {
      setImportError('Only .ttf, .otf, .woff, and .woff2 files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        const base64 = result.split(',')[1];
        addFontToCache({
          name: importFont!,
          type: ext === 'otf' ? 'opentype' : ext === 'woff' ? 'woff' : ext === 'woff2' ? 'woff2' : 'truetype',
          data: base64,
        });
        window.dispatchEvent(new Event('fontcachechange'));
        setImportFont(null);
        setImportError(null);
        setTimeout(() => window.location.reload(), 100);
      }
    };
    reader.onerror = () => setImportError('Failed to read font file.');
    reader.readAsDataURL(file);
  };

  // Close font upload modal
  const handleCloseFontModal = () => {
    setImportFont(null);
    setImportError(null);
  };

  // Calculate viewBox based on canvas dimensions
  const viewBoxWidth = 200 * effectiveRatio;
  const viewBoxHeight = 200;
  const viewBoxX = -100 * effectiveRatio;
  const viewBoxY = -100;
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;

  return (
    <div>
      {/* Font Upload Modal - replaces the old inline popup */}
      <FontUploadModal
        fontName={importFont || ''}
        isOpen={!!importFont}
        onClose={handleCloseFontModal}
        onUpload={handleFontFileUpload}
        error={importError}
      />

      {/* Toast Container - manages multiple toasts and prevents stacking */}
      <ToastContainer toasts={toasts} />

      {wrapper ? (
        <div style={style}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`clockwidget ${canvas?.type ?? 'watchFace'}`}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            {clock.clockStandard.layers.map((layer) => (
              <Layer
                assets={assets}
                ratio={effectiveRatio}
                layer={layer}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                key={layer.zIndex}
                onMissingImage={handleMissingImage}
                onMissingFont={handleMissingFont}
              />
            ))}
          </svg>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`clockwidget ${canvas?.type ?? 'watchFace'}`}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {clock.clockStandard.layers.map((layer) => (
            <Layer
              assets={assets}
              ratio={effectiveRatio}
              layer={layer}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              key={layer.zIndex}
              onMissingImage={handleMissingImage}
              onMissingFont={handleMissingFont}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

Clock.defaultProps = {
  ratio: 0.82,
  wrapper: true,
};

export default Clock;
