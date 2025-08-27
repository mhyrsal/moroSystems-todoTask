import React, { useEffect } from 'react';
import { Header } from '@components/organisms/Header';
import { useAppSelector } from '@store/hooks';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const theme = useAppSelector((state) => state.ui.theme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <div className="min-h-screen transition-colors bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20">
            <Header />
            <main className="container max-w-6xl px-4 py-8 mx-auto">{children}</main>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: theme === 'dark' ? '#1f2937' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#1f2937',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};
