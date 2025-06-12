
import React from 'react';
import { ToastMessage } from '../../types';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>>;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, setToasts }) => {
  const handleClose = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
