import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@features': resolve(__dirname, './src/features'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@utils': resolve(__dirname, './src/utils'),
            '@types': resolve(__dirname, './src/types'),
            '@store': resolve(__dirname, './src/store'),
            '@styles': resolve(__dirname, './src/styles'),
            '@test': resolve(__dirname, './src/test'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
});
