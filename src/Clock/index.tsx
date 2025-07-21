import { FunctionComponent, useMemo, useEffect } from 'react';
import { ClockWrapper } from '../open-clock';
import './clock.css';
import Layer from './Layer';
import MaybeWrapper from './MaybeWrapper';
import { useAssets } from './useAssets';
import { useAssetWarnings } from './AssetWarningContext';
import React, { useState } from 'react';
import { addFontToCache } from '../components/FontCacheMenu';
import ToastContainer, { ToastData } from '../components/ToastContainer';
import FontUploadModal from '../components/FontUploadModal';

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
  // State to track cancelled font imports to prevent reopening
  const [, setCancelledFonts] = useState<Set<string>>(new Set());
  // State for managing toast notifications
  const [toasts, setToasts] = useState<ToastData[]>([]);

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
    setToasts([]); // Clear all toasts when clock changes
  }, [clock, clearWarnings]);

  // Group warnings by type for display
  const fontWarnings = warnings
    .filter((w) => w.type === 'font')
    .map((w) => w.name);

  const imageWarnings = warnings
    .filter((w) => w.type === 'image')
    .map((w) => w.name);

  // Function to handle font upload from toast (opens modal)
  const handleFontUpload = (fontName: string) => {
    setImportFont(fontName);
  };

  // Manage toasts when warnings appear
  useEffect(() => {
    const newToasts: ToastData[] = [];

    // Add font warning toast if there are font warnings
    if (fontWarnings.length > 0) {
      const fontToastExists = toasts.some(t => t.id === 'font-warnings');
      if (!fontToastExists) {
        newToasts.push({
          id: 'font-warnings',
          type: 'warning',
          title: `Missing ${fontWarnings.length === 1 ? 'Font' : 'Fonts'}`,
          items: fontWarnings,
          onClose: () => {
            setToasts(prev => prev.filter(t => t.id !== 'font-warnings'));
          },
          onUpload: handleFontUpload
        });
      }
    }

    // Add image warning toast if there are image warnings
    if (imageWarnings.length > 0) {
      const imageToastExists = toasts.some(t => t.id === 'image-warnings');
      if (!imageToastExists) {
        newToasts.push({
          id: 'image-warnings',
          type: 'error',
          title: `Missing ${imageWarnings.length === 1 ? 'Image' : 'Images'}`,
          items: imageWarnings,
          onClose: () => {
            setToasts(prev => prev.filter(t => t.id !== 'image-warnings'));
          }
        });
      }
    }

    if (newToasts.length > 0) {
      setToasts(prev => [...prev, ...newToasts]);
    }
  }, [fontWarnings.length, imageWarnings.length]);

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

  // Function to close font upload modal
  const handleCloseFontModal = () => {
    if (importFont) {
      setCancelledFonts((prev) => new Set(prev).add(importFont));
    }
    setImportFont(null);
    setImportError(null);
  };

  const viewBox = `${-100 * ratio} -100 ${200 * ratio} 200`;

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
