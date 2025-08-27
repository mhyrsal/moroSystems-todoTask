import React from 'react';
import { MainLayout } from '@components/templates/MainLayout';
import { TodoForm } from '@components/organisms/TodoForm';
import { TodoList } from '@components/organisms/TodoList';
import { FilterBar } from '@components/molecules/FilterBar';
import { StatsBar } from '@components/molecules/StatsBar';

export const TodoPage: React.FC = () => {
    return (
        <MainLayout>
            <div className="space-y-6">
                <TodoForm />
                <StatsBar />
                <FilterBar />
                <TodoList />
            </div>
        </MainLayout>
    );
};
