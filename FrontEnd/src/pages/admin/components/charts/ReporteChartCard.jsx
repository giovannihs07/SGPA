import { card } from "../../../../components/ui/themeTokens";

export const ReporteChartCard = ({
    titulo,
    subtitulo,
    loading = false,
    vacio = false,
    mensajeVacio = "Sin datos para mostrar",
    altura = 280,
    children,
}) => (
    <div className={`${card} p-5`}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{titulo}</h3>
        {subtitulo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-4">{subtitulo}</p>
        )}
        {!subtitulo && <div className="mb-4" />}

        {loading ? (
            <div className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" style={{ height: altura }} />
        ) : vacio ? (
            <p className="text-sm text-gray-400 italic py-8 text-center">{mensajeVacio}</p>
        ) : (
            <div style={{ height: altura }}>{children}</div>
        )}
    </div>
);
