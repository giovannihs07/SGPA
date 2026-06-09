import { card } from "../../../components/ui/themeTokens";

export const CoberturaDocentePanel = ({ cobertura, notaAtribucion }) => {
    const { totalDocentes, docentesConProduccion, docentesSinProduccion, porcentajeCobertura } = cobertura;
    const pct = Math.min(100, Math.max(0, porcentajeCobertura));

    return (
        <div className={`${card} p-5`}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Cobertura docente en el alcance filtrado
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {notaAtribucion}
            </p>

            <div className="flex flex-wrap items-end gap-6 mb-4">
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{pct}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">con al menos un producto</p>
                </div>
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{docentesConProduccion}</p>
                        <p className="text-xs text-gray-500">Con producción</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{docentesSinProduccion}</p>
                        <p className="text-xs text-gray-500">Sin producción</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{totalDocentes}</p>
                        <p className="text-xs text-gray-500">Docentes en alcance</p>
                    </div>
                </div>
            </div>

            <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};
