import toast, { Toaster, ToastOptions, ValueOrFunction, Renderable } from 'react-hot-toast';

export { Toaster };

const defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'bottom-right',
};

const successOptions: ToastOptions = {
    ...defaultOptions,
    icon: '✅',
    style: {
        background: '#10b981',
        color: '#fff',
    },
};

const errorOptions: ToastOptions = {
    ...defaultOptions,
    icon: '❌',
    style: {
        background: '#ef4444',
        color: '#fff',
    },
    duration: 5000,
};

const warningOptions: ToastOptions = {
    ...defaultOptions,
    icon: '⚠️',
    style: {
        background: '#f59e0b',
        color: '#fff',
    },
};

const infoOptions: ToastOptions = {
    ...defaultOptions,
    icon: 'ℹ️',
    style: {
        background: '#3b82f6',
        color: '#fff',
    },
};

const loadingOptions: ToastOptions = {
    ...defaultOptions,
    icon: '⏳',
    duration: Infinity,
};

// Custom toast functions
export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        return toast.success(message, { ...successOptions, ...options });
    },

    error: (message: string, options?: ToastOptions) => {
        return toast.error(message, { ...errorOptions, ...options });
    },

    warning: (message: string, options?: ToastOptions) => {
        return toast(message, { ...warningOptions, ...options });
    },

    info: (message: string, options?: ToastOptions) => {
        return toast(message, { ...infoOptions, ...options });
    },

    loading: (message: string, options?: ToastOptions) => {
        return toast.loading(message, { ...loadingOptions, ...options });
    },

    custom: (message: Renderable | ValueOrFunction<Renderable, unknown>, options?: ToastOptions) => {
        return toast.custom(message, { ...defaultOptions, ...options });
    },

    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        },
        options?: ToastOptions
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            { ...defaultOptions, ...options }
        );
    },

    dismiss: (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    remove: (toastId?: string) => {
        if (toastId) {
            toast.remove(toastId);
        } else {
            toast.remove();
        }
    },
};

// Re-export the default toast for backward compatibility
export { toast };

// Convenience functions
export const toastSuccess = showToast.success;
export const toastError = showToast.error;
export const toastWarning = showToast.warning;
export const toastInfo = showToast.info;
export const toastLoading = showToast.loading;
export const toastPromise = showToast.promise;

export default showToast;
