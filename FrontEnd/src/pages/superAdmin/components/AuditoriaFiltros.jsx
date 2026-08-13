import { Search, RefreshCw } from "lucide-react";
import { inputMd, selectSm, inputIcon, filtroCampoIgual } from "../../../components/ui/themeTokens";
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
        <div className="relative w-full">
            <Search size={16} className={inputIcon} aria-hidden="true" />
            <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por usuario, email o descripción…"
                aria-label="Buscar logs"
                className={`${inputMd} pl-10`}
            />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
            <select
                value={filtroModulo}
                onChange={(e) => setFiltroModulo(e.target.value)}
                aria-label="Filtrar por módulo"
                className={`${selectSm} ${filtroCampoIgual}`}
            >
                {MODULOS_FILTRO.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <select
                value={filtroResultado}
                onChange={(e) => setFiltroResultado(e.target.value)}
                aria-label="Filtrar por resultado"
                className={`${selectSm} ${filtroCampoIgual}`}
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
                        border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 shrink-0
                        hover:text-[#EC7A21] hover:border-[#ffc20e]/40 transition self-stretch"
                >
                    <RefreshCw size={16} />
                </button>
            )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
            <div className={`flex items-center gap-2 ${filtroCampoIgual}`}>
                <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Desde</label>
                <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className={`${selectSm} flex-1 min-w-0`}
                />
            </div>
            <div className={`flex items-center gap-2 ${filtroCampoIgual}`}>
                <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Hasta</label>
                <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className={`${selectSm} flex-1 min-w-0`}
                />
            </div>
        </div>
    </div>
);
