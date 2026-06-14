export const PublicCatalogoLoading = () => (
    <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Cargando catálogo…</span>
        </div>
    </div>
);

export const PublicCatalogoError = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-red-100
        dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
        <p className="text-sm text-red-600 dark:text-red-400 px-4 text-center">{error}</p>
        <button
            type="button"
            onClick={onRetry}
            className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-[#EC7A21] underline transition"
        >
            Reintentar
        </button>
    </div>
);
