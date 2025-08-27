// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from '@features/todos/todosApi';
import filtersReducer from '@features/filters/filtersSlice';
import uiReducer from '@features/ui/uiSlice';
import { errorMiddleware } from './middleware';

export const store = configureStore({
    reducer: {
        [todosApi.reducerPath]: todosApi.reducer,
        filters: filtersReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'todosApi/executeQuery/fulfilled',
                    'todosApi/executeQuery/pending',
                    'todosApi/executeQuery/rejected',
                    'todosApi/executeMutation/fulfilled',
                    'todosApi/executeMutation/pending',
                    'todosApi/executeMutation/rejected',
                ],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['todosApi.queries', 'todosApi.mutations'],
            },
        })
            .concat(todosApi.middleware)
            .concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
