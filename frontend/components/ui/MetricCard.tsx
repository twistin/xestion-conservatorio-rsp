
import React from 'react';
import Card from './Card'; // Assuming Card is in the same directory or adjust path

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string; // Font Awesome class string
  iconBgColor?: string; // Tailwind bg color class e.g. bg-blue-500
  change?: string; // e.g., "+12%" or "-5"
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-primary',
  change,
  changeType = 'neutral',
  description,
  isLoading = false,
}) => {
  const changeColor =
    changeType === 'positive' ? 'text-secondary dark:text-green-400' :
    changeType === 'negative' ? 'text-status-red dark:text-red-400' :
    'text-neutral-medium dark:text-gray-400';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-medium dark:text-gray-400 truncate">{title}</p>
          {isLoading ? (
            <div className="h-8 mt-1 bg-gray-200 dark:bg-neutral-dark rounded w-3/4 animate-pulse"></div>
          ) : (
            <p className="mt-1 text-3xl font-semibold text-neutral-dark dark:text-white">{value}</p>
          )}
        </div>
        {icon && (
          <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor} text-white`}>
            <i className={`${icon} text-xl`}></i>
          </div>
        )}
      </div>
      {(change || description) && !isLoading && (
        <div className="mt-4">
          {change && (
            <p className={`text-sm font-medium ${changeColor}`}>
              {changeType === 'positive' && <i className="fa-solid fa-arrow-up mr-1"></i>}
              {changeType === 'negative' && <i className="fa-solid fa-arrow-down mr-1"></i>}
              {change}
            </p>
          )}
          {description && <p className="text-xs text-neutral-medium dark:text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      {isLoading && (
        <div className="mt-4">
          <div className="h-4 bg-gray-200 dark:bg-neutral-dark rounded w-1/2 animate-pulse"></div>
          {description && <div className="h-3 mt-1 bg-gray-200 dark:bg-neutral-dark rounded w-3/4 animate-pulse"></div>}
        </div>
      )}
    </Card>
  );
};

export default MetricCard;
