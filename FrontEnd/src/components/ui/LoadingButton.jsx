export const LoadingButton = ({ loading, disabled, children, className = '' }) => (
    <button
        type="submit"
        disabled={loading || disabled}
        className={`flex items-center justify-center gap-2 font-semibold py-3 rounded-lg text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
        {loading ? (
            <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Cargando...
            </>
        ) : children}
    </button>
);
