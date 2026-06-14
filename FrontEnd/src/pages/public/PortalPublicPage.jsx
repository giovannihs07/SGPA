import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Library, X } from "lucide-react";
import { getProductoSchema } from "../../services/productoServices";
import { usePublicProductos } from "../../hooks/public/usePublicProductos";
import { MisProductosHeader } from "../docente/components/misProductos/MisProductosHeader";
import { MisProductosFiltros } from "../docente/components/misProductos/MisProductosFiltros";
import { ProductosTabla } from "../docente/components/misProductos/ProductosTabla";
import { MisProductosLoading, MisProductosError } from "../docente/components/misProductos/MisProductosEstados";
import { PublicKpiGrid } from "./components/PublicKpiGrid";
import { PublicCategoriaCards } from "./components/PublicCategoriaCards";
import { ProductosTarjetas } from "./components/ProductosTarjetas";
import { CATEGORIA_LABELS } from "../docente/components/productoHelpers";

const scrollACatalogo = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const PortalPublicPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [schema, setSchema] = useState([]);

    const {
        productos, todosProductos, productosFiltrados,
        resumen, resumenGlobal, hayFiltrosActivos,
        loading, error, refetch,
        busqueda, setBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroTipo, setFiltroTipo,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        limpiarFiltros,
        categoriasDisponibles, tiposDisponibles,
        pagina, totalPaginas, pageSize, irPagina,
        handleDescargar,
    } = usePublicProductos();

    useEffect(() => {
        getProductoSchema()
            .then(setSchema)
            .catch(() => setSchema([]));
    }, []);

    const irADetalle = useCallback(
        (producto) => navigate(`/portal/public/productos/${producto.id}`, {
            state: { fromSearch: location.search },
        }),
        [navigate, location.search],
    );

    const seleccionarCategoria = useCallback((nombre) => {
        handleFiltroCategoria(filtroCategoria === nombre ? "TODAS" : nombre);
        scrollACatalogo();
    }, [handleFiltroCategoria, filtroCategoria]);

    const verTodasCategorias = useCallback(() => {
        handleFiltroCategoria("TODAS");
        scrollACatalogo();
    }, [handleFiltroCategoria]);

    if (loading) return <MisProductosLoading />;
    if (error) return <MisProductosError error={error} onRetry={refetch} />;

    const subtituloCatalogo = hayFiltrosActivos
        ? `${resumen.total} resultado${resumen.total === 1 ? "" : "s"} con los filtros actuales`
        : "Productos publicados por docentes de la institución";

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            <div className="rounded-2xl bg-linear-to-br from-[#ffc20e]/20 via-[#FFB700]/10 to-transparent
                dark:from-[#ffc20e]/10 dark:via-[#FFB700]/5 border border-[#ffc20e]/30 dark:border-[#ffc20e]/20
                px-5 py-6 sm:px-8 sm:py-7">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#222222] flex items-center justify-center shrink-0">
                        <Library size={22} className="text-[#ffc20e]" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Producción académica publicada
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                            Explora y consulta la producción académica de la Universidad de Cartagena
                            disponible para la comunidad.
                        </p>
                    </div>
                </div>
            </div>

            <PublicKpiGrid resumenGlobal={resumenGlobal} />

            <PublicCategoriaCards
                schema={schema}
                productos={todosProductos}
                filtroCategoria={filtroCategoria}
                onSelectCategoria={seleccionarCategoria}
                onVerTodos={verTodasCategorias}
            />

            <section id="catalogo" className="space-y-5 scroll-mt-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <MisProductosHeader
                        onRefresh={refetch}
                        title="Catálogo de productos"
                        subtitle={subtituloCatalogo}
                    />
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                                text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700
                                hover:border-red-300 hover:text-red-600 transition shrink-0"
                        >
                            <X size={13} /> Limpiar filtros
                        </button>
                    )}
                </div>

                {hayFiltrosActivos && filtroCategoria !== "TODAS" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">
                        Categoría:{" "}
                        <span className="font-semibold text-[#EC7A21]">
                            {CATEGORIA_LABELS[filtroCategoria] ?? filtroCategoria}
                        </span>
                    </p>
                )}

                <MisProductosFiltros
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                    filtroCategoria={filtroCategoria}
                    handleFiltroCategoria={handleFiltroCategoria}
                    filtroTipo={filtroTipo}
                    setFiltroTipo={setFiltroTipo}
                    categoriasDisponibles={categoriasDisponibles}
                    tiposDisponibles={tiposDisponibles}
                    ocultarFiltroEstado
                    mostrarFiltroFecha
                    fechaDesde={fechaDesde}
                    fechaHasta={fechaHasta}
                    setFechaDesde={setFechaDesde}
                    setFechaHasta={setFechaHasta}
                    filtroCampoFecha={filtroCampoFecha}
                    setFiltroCampoFecha={setFiltroCampoFecha}
                    placeholderBusqueda="Buscar por nombre, descripción o docente…"
                />

                <div className="hidden md:block">
                    <ProductosTabla
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        pageSize={pageSize}
                        irPagina={irPagina}
                        onVer={irADetalle}
                        onDescargar={handleDescargar}
                        modoPublico
                        mostrarDocente
                    />
                </div>

                <div className="md:hidden">
                    <ProductosTarjetas
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        pageSize={pageSize}
                        irPagina={irPagina}
                        onVer={irADetalle}
                        onDescargar={handleDescargar}
                    />
                </div>
            </section>
        </div>
    );
};
