
import React from 'react';
import { BreadcrumbItem } from '../../types';
import Breadcrumbs from './Breadcrumbs';

interface PageContainerProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, breadcrumbs, headerActions, children, className = '' }) => {
  return (
    <div className={`container mx-auto ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold font-display text-neutral-dark dark:text-white mb-2 sm:mb-0">{title}</h1>
        {headerActions && <div className="flex space-x-2">{headerActions}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageContainer;
