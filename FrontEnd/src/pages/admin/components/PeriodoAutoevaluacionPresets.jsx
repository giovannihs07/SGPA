import { btnGhost } from "../../../components/ui/themeTokens";
import { presetPeriodoAutoevaluacion } from "../adminReportesHelpers";

const PRESETS = [
    { id: "4", label: "Últimos 4 años", anios: 4 },
    { id: "6", label: "Últimos 6 años", anios: 6 },
    { id: "1", label: "Año en curso", anios: 0 },
];

export const PeriodoAutoevaluacionPresets = ({ onAplicar, onLimpiar }) => (
    <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Periodo de autoevaluación:
        </span>
        {PRESETS.map(({ id, label, anios }) => (
            <button
                key={id}
                type="button"
                onClick={() => {
                    if (anios === 0) {
                        const y = new Date().getFullYear();
                        onAplicar({ fechaDesde: `${y}-01-01`, fechaHasta: `${y}-12-31` });
                    } else {
                        onAplicar(presetPeriodoAutoevaluacion(anios));
                    }
                }}
                className={`${btnGhost} text-xs px-2.5 py-1 border border-gray-200 dark:border-gray-600`}
            >
                {label}
            </button>
        ))}
        <button
            type="button"
            onClick={onLimpiar}
            className={`${btnGhost} text-xs px-2.5 py-1 text-gray-500`}
        >
            Limpiar fechas
        </button>
    </div>
);
