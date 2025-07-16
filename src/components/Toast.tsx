import { FunctionComponent, useState, useEffect } from 'react';

interface ToastProps {
  type: 'warning' | 'error';
  title: string;
  items: string[];
  onClose: () => void;
  onUpload?: (item: string) => void; // New prop for handling font uploads
}

/**
 * Animated notification toast that appears in the top-left corner
 */
const Toast: FunctionComponent<ToastProps> = ({ type, title, items, onClose, onUpload }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animate in when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    if (type === 'warning') return '⚠️';
    if (type === 'error') return '❌';
    return '❗';
  };

  const getColorClasses = () => {
    if (type === 'warning') return 'toast-warning';
    if (type === 'error') return 'toast-error';
    return 'toast-info';
  };

  return (
    <div className={`toast ${getColorClasses()} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-header">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-title">{title}</span>
        <div className="toast-actions">
          <button
            className="toast-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            className="toast-close-btn"
            onClick={handleClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="toast-content">
          <div className="toast-items">
            {items.map((item, index) => (
              <div key={index} className="toast-item">
                <span>• {item}</span>
                {type === 'warning' && onUpload && (
                  <button
                    className="toast-upload-btn"
                    onClick={() => onUpload(item)}
                    title={`Upload ${item} font`}
                  >
                    Upload
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
