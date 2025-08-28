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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApi.middleware).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
