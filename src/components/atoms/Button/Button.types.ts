import { ReactNode, MouseEventHandler } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    'aria-label'?: string;
}
