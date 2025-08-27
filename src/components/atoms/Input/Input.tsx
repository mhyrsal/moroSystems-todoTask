import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { InputProps } from './Input.types';
import { inputBaseClasses, inputDefaultClasses, inputErrorClasses } from './Input.styles';

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, helperText, className, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={clsx('input-wrapper', { 'w-full': fullWidth })}>
            {label && (
                <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">{icon}</span>
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        inputBaseClasses,
                        error ? inputErrorClasses : inputDefaultClasses,
                        icon && 'pl-10',
                        'dark:bg-gray-800 dark:text-white',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
