import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTheme, setLanguage } from '@features/ui/uiSlice';
import { Button } from '@components/atoms/Button';
import { Moon, Sun, CheckSquare, Github, WifiOff, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@hooks/useTranslation';

export const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme, language } = useAppSelector((state) => state.ui);
    const { t } = useTranslation();
    const [isBackendConnected, setIsBackendConnected] = useState(false);

    // Check backend connection
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch('http://localhost:8080/tasks', {
                    method: 'HEAD',
                });
                setIsBackendConnected(response.ok);
            } catch (error) {
                setIsBackendConnected(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 3000);

        return () => clearInterval(interval);
    }, []);

    const languages = [
        { code: 'en' as const, label: '🇺🇸 English' },
        { code: 'cs' as const, label: '🇨🇿 Čeština' },
    ];

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as 'en' | 'cs';
        dispatch(setLanguage(newLang));
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
            <div className="container max-w-6xl px-4 py-4 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                            <CheckSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer hover:border-primary-400 transition-colors"
                            aria-label="Select language"
                        >
                            {languages.map(({ code, label }) => (
                                <option key={code} value={code}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <Button onClick={toggleTheme} variant="ghost" size="sm" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                            <motion.div initial={{ rotate: 0 }} animate={{ rotate: theme === 'dark' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </motion.div>
                        </Button>

                        <Button
                            onClick={() => window.open('https://github.com/morosystems/todo-be', '_blank')}
                            variant="ghost"
                            size="sm"
                            aria-label="View on GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                            {isBackendConnected ? (
                                <>
                                    <Wifi className="w-3 h-3 text-green-500" />
                                    <span className="text-green-600 dark:text-green-400">{t('connectedToBackend')}</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-3 h-3 text-red-500" />
                                    <span className="text-red-600 dark:text-red-400">{t('disconnectedFromBackend')}</span>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
};
