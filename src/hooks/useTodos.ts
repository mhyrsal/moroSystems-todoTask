import { useMemo } from 'react';
import { useGetTodosQuery } from '@features/todos/todosApi';
import { useAppSelector } from '@store/hooks';
import { selectFilters } from '@features/filters/filters.selectors';

export const useTodos = () => {
    const { data: todos = [], isLoading, error } = useGetTodosQuery();
    const filters = useAppSelector(selectFilters);

    const filteredTodos = useMemo(() => {
        let result = [...todos];

        if (filters.filter === 'active') {
            result = result.filter((todo) => !todo.completed);
        } else if (filters.filter === 'completed') {
            result = result.filter((todo) => todo.completed);
        }

        if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            result = result.filter((todo) => todo.text.toLowerCase().includes(search));
        }

        return result;
    }, [todos, filters]);

    const stats = useMemo(
        () => ({
            total: todos.length,
            active: todos.filter((t) => !t.completed).length,
            completed: todos.filter((t) => t.completed).length,
        }),
        [todos]
    );

    return {
        todos: filteredTodos,
        isLoading,
        error,
        stats,
    };
};
