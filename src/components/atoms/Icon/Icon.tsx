import React from 'react';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';

interface IconProps {
    name: keyof typeof LucideIcons;
    size?: number;
    className?: string;
    color?: string;
    onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className, color, onClick }) => {
    const IconComponent = LucideIcons[name] as React.ComponentType<any>;

    if (!IconComponent) {
        console.warn(`Icon ${name} not found`);
        return null;
    }

    return (
        <IconComponent
            size={size}
            className={clsx('inline-block', className)}
            color={color}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        />
    );
};
