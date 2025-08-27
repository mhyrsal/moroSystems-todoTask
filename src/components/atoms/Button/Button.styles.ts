import { ButtonVariant, ButtonSize } from './Button.types';

export const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
};

export const buttonSizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export const baseButtonClasses = `
  inline-flex items-center justify-center 
  font-medium transition-all duration-200 
  rounded-lg focus:outline-none focus:ring-2 
  focus:ring-offset-2 disabled:opacity-50 
  disabled:cursor-not-allowed
`;
