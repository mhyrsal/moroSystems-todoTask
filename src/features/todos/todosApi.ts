import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, Task, CreateTodoDto, UpdateTodoDto } from '@/types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const transformTaskToTodo = (task: Task): Todo => ({
    id: task.id,
    text: task.text,
    completed: task.completed,
    createdAt: new Date(task.createdDate).toISOString(),
    completedAt: task.completedDate && task.completedDate !== 0 ? new Date(task.completedDate).toISOString() : null,
    priority: task.priority,
    tags: task.tags || [],
    starred: task.starred ?? false,
});

export const todosApi = createApi({
    reducerPath: 'todosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], void>({
            query: () => '/tasks',
            transformResponse: (response: Task[]) => {
                return response.map(transformTaskToTodo);
            },
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'Todo' as const, id })), { type: 'Todo', id: 'LIST' }] : [{ type: 'Todo', id: 'LIST' }],
        }),

        createTodo: builder.mutation<Todo, CreateTodoDto>({
            query: (todo) => ({
                url: '/tasks',
                method: 'POST',
                body: {
                    text: todo.text,
                    priority: todo.priority,
                    tags: todo.tags,
                },
            }),
            transformResponse: (response: Task) => transformTaskToTodo(response),
            async onQueryStarted(todo, { dispatch, queryFulfilled }) {
                const tempId = `temp-${Date.now()}`;
                const optimisticTodo: Todo = {
                    id: tempId,
                    text: todo.text,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    completedAt: null,
                    priority: todo.priority,
                    tags: todo.tags || [],
                    starred: false,
                };

                const patchResult = dispatch(
                    todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                        draft.unshift(optimisticTodo);
                    })
                );

                try {
                    const { data: createdTodo } = await queryFulfilled;
                    dispatch(
                        todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                            const index = draft.findIndex((t) => t.id === tempId);
                            if (index !== -1) {
                                draft[index] = createdTodo;
                            }
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),

        updateTodo: builder.mutation<Todo, { id: string; updates: UpdateTodoDto }>({
            query: ({ id, updates }) => ({
                url: `/tasks/${id}`,
                method: 'POST',
                body: updates,
            }),
            transformResponse: (response: Task) => transformTaskToTodo(response),
            async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                        const todo = draft.find((t) => t.id === id);
                        if (todo) {
                            if (updates.text !== undefined) todo.text = updates.text;
                            if (updates.completed !== undefined) {
                                todo.completed = updates.completed;
                                todo.completedAt = updates.completed ? new Date().toISOString() : null;
                            }
                            if (updates.starred !== undefined) todo.starred = updates.starred;
                            if (updates.priority !== undefined) todo.priority = updates.priority;
                            if (updates.tags !== undefined) todo.tags = updates.tags;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        deleteTodo: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => {
                // This is the key fix - handle the plain text response
                if (typeof response === 'string') {
                    return { message: response };
                }
                return response || { message: 'Task deleted' };
            },
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                        const index = draft.findIndex((t) => t.id === id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        getCompletedTodos: builder.query<Todo[], void>({
            query: () => '/tasks/completed',
            transformResponse: (response: Task[]) => {
                return response.map(transformTaskToTodo);
            },
            providesTags: ['Todo'],
        }),

        deleteAllCompleted: builder.mutation<void, void>({
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                        return draft.filter((todo) => !todo.completed);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            queryFn: async (arg, api, extraOptions, baseQuery) => {
                const completedResult = await baseQuery('/tasks/completed');
                if (completedResult.error) return { error: completedResult.error };

                const completedTasks = completedResult.data as Task[];

                for (const task of completedTasks) {
                    await baseQuery({
                        url: `/tasks/${task.id}`,
                        method: 'DELETE',
                    });
                }

                return { data: undefined };
            },
        }),

        toggleAllTodos: builder.mutation<void, boolean>({
            async onQueryStarted(shouldComplete, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
                        draft.forEach((todo) => {
                            todo.completed = shouldComplete;
                            todo.completedAt = shouldComplete ? new Date().toISOString() : null;
                        });
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            queryFn: async (shouldComplete, api, extraOptions, baseQuery) => {
                const tasksResult = await baseQuery('/tasks');
                if (tasksResult.error) return { error: tasksResult.error };

                const tasks = tasksResult.data as Task[];

                for (const task of tasks) {
                    if (task.completed !== shouldComplete) {
                        await baseQuery({
                            url: `/tasks/${task.id}/${shouldComplete ? 'complete' : 'incomplete'}`,
                            method: 'POST',
                        });
                    }
                }

                return { data: undefined };
            },
        }),
    }),
});

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useGetCompletedTodosQuery,
    useDeleteAllCompletedMutation,
    useToggleAllTodosMutation,
} = todosApi;
