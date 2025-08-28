import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { TodoPage } from '@components/pages/TodoPage';
import { useAppSelector } from '@store/hooks';
import './styles/global.css';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <h1>Něco se pokazilo.</h1>
                    <p>Prosím, zkuste obnovit stránku nebo kontaktujte podporu.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

function AppContent() {
    const theme = useAppSelector((state) => state.ui.theme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ErrorBoundary>
            <TodoPage />
        </ErrorBoundary>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
