import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from './Button.types';
import { buttonVariants, buttonSizes, baseButtonClasses } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    disabled = false,
    loading = false,
    type = 'button',
    className,
    icon,
    fullWidth = false,
    'aria-label': ariaLabel,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            aria-busy={loading}
            className={clsx(
                baseButtonClasses,
                buttonVariants[variant],
                buttonSizes[size],
                {
                    'w-full': fullWidth,
                    'cursor-wait': loading,
                },
                className
            )}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
            ) : icon ? (
                <span className="mr-2" aria-hidden="true">
                    {icon}
                </span>
            ) : null}
            <span>{children}</span>
        </button>
    );
};

Button.displayName = 'Button';
