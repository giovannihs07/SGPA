import { CheckCircle, AlertCircle, X } from "lucide-react";

const VARIANTS = {
    success: {
        icon:      CheckCircle,
        container: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
        button:    "text-green-500 hover:text-green-700",
    },
    error: {
        icon:      AlertCircle,
        container: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
        button:    "text-red-400 hover:text-red-600",
    },
};

/**
 * Banner de retroalimentación para formularios.
 *
 * @param {"success"|"error"} variant
 * @param {React.ReactNode}   children  - Contenido del mensaje
 * @param {() => void}        onClose   - Callback para cerrar el banner
 */
export const FormBanner = ({ variant, children, onClose }) => {
    const { icon: Icon, container, button } = VARIANTS[variant];

    return (
        <div className={`flex items-start gap-3 mb-5 px-4 py-3.5 rounded-xl border ${container}`}>
            <Icon size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{children}</div>
            {onClose && (
                <button onClick={onClose} className={`transition shrink-0 ${button}`}>
                    <X size={16} />
                </button>
            )}
        </div>
    );
};