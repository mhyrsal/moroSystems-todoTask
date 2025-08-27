import { Todo } from '@/types/api.types';

export interface TodoItemProps {
    todo: Todo;
    onToggle?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, text: string) => void;
    isOptimistic?: boolean;
}
