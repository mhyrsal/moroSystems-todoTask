import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, Star, X, Save, Clock, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { TodoItemProps } from './TodoItem.types';
import { priorityColors } from './TodoItem.styles';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { Badge } from '@components/atoms/Badge';
import { useUpdateTodoMutation, useDeleteTodoMutation } from '@features/todos/todosApi';
import { toast } from '@utils/toast';
import { useTranslation } from '@/hooks/useTranslation';

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isOptimistic = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const { t } = useTranslation();
    const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
    const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

    const handleToggle = async () => {
        try {
            await updateTodo({
                id: todo.id,
                updates: { completed: !todo.completed },
            }).unwrap();
            toast.success(todo.completed ? 'Todo marked as incomplete' : 'Todo completed!');
        } catch (error) {
            toast.error('Failed to update todo. Please try again.');
        }
    };

    const handleSave = async () => {
        if (editText.trim() && editText !== todo.text) {
            try {
                await updateTodo({
                    id: todo.id,
                    updates: { text: editText.trim() },
                }).unwrap();
                setIsEditing(false);
                toast.success('Todo updated');
            } catch (error) {
                toast.error('Failed to update todo');
                console.error('Failed to update todo:', error);
                setEditText(todo.text);
            }
        } else {
            setIsEditing(false);
            setEditText(todo.text);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTodo(todo.id).unwrap();
            toast.success('Todo deleted');
        } catch (error) {
            toast.error('Failed to delete todo');
            console.error('Failed to delete todo:', error);
        }
    };

    const handleStarToggle = async () => {
        try {
            await updateTodo({
                id: todo.id,
                updates: { starred: !todo.starred },
            }).unwrap();
        } catch (error) {
            console.error('Failed to star todo:', error);
        }
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOptimistic ? 0.6 : 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={clsx(
                'flex items-center gap-3 p-4',
                'bg-white dark:bg-gray-800',
                'rounded-lg shadow-sm hover:shadow-md',
                'border-l-4 transition-all',
                todo.priority && priorityColors[todo.priority],
                isOptimistic && 'opacity-60',
                todo.completed && 'bg-opacity-50'
            )}
        >
            <button
                onClick={handleToggle}
                disabled={isUpdating || isOptimistic}
                className={clsx(
                    'w-6 h-6 rounded-full border-2',
                    'flex items-center justify-center',
                    'transition-all duration-200',
                    todo.completed ? 'bg-primary-600 border-primary-600' : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'
                )}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
            </button>

            {isEditing ? (
                <div className="flex flex-1 gap-2">
                    <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSave();
                            }
                            if (e.key === 'Escape') handleCancel();
                        }}
                        autoFocus
                        placeholder={t('todoText')}
                        className="flex-1"
                    />
                    <Button onClick={handleSave} size="sm" variant="success" icon={<Save className="w-4 h-4" />} disabled={isUpdating} loading={isUpdating}>
                        {t('save')}
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="ghost" icon={<X className="w-4 h-4" />}>
                        {t('cancel')}
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-center gap-2">
                            <span
                                className={clsx('text-gray-800 dark:text-gray-200', todo.completed && 'line-through opacity-50')}
                                onDoubleClick={() => !isOptimistic && setIsEditing(true)}
                            >
                                {todo.text}
                            </span>
                            {todo.priority && (
                                <Badge variant={todo.priority === 'high' ? 'danger' : todo.priority === 'medium' ? 'warning' : 'success'} size="sm">
                                    {todo.priority}
                                </Badge>
                            )}
                            {todo.tags?.map((tag) => (
                                <Badge key={tag} variant="info" size="sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                            </span>
                            {todo.completedAt && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Completed {format(new Date(todo.completedAt), 'MMM d')}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={handleStarToggle}
                            disabled={isOptimistic}
                            className={clsx(
                                'p-1.5 transition-colors rounded',
                                todo.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                            )}
                            aria-label={todo.starred ? 'Unstar todo' : 'Star todo'}
                        >
                            <Star className="w-4 h-4" fill={todo.starred ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isOptimistic}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded"
                            aria-label="Edit todo"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || isOptimistic}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded"
                            aria-label="Delete todo"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};
