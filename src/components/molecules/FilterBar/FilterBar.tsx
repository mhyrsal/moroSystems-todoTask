import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setFilter, setSearchTerm } from '@features/filters/filtersSlice';
import { selectFilters, selectActiveTodoCount, selectCompletedTodoCount } from '@features/filters/filters.selectors';
import { Input } from '@components/atoms/Input';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from '@/hooks/useTranslation';

export const FilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters);
    const activeCount = useAppSelector(selectActiveTodoCount);
    const completedCount = useAppSelector(selectCompletedTodoCount);
    const { t } = useTranslation();

    const filterOptions = [
        { value: 'all', label: t('all'), count: activeCount + completedCount },
        { value: 'active', label: t('active'), count: activeCount },
        { value: 'completed', label: t('completed'), count: completedCount },
    ] as const;

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <Input
                        value={filters.searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        placeholder={t('search')}
                        icon={<Search className="w-5 h-5 text-gray-400" />}
                    />
                </div>

                <div className="flex gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => dispatch(setFilter(option.value))}
                            className={clsx(
                                'px-4 py-2 rounded-lg font-medium transition-colors',
                                filters.filter === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            )}
                        >
                            {option.label}
                            <span className="ml-2 text-sm opacity-75">({option.count})</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
