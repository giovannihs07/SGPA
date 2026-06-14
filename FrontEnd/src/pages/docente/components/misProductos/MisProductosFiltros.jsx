import { Search, Filter } from "lucide-react";
import { SelectFilter } from "./SelectFilter";
import { TIPO_LABELS, CATEGORIA_LABELS } from "../productoHelpers";
import { FiltroFechaRango } from "../../../../components/ui/FiltroFechaRango";
import { filterBar, inputXs, inputIcon } from "../../../../components/ui/themeTokens";

export const MisProductosFiltros = ({
    busqueda, setBusqueda,
    filtroEstado, setFiltroEstado,
    filtroCategoria, handleFiltroCategoria,
    filtroTipo, setFiltroTipo,
    categoriasDisponibles, tiposDisponibles,
    ocultarFiltroEstado = false,
    mostrarFiltroFecha = false,
    fechaDesde, fechaHasta,
    setFechaDesde, setFechaHasta,
    filtroCampoFecha, setFiltroCampoFecha,
    placeholderBusqueda = "Buscar por nombre o descripción…",
}) => (
    <div className={filterBar}>
        <div className="relative flex-1 min-w-45">
            <Search size={13} className={inputIcon} aria-hidden="true" />
            <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholderBusqueda}
                aria-label="Buscar productos"
                className={`${inputXs} pl-8`}
            />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />

            {!ocultarFiltroEstado && (
                <SelectFilter value={filtroEstado} onChange={setFiltroEstado} aria-label="Filtrar por estado">
                    <option value="TODOS">Todos los estados</option>
                    <option value="PUBLICADO">Publicado</option>
                    <option value="SIN_PUBLICAR">Sin publicar</option>
                </SelectFilter>
            )}

            <SelectFilter value={filtroCategoria} onChange={handleFiltroCategoria} aria-label="Filtrar por categoría">
                {categoriasDisponibles.map((c) => (
                    <option key={c} value={c}>
                        {c === "TODAS" ? "Todas las categorías" : (CATEGORIA_LABELS[c] ?? c)}
                    </option>
                ))}
            </SelectFilter>

            <SelectFilter value={filtroTipo} onChange={setFiltroTipo} aria-label="Filtrar por tipo">
                {tiposDisponibles.map((t) => (
                    <option key={t} value={t}>
                        {t === "TODOS" ? "Todos los tipos" : (TIPO_LABELS[t] ?? t)}
                    </option>
                ))}
            </SelectFilter>

            {mostrarFiltroFecha && (
                <FiltroFechaRango
                    fechaDesde={fechaDesde}
                    fechaHasta={fechaHasta}
                    onDesdeChange={setFechaDesde}
                    onHastaChange={setFechaHasta}
                    filtroCampo={filtroCampoFecha}
                    onCampoChange={setFiltroCampoFecha}
                />
            )}
        </div>
    </div>
);
