import React from 'react';
import { MainLayout } from '@components/templates/MainLayout';
import { TodoForm } from '@components/organisms/TodoForm';
import { TodoList } from '@components/organisms/TodoList';
import { FilterBar } from '@components/molecules/FilterBar';
import { StatsBar } from '@components/molecules/StatsBar';
import { useAppSelector } from '@store/hooks';
import { selectActiveTodoCount, selectCompletedTodoCount } from '@features/filters/filters.selectors';

export const TodoPage: React.FC = () => {
    const activeCount = useAppSelector(selectActiveTodoCount);
    const completedCount = useAppSelector(selectCompletedTodoCount);
    const totalCount = activeCount + completedCount;
    const hasTodos = totalCount > 0;

    return (
        <MainLayout>
            <div className="space-y-6">
                <TodoForm />

                {hasTodos && (
                    <>
                        <StatsBar />
                        <FilterBar />
                    </>
                )}

                <TodoList />
            </div>
        </MainLayout>
    );
};
