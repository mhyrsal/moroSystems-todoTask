import React from 'react';
import { useAppSelector } from '@store/hooks';
import { selectActiveTodoCount, selectCompletedTodoCount } from '@features/filters/filters.selectors';
import { useDeleteAllCompletedMutation, useToggleAllTodosMutation } from '@features/todos/todosApi';
import { Button } from '@components/atoms/Button';
import { CheckCircle, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const StatsBar: React.FC = () => {
    const activeCount = useAppSelector(selectActiveTodoCount);
    const completedCount = useAppSelector(selectCompletedTodoCount);
    const totalCount = activeCount + completedCount;
    const { t } = useTranslation();

    const [deleteAllCompleted, { isLoading: isDeletingAll }] = useDeleteAllCompletedMutation();
    const [toggleAll, { isLoading: isToggling }] = useToggleAllTodosMutation();

    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('active')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeCount}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('completed')}</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('progress')}</p>
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <div className="w-24 sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <div
                                        className="h-2 transition-all bg-indigo-600 dark:bg-indigo-500 rounded-full"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completionPercentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions - Hidden on mobile, shown on larger screens */}
                    <div className="hidden sm:flex gap-2">
                        <Button
                            onClick={() => toggleAll(activeCount > 0)}
                            variant="secondary"
                            size="sm"
                            loading={isToggling}
                            disabled={totalCount === 0}
                            icon={<CheckCircle className="w-4 h-4" />}
                        >
                            {activeCount > 0 ? t('markAllComplete') : t('markAllIncomplete')}
                        </Button>
                        <Button
                            onClick={() => deleteAllCompleted()}
                            variant="danger"
                            size="sm"
                            loading={isDeletingAll}
                            disabled={completedCount === 0}
                            icon={<Trash2 className="w-4 h-4" />}
                        >
                            {t('clearCompleted')}
                        </Button>
                    </div>
                </div>

                {/* Mobile Actions Row - Only visible on small screens */}
                <div className="flex flex-col gap-2 sm:hidden">
                    <Button
                        onClick={() => toggleAll(activeCount > 0)}
                        variant="secondary"
                        size="sm"
                        loading={isToggling}
                        disabled={totalCount === 0}
                        icon={<CheckCircle className="w-4 h-4" />}
                        className="w-full"
                    >
                        {activeCount > 0 ? t('markAllComplete') : t('markAllIncomplete')}
                    </Button>
                    <Button
                        onClick={() => deleteAllCompleted()}
                        variant="danger"
                        size="sm"
                        loading={isDeletingAll}
                        disabled={completedCount === 0}
                        icon={<Trash2 className="w-4 h-4" />}
                        className="w-full"
                    >
                        {t('clearCompleted')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
