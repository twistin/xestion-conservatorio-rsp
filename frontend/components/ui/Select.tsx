
import React from 'react';
import { SelectOption } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string; // Explicitly define the placeholder prop
  wrapperClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  error,
  wrapperClassName = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  placeholder, // Destructure placeholder
  ...props
}) => {
  const defaultSelectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const baseSelectStyles = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-dark dark:border-neutral-medium dark:text-white`;
  const normalSelectStyles = `border-gray-300 focus:ring-primary focus:border-primary`;
  const errorSelectStyles = `border-status-red focus:ring-status-red focus:border-status-red`;

  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={defaultSelectId} className={`block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <select
        id={defaultSelectId}
        className={`${baseSelectStyles} ${error ? errorSelectStyles : normalSelectStyles} ${selectClassName}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>} {/* Use destructured placeholder */}
        {options.map(option => (
          <option key={option.value.toString()} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={`mt-1 text-xs text-status-red ${errorClassName}`}>{error}</p>}
    </div>
  );
};

export default Select;
