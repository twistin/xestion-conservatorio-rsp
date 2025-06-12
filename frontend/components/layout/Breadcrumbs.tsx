
import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem as BreadcrumbItemType } from '../../types'; // Renamed import to avoid conflict
import { ICONS } from '../../constants';

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="mb-4 text-sm text-neutral-medium dark:text-gray-400" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href && !item.current ? (
              <Link to={item.href} className="hover:text-primary dark:hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className={item.current ? "font-semibold text-neutral-dark dark:text-white" : ""}>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
