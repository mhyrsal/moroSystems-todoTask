import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    theme: 'light' | 'dark';
    language: 'en' | 'cs';
    isLoading: boolean;
    error: string | null;
    showCompleted: boolean;
    viewMode: 'list' | 'grid';
    soundEnabled?: boolean;
    desktopNotifications?: boolean;
}

const initialState: UIState = {
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    language: (localStorage.getItem('language') as 'en' | 'cs') || 'en',
    isLoading: false,
    error: null,
    showCompleted: true,
    viewMode: 'list',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        setLanguage: (state, action: PayloadAction<'en' | 'cs'>) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        toggleShowCompleted: (state) => {
            state.showCompleted = !state.showCompleted;
        },
        setViewMode: (state, action: PayloadAction<'list' | 'grid'>) => {
            state.viewMode = action.payload;
        },
    },
});

export const { setTheme, setLanguage, setLoading, setError, toggleShowCompleted, setViewMode } = uiSlice.actions;

export default uiSlice.reducer;
