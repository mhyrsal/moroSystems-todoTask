import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { toast } from '@utils/toast';

export const errorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error = action.payload as { data?: { message?: string } };
        toast.error(error.data?.message || 'An error occurred');
    }
    return next(action);
};
