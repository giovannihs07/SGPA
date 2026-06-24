import { useSuperAdminProductos } from "../../hooks/superadmin/useSuperAdminProductos";
import { MisProductosHeader } from "../docente/components/misProductos/MisProductosHeader";
import { MisProductosKpiGrid } from "../docente/components/misProductos/MisProductosKpiGrid";
import { MisProductosFiltros } from "../docente/components/misProductos/MisProductosFiltros";
import { ProductosTabla } from "../docente/components/misProductos/ProductosTabla";
import { ProductoDetalleModal } from "../docente/components/misProductos/ProductoDetalleModal";
import { MisProductosLoading, MisProductosError } from "../docente/components/misProductos/MisProductosEstados";

export const SuperAdminProductosPage = () => {
    const {
        productos, productosFiltrados, resumen,
        loading, error, refetch,
        busquedaBorrador, setBusquedaBorrador, aplicarBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroSubcategoria, handleFiltroSubcategoria,
        filtroTipo, setFiltroTipo,
        filtroFacultad, setFiltroFacultad,
        filtroPrograma, setFiltroPrograma,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        categoriasDisponibles, subcategoriasDisponibles, tiposDisponibles,
        facultades, programasFiltrados,
        pagina, totalPaginas, pageSize, irPagina,
        abrirDetalle,
        productoDetalle, cerrarDetalle,
        toggleFromDetalle, toggling, togglePublicacion, handleDescargar,
    } = useSuperAdminProductos();

    if (loading) return <MisProductosLoading />;
    if (error)   return <MisProductosError error={error} onRetry={refetch} />;

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            <MisProductosHeader
                onRefresh={refetch}
                title="Productos publicados"
                subtitle="Consulta la producción académica publicada en la plataforma (solo lectura)"
            />
            <MisProductosKpiGrid resumen={resumen} soloPublicados />
            <MisProductosFiltros
                variant="accent"
                busquedaManual
                busquedaBorrador={busquedaBorrador}
                setBusquedaBorrador={setBusquedaBorrador}
                aplicarBusqueda={aplicarBusqueda}
                filtroCategoria={filtroCategoria}
                handleFiltroCategoria={handleFiltroCategoria}
                filtroSubcategoria={filtroSubcategoria}
                handleFiltroSubcategoria={handleFiltroSubcategoria}
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                filtroFacultad={filtroFacultad}
                setFiltroFacultad={setFiltroFacultad}
                filtroPrograma={filtroPrograma}
                setFiltroPrograma={setFiltroPrograma}
                facultades={facultades}
                programasFiltrados={programasFiltrados}
                categoriasDisponibles={categoriasDisponibles}
                subcategoriasDisponibles={subcategoriasDisponibles}
                tiposDisponibles={tiposDisponibles}
                ocultarFiltroEstado
                mostrarFiltroFecha
                mostrarFiltroFacultad
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                setFechaDesde={setFechaDesde}
                setFechaHasta={setFechaHasta}
                filtroCampoFecha={filtroCampoFecha}
                setFiltroCampoFecha={setFiltroCampoFecha}
                placeholderBusqueda="Buscar por producto o docente"
            />
            <ProductosTabla
                productos={productos}
                productosFiltrados={productosFiltrados}
                pagina={pagina}
                totalPaginas={totalPaginas}
                pageSize={pageSize}
                irPagina={irPagina}
                onVer={abrirDetalle}
                onToggle={togglePublicacion}
                toggling={toggling}
                mostrarDocente
                soloVerDetalle
            />

            <ProductoDetalleModal
                producto={productoDetalle}
                toggling={toggling}
                onClose={cerrarDetalle}
                onToggle={toggleFromDetalle}
                onDescargar={handleDescargar}
                permitirEditar={false}
                visorArchivos="publico"
            />
        </div>
    );
};
