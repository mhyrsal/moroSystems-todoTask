import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={clsx('flex items-center', className)}>
            <div className="relative">
                <input ref={ref} type="checkbox" id={checkboxId} className="sr-only" {...props} />
                <label htmlFor={checkboxId} className={clsx('flex items-center cursor-pointer', props.disabled && 'opacity-50 cursor-not-allowed')}>
                    <div
                        className={clsx(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                            props.checked ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600',
                            error && 'border-red-500'
                        )}
                    >
                        {props.checked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {label && <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>}
                </label>
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';
