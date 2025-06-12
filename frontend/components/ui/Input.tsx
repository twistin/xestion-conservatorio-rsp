
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  error,
  wrapperClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  iconLeft,
  iconRight,
  ...props
}) => {
  const defaultInputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const baseInputStyles = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-dark dark:border-neutral-medium dark:text-white dark:placeholder-gray-500`;
  const normalInputStyles = `border-gray-300 focus:ring-primary focus:border-primary`;
  const errorInputStyles = `border-status-red focus:ring-status-red focus:border-status-red`;

  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={defaultInputId} className={`block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-medium dark:text-gray-400">
                {iconLeft}
            </div>
        )}
        <input
          id={defaultInputId}
          type={type}
          className={`${baseInputStyles} ${error ? errorInputStyles : normalInputStyles} ${iconLeft ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} ${inputClassName}`}
          {...props}
        />
        {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-medium dark:text-gray-400">
                {iconRight}
            </div>
        )}
      </div>
      {error && <p className={`mt-1 text-xs text-status-red ${errorClassName}`}>{error}</p>}
    </div>
  );
};

export default Input;
