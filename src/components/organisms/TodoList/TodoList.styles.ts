export const todoListStyles = {
    container: 'space-y-2 p-4',
    loading: 'flex items-center justify-center py-12',
    loadingText: 'ml-3 text-gray-600 dark:text-gray-400',
    error: 'text-center py-12',
    errorIcon: 'w-12 h-12 text-red-500 mx-auto mb-4',
    errorText: 'text-red-600 dark:text-red-400 font-medium',
    errorSubtext: 'text-sm text-gray-500 dark:text-gray-400 mt-2',
    empty: 'text-center py-12',
    emptyIcon: 'w-12 h-12 text-gray-400 mx-auto mb-4',
    emptyText: 'text-gray-500 dark:text-gray-400',
    emptySubtext: 'text-sm text-gray-400 dark:text-gray-500 mt-2',
    listWrapper: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm',
    listHeader: 'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
    listTitle: 'text-sm font-medium text-gray-700 dark:text-gray-300',
};

export const todoItemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.2 },
};

export const listAnimation = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};
