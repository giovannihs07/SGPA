import { RefreshCw } from "lucide-react";

export const MisProductosLoading = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Cargando tus productos…</span>
        </div>
    </div>
);

export const MisProductosError = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-sm text-red-500">{error}</p>
        <button
            onClick={onRetry}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 underline transition"
        >
            <RefreshCw size={12} /> Reintentar
        </button>
    </div>
);
