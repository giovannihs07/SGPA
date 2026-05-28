const ESTILOS = {
    EXITOSO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    FALLIDO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    CRITICO: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export const ResultadoBadge = ({ resultado, label }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
        ${ESTILOS[resultado] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
        {label}
    </span>
);

export const ModuloBadge = ({ label }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold
        bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]">
        {label}
    </span>
);
