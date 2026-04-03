import React, { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'search' | 'textarea';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-4 py-2 rounded-lg border transition-colors font-[Instrument_Sans] text-sm';
    const normalClasses = error
      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500'
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';
    const disabledClasses = disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
      : '';

    const searchClasses =
      'pl-10 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400';

    const containerClasses = variant === 'search' ? 'relative' : '';
    const inputContainerClasses =
      variant === 'search' ? 'relative flex items-center' : '';

    if (variant === 'textarea') {
      return (
        <div className={containerClasses}>
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <textarea
            ref={ref as any}
            className={`${baseClasses} ${normalClasses} ${disabledClasses} resize-none min-h-[120px] ${className}`}
            disabled={disabled}
            {...(props as any)}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className={inputContainerClasses}>
          {variant === 'search' && (
            <svg
              className="absolute left-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          <input
            ref={ref}
            type="text"
            className={`${baseClasses} ${
              variant === 'search' ? searchClasses : normalClasses
            } ${disabledClasses} ${className}`}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
