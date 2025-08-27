import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TodoItem } from '@components/molecules/TodoItem';
import { useAppSelector } from '@store/hooks';
import { selectFilteredTodos } from '@features/filters/filters.selectors';
import { useGetTodosQuery } from '@features/todos/todosApi';
import { Loader2, Inbox } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const TodoList: React.FC = () => {
    const { isLoading, error } = useGetTodosQuery();
    const filteredTodos = useAppSelector(selectFilteredTodos);
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center">
                <p className="text-red-600">{t('failedToLoad')}</p>
                <p className="mt-2 text-sm text-gray-500">{t('tryAgain')}</p>
            </div>
        );
    }

    if (filteredTodos.length === 0) {
        return (
            <div className="py-12 text-center">
                <Inbox className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">{t('noFound')}</p>
                <p className="mt-2 text-sm text-gray-400">{t('adjustFilters')}</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2">
            <AnimatePresence mode="popLayout">
                {filteredTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </AnimatePresence>
        </div>
    );
};
