import { Search, Filter } from "lucide-react";
import { SelectFilter } from "./SelectFilter";
import { TIPO_LABELS, CATEGORIA_LABELS } from "../productoHelpers";
import { FiltroFechaRango } from "../../../../components/ui/FiltroFechaRango";
import { FiltroFacultadPrograma } from "../../../../components/ui/FiltroFacultadPrograma";
import { FiltroTaxonomiaProducto } from "../../../../components/ui/FiltroTaxonomiaProducto";
import { filterBar, filterBarAccent, inputXs, inputIcon, focusRing } from "../../../../components/ui/themeTokens";

const BusquedaInput = ({ value, onChange, placeholder, className = "" }) => (
    <div className={`relative flex-1 min-w-0 ${className}`}>
        <Search size={13} className={inputIcon} aria-hidden="true" />
        <input
            type="search"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label="Buscar productos"
            className={`${inputXs} pl-8 w-full`}
        />
    </div>
);

const FiltrosClasicos = ({
    ocultarFiltroEstado,
    filtroEstado,
    setFiltroEstado,
    filtroCategoria,
    handleFiltroCategoria,
    filtroTipo,
    setFiltroTipo,
    categoriasDisponibles,
    tiposDisponibles,
    mostrarFiltroFecha,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    filtroCampoFecha,
    setFiltroCampoFecha,
}) => (
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
);

const FiltrosAcento = ({
    ocultarFiltroEstado,
    filtroEstado,
    setFiltroEstado,
    filtroCategoria,
    handleFiltroCategoria,
    filtroSubcategoria,
    handleFiltroSubcategoria,
    filtroTipo,
    setFiltroTipo,
    categoriasDisponibles,
    subcategoriasDisponibles,
    tiposDisponibles,
    filtroFacultad,
    setFiltroFacultad,
    filtroPrograma,
    setFiltroPrograma,
    facultades,
    programasFiltrados,
    mostrarFiltroFacultad = false,
    mostrarFiltroFecha,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    filtroCampoFecha,
    setFiltroCampoFecha,
}) => (
    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#ffc20e]/25 dark:border-[#EC7A21]/25 w-full">
        <Filter size={13} className="text-[#EC7A21] dark:text-[#EFB357] shrink-0" aria-hidden="true" />

        <div className="flex flex-wrap items-start gap-2">
            {mostrarFiltroFacultad && (
                <FiltroFacultadPrograma
                    filtroFacultad={filtroFacultad}
                    onFacultadChange={setFiltroFacultad}
                    filtroPrograma={filtroPrograma}
                    onProgramaChange={setFiltroPrograma}
                    facultades={facultades}
                    programasFiltrados={programasFiltrados}
                />
            )}

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

        <FiltroTaxonomiaProducto
            filtroEstado={filtroEstado}
            onEstadoChange={ocultarFiltroEstado ? undefined : setFiltroEstado}
            filtroCategoria={filtroCategoria}
            onCategoriaChange={handleFiltroCategoria}
            filtroSubcategoria={filtroSubcategoria}
            onSubcategoriaChange={handleFiltroSubcategoria}
            filtroTipo={filtroTipo}
            onTipoChange={setFiltroTipo}
            categoriasDisponibles={categoriasDisponibles}
            subcategoriasDisponibles={subcategoriasDisponibles}
            tiposDisponibles={tiposDisponibles}
        />
    </div>
);

export const MisProductosFiltros = ({
    busqueda,
    setBusqueda,
    busquedaBorrador,
    setBusquedaBorrador,
    aplicarBusqueda,
    busquedaManual = false,
    variant = "default",
    filtroEstado,
    setFiltroEstado,
    filtroCategoria,
    handleFiltroCategoria,
    filtroSubcategoria,
    handleFiltroSubcategoria,
    filtroTipo,
    setFiltroTipo,
    categoriasDisponibles,
    subcategoriasDisponibles,
    tiposDisponibles,
    filtroFacultad,
    setFiltroFacultad,
    filtroPrograma,
    setFiltroPrograma,
    facultades,
    programasFiltrados,
    ocultarFiltroEstado = false,
    mostrarFiltroFacultad = false,
    mostrarFiltroFecha = false,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    filtroCampoFecha,
    setFiltroCampoFecha,
    placeholderBusqueda = "Buscar por nombre o descripción…",
}) => {
    const valorBusqueda = busquedaManual ? busquedaBorrador : busqueda;
    const onBusquedaChange = (e) => {
        const value = e.target.value;
        if (busquedaManual) setBusquedaBorrador(value);
        else setBusqueda(value);
    };

    const filtrosProps = {
        ocultarFiltroEstado,
        filtroEstado,
        setFiltroEstado,
        filtroCategoria,
        handleFiltroCategoria,
        filtroSubcategoria,
        handleFiltroSubcategoria,
        filtroTipo,
        setFiltroTipo,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        filtroFacultad,
        setFiltroFacultad,
        filtroPrograma,
        setFiltroPrograma,
        facultades,
        programasFiltrados,
        mostrarFiltroFacultad,
        mostrarFiltroFecha,
        fechaDesde,
        fechaHasta,
        setFechaDesde,
        setFechaHasta,
        filtroCampoFecha,
        setFiltroCampoFecha,
    };

    if (variant === "accent") {
        return (
            <div className={`${filterBarAccent} flex-col items-stretch gap-3`}>
                {busquedaManual ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            aplicarBusqueda?.();
                        }}
                        className="flex gap-2 w-full"
                    >
                        <BusquedaInput
                            value={valorBusqueda}
                            onChange={onBusquedaChange}
                            placeholder={placeholderBusqueda}
                        />
                        <button
                            type="submit"
                            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold
                                bg-[#EC7A21] text-white hover:bg-[#d96a15] transition ${focusRing}`}
                        >
                            Buscar
                        </button>
                    </form>
                ) : (
                    <BusquedaInput
                        value={valorBusqueda}
                        onChange={onBusquedaChange}
                        placeholder={placeholderBusqueda}
                    />
                )}
                <FiltrosAcento {...filtrosProps} />
            </div>
        );
    }

    return (
        <div className={filterBar}>
            <BusquedaInput
                value={valorBusqueda}
                onChange={onBusquedaChange}
                placeholder={placeholderBusqueda}
                className="min-w-45 [&_input]:w-full"
            />
            <FiltrosClasicos {...filtrosProps} />
        </div>
    );
};
