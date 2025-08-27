import { createSelector } from '@reduxjs/toolkit';
import { todosApi } from './todosApi';

export const selectTodosResult = todosApi.endpoints.getTodos.select();

export const selectAllTodos = createSelector(selectTodosResult, (todosResult) => todosResult.data ?? []);

export const selectTodosLoading = createSelector(selectTodosResult, (todosResult) => todosResult.isLoading);

export const selectTodosError = createSelector(selectTodosResult, (todosResult) => todosResult.error);

export const selectTodoById = (id: string) => createSelector(selectAllTodos, (todos) => todos.find((todo) => todo.id === id));

export const selectActiveTodos = createSelector(selectAllTodos, (todos) => todos.filter((todo) => !todo.completed));

export const selectCompletedTodos = createSelector(selectAllTodos, (todos) => todos.filter((todo) => todo.completed));

export const selectStarredTodos = createSelector(selectAllTodos, (todos) => todos.filter((todo) => todo.starred));

export const selectTodosByPriority = (priority: 'low' | 'medium' | 'high') =>
    createSelector(selectAllTodos, (todos) => todos.filter((todo) => todo.priority === priority));

export const selectTodosWithTag = (tag: string) => createSelector(selectAllTodos, (todos) => todos.filter((todo) => todo.tags?.includes(tag)));

export const selectTodoStats = createSelector(selectAllTodos, (todos) => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const starred = todos.filter((t) => t.starred).length;

    const byPriority = {
        high: todos.filter((t) => t.priority === 'high').length,
        medium: todos.filter((t) => t.priority === 'medium').length,
        low: todos.filter((t) => t.priority === 'low').length,
    };

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const todayTodos = todos.filter((todo) => {
        const todoDate = new Date(todo.createdAt);
        const today = new Date();
        return todoDate.getDate() === today.getDate() && todoDate.getMonth() === today.getMonth() && todoDate.getFullYear() === today.getFullYear();
    });

    return {
        total,
        active,
        completed,
        starred,
        byPriority,
        completionRate,
        todayCount: todayTodos.length,
        todayCompleted: todayTodos.filter((t) => t.completed).length,
    };
});

export const selectAllTags = createSelector(selectAllTodos, (todos) => {
    const tagsSet = new Set<string>();
    todos.forEach((todo) => {
        todo.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
});
