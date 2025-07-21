import React from 'react';

export interface ToastProps {
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  items: string[];
  onClose: () => void;
  onUpload?: (item: string) => void;
  index?: number; // For positioning multiple toasts
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  items,
  onClose,
  onUpload,
  index = 0
}) => {
  const handleClose = () => {
    onClose();
  };

  // Calculate vertical offset based on toast index
  const topOffset = 20 + (index * 120); // 120px spacing between toasts

  return (
    <div
      className={`toast toast-${type}`}
      style={{
        top: `${topOffset}px`,
        transform: 'none' // Override any existing transforms
      }}
    >
      <div className="toast-header">
        <span className="toast-title">{title}</span>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="toast-content">
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="toast-item">
            <span className="toast-item-name">{item}</span>
            {/* Show upload button only for font warnings */}
            {type === 'warning' && onUpload && (
              <button
                className="toast-upload-btn"
                onClick={() => onUpload(item)}
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
