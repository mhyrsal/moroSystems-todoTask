import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { TodoPage } from '@components/pages/TodoPage';
import { useAppSelector } from '@store/hooks';
import './styles/global.css';

function AppContent() {
    const theme = useAppSelector((state) => state.ui.theme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return <TodoPage />;
}

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
