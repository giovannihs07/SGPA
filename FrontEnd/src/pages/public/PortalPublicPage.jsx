import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePublicProductos } from "../../hooks/public/usePublicProductos";
import { usePublicProductoDetalle } from "../../hooks/public/usePublicProductoDetalle";
import { PublicCatalogoLoading, PublicCatalogoError } from "./components/PublicCatalogoEstados";
import { PublicHero } from "./components/PublicHero";
import { PublicCatalogoHeader } from "./components/PublicCatalogoHeader";
import { PublicFiltrosChips } from "./components/PublicFiltrosChips";
import { PublicFiltros } from "./components/PublicFiltros";
import { PublicCategoriaCards } from "./components/PublicCategoriaCards";
import { PublicRecientesSection } from "./components/PublicRecientesSection";
import { PublicDocenteBanner } from "./components/PublicDocenteBanner";
import { ProductosTarjetas } from "./components/ProductosTarjetas";
import { ProductoPublicoDetalleDrawer } from "./components/ProductoPublicoDetalleDrawer";

const scrollACatalogo = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const PortalPublicPage = () => {
    const location = useLocation();

    const {
        productos, productosFiltrados,
        resumen, resumenGlobal, hayFiltrosActivos,
        loading, refrescando, error, refetch,
        busqueda, setBusqueda,
        docenteFiltro, quitarFiltroDocente,
        filtroCategoria, handleFiltroCategoria,
        filtroSubcategoria, handleFiltroSubcategoria,
        filtroFacultad, handleFiltroFacultad, etiquetaFacultad,
        filtroPrograma, handleFiltroPrograma, etiquetaPrograma,
        filtroTipo, setFiltroTipo,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        limpiarFiltros,
        categoriasDisponibles, subcategoriasDisponibles, tiposDisponibles,
        facultades, programasFiltrados,
        pagina, totalPaginas, pageSize, irPagina,
        handleDescargar,
        schema,
    } = usePublicProductos();

    const {
        productoId,
        previewProducto,
        detalleAbierto,
        abrirDetalle,
        cerrarDetalle,
    } = usePublicProductoDetalle(productos);

    const seleccionarCategoria = useCallback((nombre) => {
        handleFiltroCategoria(filtroCategoria === nombre ? "TODAS" : nombre);
        scrollACatalogo();
    }, [handleFiltroCategoria, filtroCategoria]);

    const verTodasCategorias = useCallback(() => {
        handleFiltroCategoria("TODAS");
        scrollACatalogo();
    }, [handleFiltroCategoria]);

    useEffect(() => {
        if (docenteFiltro || location.hash === "#catalogo") {
            scrollACatalogo();
        }
    }, [docenteFiltro, location.hash]);

    const tituloCatalogo = docenteFiltro
        ? "Producción del docente"
        : "Catálogo de productos";

    const subtituloCatalogo = docenteFiltro
        ? (loading
            ? "Cargando productos…"
            : `${resumen.total} producto${resumen.total === 1 ? "" : "s"} publicado${resumen.total === 1 ? "" : "s"} por ${docenteFiltro}`)
        : hayFiltrosActivos
            ? `${resumen.total} resultado${resumen.total === 1 ? "" : "s"} con los filtros actuales`
            : "Productos publicados por docentes de la institución";

    return (
        <>
            <PublicHero
                resumenGlobal={resumenGlobal}
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
                onExplorar={scrollACatalogo}
                onBuscar={scrollACatalogo}
            />

            <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
                {!docenteFiltro && (
                    <PublicCategoriaCards
                        schema={schema}
                        porCategoria={resumenGlobal.porCategoria}
                        filtroCategoria={filtroCategoria}
                        onSelectCategoria={seleccionarCategoria}
                        onVerTodos={verTodasCategorias}
                    />
                )}

                {!docenteFiltro && (
                    <PublicRecientesSection
                        onVer={abrirDetalle}
                        onDescargar={handleDescargar}
                        onVerCatalogo={scrollACatalogo}
                    />
                )}

                <section id="catalogo" className="space-y-5 scroll-mt-4">
                    {docenteFiltro && (
                        <PublicDocenteBanner
                            nombre={docenteFiltro}
                            total={resumen.total}
                            loading={loading}
                            onQuitar={quitarFiltroDocente}
                        />
                    )}

                    <PublicCatalogoHeader
                        title={tituloCatalogo}
                        subtitle={subtituloCatalogo}
                    />

                    <PublicFiltrosChips
                        busqueda={busqueda}
                        setBusqueda={setBusqueda}
                        docenteFiltro={docenteFiltro}
                        quitarFiltroDocente={quitarFiltroDocente}
                        filtroCategoria={filtroCategoria}
                        handleFiltroCategoria={handleFiltroCategoria}
                        filtroSubcategoria={filtroSubcategoria}
                        handleFiltroSubcategoria={handleFiltroSubcategoria}
                        filtroFacultad={filtroFacultad}
                        handleFiltroFacultad={handleFiltroFacultad}
                        etiquetaFacultad={etiquetaFacultad}
                        filtroPrograma={filtroPrograma}
                        handleFiltroPrograma={handleFiltroPrograma}
                        etiquetaPrograma={etiquetaPrograma}
                        filtroTipo={filtroTipo}
                        setFiltroTipo={setFiltroTipo}
                        fechaDesde={fechaDesde}
                        fechaHasta={fechaHasta}
                        setFechaDesde={setFechaDesde}
                        setFechaHasta={setFechaHasta}
                        limpiarFiltros={limpiarFiltros}
                        hayFiltrosActivos={hayFiltrosActivos}
                    />

                    <PublicFiltros
                        busqueda={busqueda}
                        setBusqueda={setBusqueda}
                        docenteFiltro={docenteFiltro}
                        filtroCategoria={filtroCategoria}
                        handleFiltroCategoria={handleFiltroCategoria}
                        filtroSubcategoria={filtroSubcategoria}
                        handleFiltroSubcategoria={handleFiltroSubcategoria}
                        filtroFacultad={filtroFacultad}
                        handleFiltroFacultad={handleFiltroFacultad}
                        etiquetaFacultad={etiquetaFacultad}
                        filtroPrograma={filtroPrograma}
                        handleFiltroPrograma={handleFiltroPrograma}
                        etiquetaPrograma={etiquetaPrograma}
                        filtroTipo={filtroTipo}
                        setFiltroTipo={setFiltroTipo}
                        categoriasDisponibles={categoriasDisponibles}
                        subcategoriasDisponibles={subcategoriasDisponibles}
                        tiposDisponibles={tiposDisponibles}
                        facultades={facultades}
                        programasFiltrados={programasFiltrados}
                        fechaDesde={fechaDesde}
                        fechaHasta={fechaHasta}
                        setFechaDesde={setFechaDesde}
                        setFechaHasta={setFechaHasta}
                        placeholderBusqueda={
                            docenteFiltro
                                ? "Refinar dentro de la producción de este docente…"
                                : "Buscar por nombre, descripción o docente…"
                        }
                    />

                    {error && !loading && (
                        <PublicCatalogoError error={error} onRetry={refetch} />
                    )}

                    {loading ? (
                        <PublicCatalogoLoading />
                    ) : (
                        !error && (
                            <div className={`relative transition-opacity duration-200 ${refrescando ? "opacity-50 pointer-events-none" : ""}`}>
                                {refrescando && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="w-7 h-7 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                <ProductosTarjetas
                                    productos={productos}
                                    productosFiltrados={productosFiltrados}
                                    pagina={pagina}
                                    totalPaginas={totalPaginas}
                                    pageSize={pageSize}
                                    irPagina={irPagina}
                                    onVer={abrirDetalle}
                                    onDescargar={handleDescargar}
                                />
                            </div>
                        )
                    )}
                </section>
            </div>

            {detalleAbierto && (
                <ProductoPublicoDetalleDrawer
                    productoId={productoId}
                    previewProducto={previewProducto}
                    onClose={cerrarDetalle}
                />
            )}
        </>
    );
};
