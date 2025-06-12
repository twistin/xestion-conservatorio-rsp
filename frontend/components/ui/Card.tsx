
import React from 'react';

interface CardProps {
  title?: string;
  titleClassName?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, titleClassName="", headerActions, children, className = '', footer, footerClassName="", onClick }) => {
  const cardClasses = `bg-white dark:bg-dark-surface shadow-lg rounded-xl overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || headerActions) && (
        <div className={`px-6 py-4 border-b border-neutral-light dark:border-neutral-medium flex justify-between items-center ${titleClassName}`}>
          {title && <h3 className="text-lg font-semibold font-display text-neutral-dark dark:text-white">{title}</h3>}
          {headerActions && <div className="flex space-x-2">{headerActions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className={`px-6 py-4 border-t border-neutral-light dark:border-neutral-medium ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
