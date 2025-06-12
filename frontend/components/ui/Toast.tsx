
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';
import { ICONS, TOAST_DEFAULT_DURATION } from '../../constants';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || TOAST_DEFAULT_DURATION);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const iconClasses = {
    success: ICONS.success + ' text-secondary',
    error: ICONS.error + ' text-status-red',
    info: ICONS.info + ' text-status-blue',
    warning: ICONS.warning + ' text-status-yellow',
  };

  const borderClasses = {
    success: 'border-secondary',
    error: 'border-status-red',
    info: 'border-status-blue',
    warning: 'border-status-yellow',
  }

  return (
    <div
      className={`relative flex items-start p-4 mb-3 w-full max-w-sm bg-white dark:bg-dark-surface rounded-lg shadow-xl border-l-4 ${borderClasses[toast.type]} transform transition-all duration-300 ease-out animate-toast-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        <i className={`${iconClasses[toast.type]} text-xl`}></i>
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-neutral-dark dark:text-neutral-light">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-3 p-1 rounded-full text-neutral-medium dark:text-gray-400 hover:bg-neutral-light dark:hover:bg-neutral-dark focus:outline-none"
        aria-label="Close toast"
      >
        <i className="fa-solid fa-times text-sm"></i>
      </button>
      {/* The 'animate-toast-slide-in' class and its keyframes should be defined in a global CSS file or Tailwind config.
          Example of how it might be defined in a global CSS:
          @keyframes toast-slide-in {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-toast-slide-in {
            animation: toast-slide-in 0.3s ease-out forwards;
          }
      */}
    </div>
  );
};

export default Toast;
