import { RefreshCw } from "lucide-react";

export const MisProductosHeader = ({ onRefresh }) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Mis productos académicos
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
                Gestiona, publica y descarga tu producción académica
            </p>
        </div>
        <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700
                hover:border-[#EFB357] hover:text-[#EC7A21] transition shrink-0"
        >
            <RefreshCw size={13} /> Actualizar
        </button>
    </div>
);
