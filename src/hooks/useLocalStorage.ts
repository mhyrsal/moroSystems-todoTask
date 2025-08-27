import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    options?: {
        serializer?: (value: T) => string;
        deserializer?: (value: string) => T;
        syncData?: boolean;
    }
): [T, (value: SetValue<T>) => void, () => void] {
    const { serializer = JSON.stringify, deserializer = JSON.parse, syncData = true } = options || {};
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? deserializer(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key, deserializer]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = useCallback(
        (value: SetValue<T>) => {
            if (typeof window === 'undefined') {
                console.warn(`Tried setting localStorage key "${key}" even though environment is not a browser`);
            }

            try {
                const newValue = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, serializer(newValue));

                setStoredValue(newValue);
                if (syncData) {
                    window.dispatchEvent(
                        new CustomEvent('local-storage', {
                            detail: { key, newValue },
                        })
                    );
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, serializer, storedValue, syncData]
    );

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);

            if (syncData) {
                window.dispatchEvent(
                    new CustomEvent('local-storage', {
                        detail: { key, newValue: null },
                    })
                );
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue, syncData]);

    useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);

    useEffect(() => {
        if (!syncData) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(deserializer(e.newValue));
                } catch {
                    setStoredValue(initialValue);
                }
            }
        };

        const handleCustomEvent = (e: CustomEvent) => {
            if (e.detail.key === key) {
                setStoredValue(e.detail.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleCustomEvent as EventListener);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleCustomEvent as EventListener);
        };
    }, [key, syncData, deserializer, initialValue]);

    return [storedValue, setValue, removeValue];
}
