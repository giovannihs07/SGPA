import { SelectFilter } from "../../pages/docente/components/misProductos/SelectFilter";
import {
    CATEGORIA_LABELS,
    SUBCATEGORIA_LABELS,
    TIPO_LABELS,
} from "../../pages/docente/components/productoHelpers";
import { text, filtroGrupo } from "./themeTokens";

export const FiltroTaxonomiaProducto = ({
    filtroEstado,
    onEstadoChange,
    filtroCategoria,
    onCategoriaChange,
    filtroSubcategoria,
    onSubcategoriaChange,
    filtroTipo,
    onTipoChange,
    categoriasDisponibles = [],
    subcategoriasDisponibles = [],
    tiposDisponibles = [],
    agrupado = true,
    ocultarSubcategoria = false,
    className = "",
}) => {
    const controles = (
        <>
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroCategoria}
                    onChange={onCategoriaChange}
                    aria-label="Filtrar por categoría"
                >
                    {categoriasDisponibles.map((c) => (
                        <option key={c} value={c}>
                            {c === "TODAS" ? "Todas las categorías" : (CATEGORIA_LABELS[c] ?? c)}
                        </option>
                    ))}
                </SelectFilter>
            </div>
            {!ocultarSubcategoria && (
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroSubcategoria}
                    onChange={onSubcategoriaChange}
                    aria-label="Filtrar por subcategoría"
                >
                    {subcategoriasDisponibles.map((s) => (
                        <option key={s} value={s}>
                            {s === "TODAS" ? "Todas las subcategorías" : (SUBCATEGORIA_LABELS[s] ?? s)}
                        </option>
                    ))}
                </SelectFilter>
            </div>
            )}
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroTipo}
                    onChange={onTipoChange}
                    aria-label="Filtrar por tipo de producto"
                >
                    {tiposDisponibles.map((t) => (
                        <option key={t} value={t}>
                            {t === "TODOS" ? "Todos los tipos" : (TIPO_LABELS[t] ?? t)}
                        </option>
                    ))}
                </SelectFilter>
            </div>
            {onEstadoChange && (
                <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-40">
                    <SelectFilter
                        value={filtroEstado}
                        onChange={onEstadoChange}
                        aria-label="Filtrar por estado de publicación"
                    >
                        <option value="TODOS">Todos los estados</option>
                        <option value="PUBLICADO">Solo publicados</option>
                        <option value="SIN_PUBLICAR">Sin publicar</option>
                    </SelectFilter>
                </div>
            )}
        </>
    );

    if (!agrupado) {
        return (
            <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
                {controles}
            </div>
        );
    }

    return (
        <fieldset className={`${filtroGrupo} ${className}`}>
            <legend className={`text-[10px] font-bold uppercase tracking-widest ${text.muted} px-1`}>
                Clasificación del producto
            </legend>
            <div className="flex flex-wrap items-center gap-2">
                {controles}
            </div>
        </fieldset>
    );
};
