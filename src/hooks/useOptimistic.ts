import { useState, useCallback, useEffect } from 'react';
interface OptimisticState<T> {
    data: T;
    isOptimistic: boolean;
    error: Error | null;
}
interface UseOptimisticOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error, previousData: T) => void;
    timeout?: number;
}

export function useOptimistic<T>(initialData: T, options: UseOptimisticOptions<T> = {}) {
    const { onSuccess, onError, timeout = 5000 } = options;

    const [state, setState] = useState<OptimisticState<T>>({
        data: initialData,
        isOptimistic: false,
        error: null,
    });

    const [rollbackData, setRollbackData] = useState<T | null>(null);

    const updateOptimistically = useCallback(
        async <R>(optimisticUpdate: T | ((current: T) => T), asyncOperation: () => Promise<R>): Promise<R> => {
            const previousData = state.data;
            setRollbackData(previousData);

            const newData = optimisticUpdate instanceof Function ? optimisticUpdate(previousData) : optimisticUpdate;

            setState({
                data: newData,
                isOptimistic: true,
                error: null,
            });

            try {
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Operation timeout')), timeout);
                });

                const result = await Promise.race([asyncOperation(), timeoutPromise]);

                setState({
                    data: newData,
                    isOptimistic: false,
                    error: null,
                });

                onSuccess?.(newData);
                setRollbackData(null);

                return result;
            } catch (error) {
                const err = error instanceof Error ? error : new Error('Operation failed');

                setState({
                    data: previousData,
                    isOptimistic: false,
                    error: err,
                });

                onError?.(err, previousData);
                setRollbackData(null);

                throw error;
            }
        },
        [state.data, timeout, onSuccess, onError]
    );

    const rollback = useCallback(() => {
        if (rollbackData !== null) {
            setState({
                data: rollbackData,
                isOptimistic: false,
                error: null,
            });
            setRollbackData(null);
        }
    }, [rollbackData]);

    const resetError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    const setData = useCallback((newData: T | ((current: T) => T)) => {
        setState((prev) => ({
            ...prev,
            data: newData instanceof Function ? newData(prev.data) : newData,
            isOptimistic: false,
        }));
    }, []);

    useEffect(() => {
        return () => {
            if (rollbackData !== null) {
                console.warn('Component unmounted with pending optimistic update');
            }
        };
    }, [rollbackData]);

    return {
        data: state.data,
        isOptimistic: state.isOptimistic,
        error: state.error,
        updateOptimistically,
        rollback,
        resetError,
        setData,
    };
}
