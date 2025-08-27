import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodosState } from './todos.types';
import { todosApi } from './todosApi';

const initialState: TodosState = {
    items: [],
    isLoading: false,
    error: null,
    lastSync: null,
};

// This slice is mainly for local state management if needed
// The actual todos data comes from RTK Query cache
const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        // Local optimistic updates
        addOptimisticTodo: (state, action: PayloadAction<Todo>) => {
            state.items.unshift(action.payload);
        },
        removeOptimisticTodo: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload);
        },
        updateOptimisticTodo: (state, action: PayloadAction<{ id: string; updates: Partial<Todo> }>) => {
            const index = state.items.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.payload.updates,
                };
            }
        },
        setLastSync: (state, action: PayloadAction<string>) => {
            state.lastSync = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Sync with RTK Query cache
        builder
            .addMatcher(todosApi.endpoints.getTodos.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(todosApi.endpoints.getTodos.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.lastSync = new Date().toISOString();
                state.error = null;
            })
            .addMatcher(todosApi.endpoints.getTodos.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch todos';
            });
    },
});

export const { addOptimisticTodo, removeOptimisticTodo, updateOptimisticTodo, setLastSync, clearError } = todosSlice.actions;

export default todosSlice.reducer;
