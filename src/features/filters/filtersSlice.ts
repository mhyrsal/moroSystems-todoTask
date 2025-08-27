import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterType = 'all' | 'active' | 'completed';

interface FiltersState {
    filter: FilterType;
    searchTerm: string;
    tags: string[];
    priority: 'all' | 'low' | 'medium' | 'high';
}

const initialState: FiltersState = {
    filter: 'all',
    searchTerm: '',
    tags: [],
    priority: 'all',
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.filter = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setTags: (state, action: PayloadAction<string[]>) => {
            state.tags = action.payload;
        },
        setPriority: (state, action: PayloadAction<FiltersState['priority']>) => {
            state.priority = action.payload;
        },
        clearFilters: () => {
            return initialState;
        },
    },
});

export const { setFilter, setSearchTerm, setTags, setPriority, clearFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
