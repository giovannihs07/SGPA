import { useSuperAdminProductos } from "../../hooks/superadmin/useSuperAdminProductos";
import { MisProductosHeader } from "../docente/components/misProductos/MisProductosHeader";
import { MisProductosKpiGrid } from "../docente/components/misProductos/MisProductosKpiGrid";
import { MisProductosFiltros } from "../docente/components/misProductos/MisProductosFiltros";
import { ProductosTabla } from "../docente/components/misProductos/ProductosTabla";
import { ProductoDetalleModal } from "../docente/components/misProductos/ProductoDetalleModal";
import { MisProductosLoading, MisProductosError } from "../docente/components/misProductos/MisProductosEstados";

export const AdminProductosPage = () => {
    const {
        productos, productosFiltrados, resumen,
        loading, error, refetch,
        busqueda, setBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroTipo, setFiltroTipo,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        categoriasDisponibles, tiposDisponibles,
        pagina, totalPaginas, pageSize, irPagina,
        abrirDetalle, eliminarProducto,
        toggling, togglePublicacion, handleDescargar,
        productoDetalle, cerrarDetalle, toggleFromDetalle, eliminarFromDetalle,
    } = useSuperAdminProductos();

    if (loading) return <MisProductosLoading />;
    if (error)   return <MisProductosError error={error} onRetry={refetch} />;

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            <MisProductosHeader
                onRefresh={refetch}
                title="Productos publicados"
                subtitle="Consulta y modera la producción académica publicada por los docentes"
            />
            <MisProductosKpiGrid resumen={resumen} soloPublicados />
            <MisProductosFiltros
                busqueda={busqueda} setBusqueda={setBusqueda}
                filtroCategoria={filtroCategoria} handleFiltroCategoria={handleFiltroCategoria}
                filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
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
            />
            <ProductosTabla
                productos={productos}
                productosFiltrados={productosFiltrados}
                pagina={pagina}
                totalPaginas={totalPaginas}
                pageSize={pageSize}
                irPagina={irPagina}
                toggling={toggling}
                onVer={abrirDetalle}
                onEditar={() => {}}
                onToggle={togglePublicacion}
                onDescargar={handleDescargar}
                onEliminar={eliminarProducto}
                mostrarEditar={false}
                mostrarDocente
            />

            <ProductoDetalleModal
                producto={productoDetalle}
                toggling={toggling}
                onClose={cerrarDetalle}
                onToggle={toggleFromDetalle}
                onEliminar={eliminarFromDetalle}
                onDescargar={handleDescargar}
                permitirEditar={false}
            />
        </div>
    );
};
