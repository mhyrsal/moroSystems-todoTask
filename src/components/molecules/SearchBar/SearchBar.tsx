import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    onFocus?: () => void;
    onBlur?: () => void;
    showSuggestions?: boolean;
    suggestions?: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder,
    debounceMs = 300,
    onFocus,
    onBlur,
    showSuggestions = false,
    suggestions = [],
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestionsList, setShowSuggestionsList] = useState(false);
    const debouncedValue = useDebounce(localValue, debounceMs);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestionsList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowSuggestionsList(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        setTimeout(() => setShowSuggestionsList(false), 200);
        onBlur?.();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalValue(suggestion);
        onChange(suggestion);
        setShowSuggestionsList(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClear();
            inputRef.current?.blur();
        }
    };

    const filteredSuggestions = suggestions.filter((s) => s.toLowerCase().includes(localValue.toLowerCase()) && s !== localValue);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary-500' : 'text-gray-400'}`} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder ?? t('search')}
                    className={`
            block w-full pl-10 pr-10 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-all duration-200
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
                    aria-label="Search"
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                />

                <AnimatePresence>
                    {localValue && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showSuggestions && showSuggestionsList && filteredSuggestions.length > 0 && (
                    <motion.div
                        id="search-suggestions"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="py-2">
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isFocused && localValue && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute left-0 text-xs text-gray-500 -bottom-6 dark:text-gray-400">
                    Press ESC to clear
                </motion.div>
            )}
        </div>
    );
};
