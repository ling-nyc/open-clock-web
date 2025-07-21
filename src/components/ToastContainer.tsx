import React from 'react';
import Toast, { ToastProps } from './Toast';

export interface ToastData extends Omit<ToastProps, 'index' | 'onClose'> {
  id: string;
  onClose: () => void;
}

interface ToastContainerProps {
  toasts: ToastData[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          items={toast.items}
          onClose={toast.onClose}
          onUpload={toast.onUpload}
          index={index}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
