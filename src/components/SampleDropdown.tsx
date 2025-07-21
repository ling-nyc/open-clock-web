import { useEffect, useState } from 'react';

interface SampleFile {
  filename: string;
  name: string;
}

interface SampleDropdownProps {
  onSampleLoad: (json: string) => void;
}

const SampleDropdown: React.FC<SampleDropdownProps> = ({ onSampleLoad }) => {
  const [sampleFiles, setSampleFiles] = useState<SampleFile[]>([]);
  const [showSamples, setShowSamples] = useState(false);

  useEffect(() => {
    fetch('/sample-clocks/index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        // Handle both old format (string[]) and new format (SampleFile[])
        if (Array.isArray(list)) {
          const samples = list.map(item =>
            typeof item === 'string'
              ? { filename: item, name: item.replace(/\.ocs$/, '') }
              : item
          );
          setSampleFiles(samples);
        } else {
          setSampleFiles([]);
        }
      })
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
    <div className="sample-dropdown">
      <button
        type="button"
        aria-label="Show sample clocks"
        className="sample-dropdown__button"
        onClick={handleToggle}
      >
        Sample Files
      </button>
      {showSamples && (
        <div
          className="sample-dropdown__menu"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseLeave={() => setShowSamples(false)}
        >
          {sampleFiles.length === 0 && (
            <div className="sample-dropdown__empty">
              No samples
            </div>
          )}
          {sampleFiles.map((sample) => (
            <button
              key={sample.filename}
              type="button"
              className="sample-dropdown__item"
              onClick={(event) => handleSampleClick(sample.filename, event)}
            >
              {sample.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleDropdown;
