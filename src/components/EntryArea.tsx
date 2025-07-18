import {
  ChangeEventHandler,
  FunctionComponent,
  useCallback,
  useRef,
} from 'react';
import SampleDropdown from './SampleDropdown';
import React, { useState } from 'react';

interface Props {
  jsons?: string[];
  setJsons: (json: string[]) => void;
  onFullscreen?: () => void;
}

/**
 * Fullscreen icon SVG
 */
const FullscreenIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

/**
 * EntryArea component provides a file picker for loading clock JSON files.
 * It allows users to select one or more files, reads their contents,
 * and passes the loaded JSON strings to the parent via setJsons.
 *
 * Props:
 * - jsons: Previously loaded JSON strings (optional, not used in this component).
 * - setJsons: Callback to update the loaded JSON strings in the parent component.
 * - onFullscreen: Callback to trigger fullscreen mode from the parent component (optional).
 */
const EntryArea: FunctionComponent<Props> = ({ setJsons, onFullscreen }) => {
  // Ref to the hidden file input element
  const pickfileRef = useRef<HTMLInputElement>(null);
  // State for drag-and-drop
  const [dragActive, setDragActive] = useState(false);
  // Handler to trigger the file input dialog
  const onFileClick = useCallback(() => {
    pickfileRef.current?.click();
  }, [pickfileRef]);
  // Handler to process selected files and read their contents as text
  const onFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { files } }) => {
      if (files && files.length > 0) {
        Promise.all(
          Array.prototype.map.call(files, (file) => file.text())
        ).then((jsons) => setJsons(jsons as string[]));
      }
    },
    [setJsons]
  );

  // Handler for drag-and-drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.name.endsWith('.ocs') || f.name.endsWith('.json')
    );
    if (files.length > 0) {
      Promise.all(files.map(file => file.text())).then((jsons) => setJsons(jsons as string[]));
    }
  };

  return (
    <form
      id="jsonForm"
      className={dragActive ? 'drag-active' : ''}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>Clock File (.json, .ocs):</span>
          <button
            type="button"
            onClick={onFileClick}
            style={{
              zIndex: 1,
              padding: '0.4em 1.2em',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontSize: '1em',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
          >
            Import
          </button>
          {/* Fullscreen icon button next to Import */}
          {onFullscreen && (
            <button
              type="button"
              className="fullscreen-icon-btn"
              onClick={onFullscreen}
              aria-label="Fullscreen preview"
            >
              <FullscreenIcon />
            </button>
          )}
        </div>
        {/* Sample Files button below Import, centered */}
        <SampleDropdown onSampleLoad={(text) => setJsons([text])} />
      </div>
      <input
        ref={pickfileRef}
        id="pickfile"
        type="file"
        accept=".ocs,.json,application/json"
        multiple
        onChange={onFileChange}
        className="hidden"
      />
      <br />
    </form>
  );
};

export default EntryArea;
