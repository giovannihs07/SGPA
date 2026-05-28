import { Search, RefreshCw } from "lucide-react";
import { inputSm, selectSm, inputIcon } from "../../../components/ui/themeTokens";
import { MODULOS_FILTRO, RESULTADOS_FILTRO } from "../auditoriaHelpers";

export const AuditoriaFiltros = ({
    busqueda, setBusqueda,
    filtroModulo, setFiltroModulo,
    filtroResultado, setFiltroResultado,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    onRefresh,
}) => (
    <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search size={14} className={inputIcon} aria-hidden="true" />
                <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por usuario, email o descripción…"
                    aria-label="Buscar logs"
                    className={`${inputSm} pl-9`}
                />
            </div>
            <select
                value={filtroModulo}
                onChange={(e) => setFiltroModulo(e.target.value)}
                aria-label="Filtrar por módulo"
                className={selectSm}
            >
                {MODULOS_FILTRO.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <select
                value={filtroResultado}
                onChange={(e) => setFiltroResultado(e.target.value)}
                aria-label="Filtrar por resultado"
                className={selectSm}
            >
                {RESULTADOS_FILTRO.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    title="Actualizar"
                    aria-label="Actualizar listado"
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg border
                        border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400
                        hover:text-[#EC7A21] hover:border-[#ffc20e]/40 transition"
                >
                    <RefreshCw size={16} />
                </button>
            )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Desde</label>
                <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className={`${inputSm} flex-1`}
                />
            </div>
            <div className="flex items-center gap-2 flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Hasta</label>
                <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className={`${inputSm} flex-1`}
                />
            </div>
        </div>
    </div>
);
