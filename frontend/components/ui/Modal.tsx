
import React, { useEffect } from 'react';
import { ICONS } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-dark-surface rounded-lg shadow-xl flex flex-col ${sizeClasses[size]} w-full ${size === 'full' ? 'h-full' : 'max-h-[90vh]'} overflow-hidden transform transition-all duration-300 ease-out scale-95 animate-modal-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-light dark:border-neutral-medium">
          <h2 className="text-xl font-semibold font-display text-neutral-dark dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-medium dark:text-gray-400 hover:bg-neutral-light dark:hover:bg-neutral-dark focus:outline-none"
            aria-label="Pechar modal"
          >
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-light dark:border-neutral-medium bg-gray-50 dark:bg-neutral-dark/30">
            {footer}
          </div>
        )}
      </div>
      {/* The 'animate-modal-scale-in' class and its keyframes should be defined in a global CSS file or Tailwind config.
          Example of how it might be defined in a global CSS:
          @keyframes modal-scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-modal-scale-in {
            animation: modal-scale-in 0.2s ease-out forwards;
          }
      */}
    </div>
  );
};

export default Modal;