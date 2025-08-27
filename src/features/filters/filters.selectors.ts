import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { Todo } from '@/types/api.types';

export const selectFilters = (state: RootState) => state.filters;

export const selectFilteredTodos = createSelector(
    [(state: RootState) => state.todosApi.queries['getTodos(undefined)']?.data as Todo[] | undefined, selectFilters],
    (todos, filters) => {
        if (!todos) return [];

        let filtered = [...todos];

        if (filters.filter === 'active') {
            filtered = filtered.filter((todo) => !todo.completed);
        } else if (filters.filter === 'completed') {
            filtered = filtered.filter((todo) => todo.completed);
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter((todo) => todo.text.toLowerCase().includes(searchLower));
        }

        if (filters.priority !== 'all') {
            filtered = filtered.filter((todo) => todo.priority === filters.priority);
        }

        if (filters.tags.length > 0) {
            filtered = filtered.filter((todo) => filters.tags.some((tag) => todo.tags?.includes(tag)));
        }

        return filtered;
    }
);

export const selectActiveTodoCount = createSelector(
    [(state: RootState) => state.todosApi.queries['getTodos(undefined)']?.data as Todo[] | undefined],
    (todos) => todos?.filter((todo) => !todo.completed).length ?? 0
);

export const selectCompletedTodoCount = createSelector(
    [(state: RootState) => state.todosApi.queries['getTodos(undefined)']?.data as Todo[] | undefined],
    (todos) => todos?.filter((todo) => todo.completed).length ?? 0
);
