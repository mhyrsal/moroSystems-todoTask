import { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    helperText?: string;
    fullWidth?: boolean;
}
