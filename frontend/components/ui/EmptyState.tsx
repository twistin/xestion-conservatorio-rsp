
import React from 'react';
import { ICONS } from '../../constants';

interface EmptyStateProps {
  icon?: string; // Font Awesome class string
  title: string;
  description?: string;
  action?: React.ReactNode; // e.g., a Button component
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`text-center p-8 md:p-12 border-2 border-dashed border-gray-300 dark:border-neutral-medium rounded-lg bg-white dark:bg-dark-surface ${className}`}>
      {icon && (
        <div className="mb-4">
          <i className={`${icon} text-5xl text-neutral-medium dark:text-gray-500`}></i>
        </div>
      )}
      <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-2 font-display">{title}</h3>
      {description && <p className="text-neutral-medium dark:text-gray-400 mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
