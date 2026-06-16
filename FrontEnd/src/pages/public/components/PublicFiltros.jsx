import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { SelectFilter } from "../../docente/components/misProductos/SelectFilter";
import { TIPO_LABELS, CATEGORIA_LABELS, SUBCATEGORIA_LABELS } from "../../docente/components/productoHelpers";
import { FiltroFechaRango } from "../../../components/ui/FiltroFechaRango";
import { filterBar, inputXs, inputIcon, focusRing } from "../../../components/ui/themeTokens";
import { categoriaBadgeClass, etiquetaCategoria } from "./publicProductoUi";

const ChipCategoria = ({ nombre, activa, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border
            ${activa
                ? "bg-[#EC7A21] text-white border-[#EC7A21]"
                : `${categoriaBadgeClass(nombre)} border-transparent hover:border-[#ffc20e]/50`}`}
    >
        {etiquetaCategoria(nombre)}
    </button>
);

export const PublicFiltros = ({
    busqueda,
    setBusqueda,
    docenteFiltro = "",
    filtroCategoria,
    handleFiltroCategoria,
    filtroSubcategoria,
    handleFiltroSubcategoria,
    filtroFacultad,
    handleFiltroFacultad,
    filtroPrograma,
    handleFiltroPrograma,
    facultades,
    programasFiltrados,
    filtroTipo,
    setFiltroTipo,
    categoriasDisponibles,
    subcategoriasDisponibles,
    tiposDisponibles,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    placeholderBusqueda = "Buscar por nombre, descripción o docente…",
}) => {
    const [avanzadosAbiertos, setAvanzadosAbiertos] = useState(false);

    const categorias = categoriasDisponibles.filter((c) => c !== "TODAS");
    const hayFiltrosAvanzados = filtroFacultad !== "TODAS" || filtroPrograma !== "TODOS"
        || filtroSubcategoria !== "TODAS" || filtroTipo !== "TODOS" || fechaDesde || fechaHasta;

    return (
        <div className={`${filterBar} flex-col items-stretch gap-3`}>
            <div className="relative w-full">
                <Search size={13} className={inputIcon} aria-hidden="true" />
                <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={placeholderBusqueda}
                    aria-label="Buscar productos"
                    className={`${inputXs} pl-8 w-full`}
                />
            </div>

            {categorias.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 shrink-0">
                        Categoría
                    </span>
                    <button
                        type="button"
                        onClick={() => handleFiltroCategoria("TODAS")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border
                            ${filtroCategoria === "TODAS"
                                ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900"
                                : "bg-gray-100 text-gray-600 border-transparent hover:border-gray-300 dark:bg-gray-700 dark:text-gray-300"}`}
                    >
                        Todas
                    </button>
                    {categorias.map((c) => (
                        <ChipCategoria
                            key={c}
                            nombre={c}
                            activa={filtroCategoria === c}
                            onClick={() => handleFiltroCategoria(c)}
                        />
                    ))}
                </div>
            )}

            <div>
                <button
                    type="button"
                    onClick={() => setAvanzadosAbiertos((v) => !v)}
                    aria-expanded={avanzadosAbiertos}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600
                        dark:text-gray-400 hover:text-[#EC7A21] transition ${focusRing}`}
                >
                    {avanzadosAbiertos ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    Más filtros
                    {hayFiltrosAvanzados && !avanzadosAbiertos && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC7A21]" aria-label="Filtros avanzados activos" />
                    )}
                </button>

                {avanzadosAbiertos && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <SelectFilter
                            value={filtroFacultad}
                            onChange={handleFiltroFacultad}
                            aria-label="Filtrar por facultad"
                        >
                            <option value="TODAS">Todas las facultades</option>
                            {facultades.map((f) => (
                                <option key={f.id} value={f.id}>{f.nombre}</option>
                            ))}
                        </SelectFilter>

                        <SelectFilter
                            value={filtroPrograma}
                            onChange={handleFiltroPrograma}
                            aria-label="Filtrar por programa"
                        >
                            <option value="TODOS">Todos los programas</option>
                            {programasFiltrados.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </SelectFilter>

                        <SelectFilter
                            value={filtroSubcategoria}
                            onChange={handleFiltroSubcategoria}
                            aria-label="Filtrar por subcategoría"
                        >
                            {subcategoriasDisponibles.map((s) => (
                                <option key={s} value={s}>
                                    {s === "TODAS" ? "Todas las subcategorías" : (SUBCATEGORIA_LABELS[s] ?? s)}
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

                        <SelectFilter
                            value={filtroCategoria}
                            onChange={handleFiltroCategoria}
                            aria-label="Filtrar por categoría (lista)"
                        >
                            {categoriasDisponibles.map((c) => (
                                <option key={c} value={c}>
                                    {c === "TODAS" ? "Todas las categorías" : (CATEGORIA_LABELS[c] ?? c)}
                                </option>
                            ))}
                        </SelectFilter>

                        <FiltroFechaRango
                            fechaDesde={fechaDesde}
                            fechaHasta={fechaHasta}
                            onDesdeChange={setFechaDesde}
                            onHastaChange={setFechaHasta}
                            mostrarSelectorCampo={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
