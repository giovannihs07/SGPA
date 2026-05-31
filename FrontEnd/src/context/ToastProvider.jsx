import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { ToastContext } from "./ToastContext";

const VARIANTS = {
    error: {
        icon: AlertCircle,
        container: "bg-red-50 border-red-200 text-red-800",
        iconColor: "text-red-500",
    },
    success: {
        icon: CheckCircle,
        container: "bg-green-50 border-green-200 text-green-800",
        iconColor: "text-green-500",
    },
};

const ToastItem = ({ toast, onDismiss }) => {
    const { icon: Icon, container, iconColor } = VARIANTS[toast.variant];

    return (
        <div
            role="alert"
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${container}`}
        >
            <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor}`} />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition"
                aria-label="Cerrar notificación"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback(({ variant = "error", message, duration = 5000 }) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, variant, message }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
    }, [dismiss]);

    const toast = useCallback((message, opts) => show({ message, ...opts }), [show]);
    toast.error = (message, opts) => show({ variant: "error", message, ...opts });
    toast.success = (message, opts) => show({ variant: "success", message, ...opts });

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div
                aria-live="polite"
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
            >
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
