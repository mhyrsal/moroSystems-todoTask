import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TodoItem } from '@components/molecules/TodoItem';
import { useAppSelector } from '@store/hooks';
import { selectFilteredTodos } from '@features/filters/filters.selectors';
import { useGetTodosQuery } from '@features/todos/todosApi';
import { Button } from '@components/atoms/Button';
import { Loader2, Inbox, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const TodoList: React.FC = () => {
    const { isLoading, error } = useGetTodosQuery();
    const filteredTodos = useAppSelector(selectFilteredTodos);
    const { t } = useTranslation();

    const [itemsToShow, setItemsToShow] = useState(5);
    const ITEMS_PER_LOAD = 5;

    const visibleTodos = filteredTodos.slice(0, itemsToShow);
    const hasMoreItems = itemsToShow < filteredTodos.length;
    const remainingItems = filteredTodos.length - itemsToShow;

    React.useEffect(() => {
        setItemsToShow(5);
    }, [filteredTodos.length]);

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
        <div className="flex flex-col">
            <div
                className="p-4 space-y-2 overflow-auto"
                style={{
                    maxHeight: '450px',
                    minHeight: '200px',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {visibleTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </AnimatePresence>

                {hasMoreItems && (
                    <div className="pt-4 text-center">
                        <Button
                            onClick={() => setItemsToShow((prev) => prev + ITEMS_PER_LOAD)}
                            variant="ghost"
                            size="sm"
                            icon={<ChevronDown className="w-4 h-4" />}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            Show {Math.min(ITEMS_PER_LOAD, remainingItems)} more ({remainingItems} remaining)
                        </Button>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                Showing {visibleTodos.length} of {filteredTodos.length} todos
                {hasMoreItems && " • Scroll down and click 'Show more' for additional items"}
            </div>
        </div>
    );
};
