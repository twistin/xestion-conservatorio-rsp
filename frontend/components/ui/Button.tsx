
import React from 'react';
import { ICONS } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: string; // Font Awesome class
  iconRight?: string; // Font Awesome class
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft,
  iconRight,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-blue-700 dark:hover:bg-blue-500 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-green-700 dark:hover:bg-green-500 focus:ring-secondary',
    danger: 'bg-status-red text-white hover:bg-red-700 dark:hover:bg-red-500 focus:ring-status-red',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-white focus:ring-primary dark:focus:ring-accent',
    ghost: 'text-primary dark:text-accent hover:bg-blue-100 dark:hover:bg-neutral-dark focus:ring-primary dark:focus:ring-accent',
    link: 'text-primary dark:text-accent hover:underline focus:ring-primary dark:focus:ring-accent p-0',
  };

  const sizeStyles = {
    sm: `px-3 py-1.5 text-xs ${iconLeft || iconRight ? 'space-x-1.5' : ''}`,
    md: `px-4 py-2 text-sm ${iconLeft || iconRight ? 'space-x-2' : ''}`,
    lg: `px-6 py-3 text-base ${iconLeft || iconRight ? 'space-x-2.5' : ''}`,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <i className={`${ICONS.loading} mr-2`}></i>}
      {!isLoading && iconLeft && <i className={`${iconLeft}`}></i>}
      <span>{children}</span>
      {!isLoading && iconRight && <i className={`${iconRight}`}></i>}
    </button>
  );
};

export default Button;
