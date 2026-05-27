import { Search, Filter } from "lucide-react";
import { SelectFilter } from "./SelectFilter";
import { TIPO_LABELS, CATEGORIA_LABELS } from "../productoHelpers";

export const MisProductosFiltros = ({
    busqueda, setBusqueda,
    filtroEstado, setFiltroEstado,
    filtroCategoria, handleFiltroCategoria,
    filtroTipo, setFiltroTipo,
    categoriasDisponibles, tiposDisponibles,
    ocultarFiltroEstado = false,
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 p-4 flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-45">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o descripción…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                    placeholder-gray-300 dark:placeholder-gray-600
                    focus:outline-none focus:ring-2 focus:ring-[#EFB357]/40
                    focus:border-[#EFB357] transition"
            />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-gray-400 shrink-0" />

            {!ocultarFiltroEstado && (
                <SelectFilter value={filtroEstado} onChange={setFiltroEstado}>
                    <option value="TODOS">Todos los estados</option>
                    <option value="PUBLICADO">Publicado</option>
                    <option value="SIN_PUBLICAR">Sin publicar</option>
                </SelectFilter>
            )}

            <SelectFilter value={filtroCategoria} onChange={handleFiltroCategoria}>
                {categoriasDisponibles.map((c) => (
                    <option key={c} value={c}>
                        {c === "TODAS" ? "Todas las categorías" : (CATEGORIA_LABELS[c] ?? c)}
                    </option>
                ))}
            </SelectFilter>

            <SelectFilter value={filtroTipo} onChange={setFiltroTipo}>
                {tiposDisponibles.map((t) => (
                    <option key={t} value={t}>
                        {t === "TODOS" ? "Todos los tipos" : (TIPO_LABELS[t] ?? t)}
                    </option>
                ))}
            </SelectFilter>
        </div>
    </div>
);
