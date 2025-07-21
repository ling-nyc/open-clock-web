import React from 'react';

interface FontUploadModalProps {
  fontName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  error?: string | null;
}

const FontUploadModal: React.FC<FontUploadModalProps> = ({
  fontName,
  isOpen,
  onClose,
  onUpload,
  error
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content font-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Missing Font</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>
            The font <code className="font-name">{fontName}</code> is missing.
          </p>
          <p>Please select a font file to upload:</p>
          <input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFileChange}
            className="file-input"
          />
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontUploadModal;
