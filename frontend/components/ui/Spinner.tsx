
import React from 'react';
import { ICONS } from '../../constants';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind text color class, e.g., 'text-primary'
  className?: string;
  fullPage?: boolean;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'text-primary dark:text-accent', 
  className = '',
  fullPage = false,
  message
}) => {
  const sizeClasses = {
    sm: 'text-xl', // fa-lg
    md: 'text-3xl', // fa-2x
    lg: 'text-5xl', // fa-3x
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-dark-bg/50 z-[100]">
        <i className={`${ICONS.loading} ${sizeClasses[size]} ${color} ${className} animate-spin-slow`}></i>
        {message && <p className={`mt-4 text-lg font-medium ${color.replace('text-', 'text-')}`}>{message}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
        <i className={`${ICONS.loading} ${sizeClasses[size]} ${color} animate-spin-slow`}></i>
        {message && <p className={`mt-2 text-sm ${color.replace('text-', 'text-')}`}>{message}</p>}
    </div>
  );
};

export default Spinner;
