export const ReporteChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const fila = payload[0]?.payload ?? {};

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 shadow-md text-xs">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {fila.nombreCompleto ?? fila.nombre ?? fila.etiqueta ?? label}
            </p>
            {payload.map((entry) => (
                <p key={entry.dataKey} className="text-gray-600 dark:text-gray-300">
                    {entry.name}: <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
                    {entry.dataKey === "cobertura" ? "%" : ""}
                </p>
            ))}
            {fila.conProduccion != null && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {fila.conProduccion} de {fila.totalDocentes} docentes
                </p>
            )}
        </div>
    );
};
