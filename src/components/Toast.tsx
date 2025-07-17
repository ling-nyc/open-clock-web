import React, { useState } from 'react';
// Toast styles are included in the main style.css

interface ToastProps {
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  items: string[];
  onClose: () => void;
  onUpload?: (itemName: string) => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, items, onClose, onUpload }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow fade out animation
  };

  const handleUpload = (itemName: string) => {
    if (onUpload) {
      onUpload(itemName);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-header">
        <span className="toast-title">{title}</span>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="toast-content">
        {items.map((item, index) => (
          <div key={index} className="toast-item">
            <span className="toast-item-name">{item}</span>
            {onUpload && type === 'warning' && (
              <button
                className="toast-upload-btn"
                onClick={() => handleUpload(item)}
                title={`Upload ${item}`}
              >
                Upload
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
