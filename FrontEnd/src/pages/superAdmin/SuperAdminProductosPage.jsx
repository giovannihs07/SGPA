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
        busqueda, setBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroTipo, setFiltroTipo,
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
                subtitle="Consulta la producción académica que los docentes han publicado en la plataforma"
            />
            <MisProductosKpiGrid resumen={resumen} soloPublicados />
            <MisProductosFiltros
                busqueda={busqueda} setBusqueda={setBusqueda}
                filtroCategoria={filtroCategoria} handleFiltroCategoria={handleFiltroCategoria}
                filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
                categoriasDisponibles={categoriasDisponibles}
                tiposDisponibles={tiposDisponibles}
                ocultarFiltroEstado
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
