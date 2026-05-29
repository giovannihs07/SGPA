export const ProduccionBarrasPanel = ({
    titulo,
    items,
    labelFn,
    loading = false,
    emptyMessage = "Sin datos para mostrar",
    maxItems = 8,
}) => {
    const visibles = items.slice(0, maxItems);
    const max = Math.max(...visibles.map((i) => i.count), 1);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                {titulo}
            </p>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                </div>
            ) : visibles.length === 0 ? (
                <p className="text-sm text-gray-400 italic">{emptyMessage}</p>
            ) : (
                <ul className="space-y-3">
                    {visibles.map(({ key, count }) => {
                        const pct = Math.round((count / max) * 100);
                        return (
                            <li key={key}>
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                                        {labelFn(key)}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                                        {count}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#EC7A21] rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
