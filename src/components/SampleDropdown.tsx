import { useEffect, useState } from 'react';

interface SampleDropdownProps {
  onSampleLoad: (json: string) => void;
}

const SampleDropdown: React.FC<SampleDropdownProps> = ({ onSampleLoad }) => {
  const [sampleFiles, setSampleFiles] = useState<string[]>([]);
  const [showSamples, setShowSamples] = useState(false);

  useEffect(() => {
    fetch('/sample-clocks/index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => setSampleFiles(Array.isArray(list) ? list : []))
      .catch(() => setSampleFiles([]));
  }, []);

  const handleToggle = () => setShowSamples((prev) => !prev);

  const handleSampleClick = async (
    filename: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setShowSamples(false);
    const res = await fetch(`/sample-clocks/${filename}`);
    if (res.ok) {
      const text = await res.text();
      onSampleLoad(text);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        marginTop: '0.5em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <button
        type="button"
        aria-label="Show sample clocks"
        style={{
          background: '#2563eb',
          color: '#fff',
          padding: '0.4em 1.2em',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          fontSize: '1em',
          marginBottom: 0,
          marginTop: 0,
          width: 'auto',
          zIndex: 2,
        }}
        onClick={handleToggle}
      >
        Sample Files
      </button>
      {showSamples && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 10,
            minWidth: 180,
            marginTop: 2,
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseLeave={() => setShowSamples(false)}
        >
          {sampleFiles.length === 0 && (
            <div style={{ padding: '0.5em 1em', color: '#888' }}>
              No samples
            </div>
          )}
          {sampleFiles.map((f) => (
            <button
              key={f}
              type="button"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: '0.5em 1em',
                cursor: 'pointer',
                fontSize: '1em',
                color: '#222',
              }}
              onClick={(event) => handleSampleClick(f, event)}
            >
              {f.replace(/\.ocs$/, '')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleDropdown;
