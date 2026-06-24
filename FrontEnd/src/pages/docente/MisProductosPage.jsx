import { useNavigate } from "react-router-dom";
import { useMisProductos } from "../../hooks/useMisProductos";
import { intentarEditarProducto } from "./components/misProductos/productoSwal";
import { MisProductosHeader } from "./components/misProductos/MisProductosHeader";
import { MisProductosKpiGrid } from "./components/misProductos/MisProductosKpiGrid";
import { MisProductosFiltros } from "./components/misProductos/MisProductosFiltros";
import { ProductosTabla } from "./components/misProductos/ProductosTabla";
import { ProductoDetalleModal } from "./components/misProductos/ProductoDetalleModal";
import { MisProductosLoading, MisProductosError } from "./components/misProductos/MisProductosEstados";

export const MisProductosPage = () => {
    const navigate = useNavigate();
    const onEditar = (producto) =>
        intentarEditarProducto(producto, (p) =>
            navigate(`/dashboard/docente/productos/${p.id}/editar`),
        );

    const {
        productos, productosFiltrados, resumen,
        loading, error, refetch,
        busqueda, setBusqueda,
        filtroEstado, setFiltroEstado,
        filtroCategoria, handleFiltroCategoria,
        filtroSubcategoria, handleFiltroSubcategoria,
        filtroTipo, setFiltroTipo,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        categoriasDisponibles, subcategoriasDisponibles, tiposDisponibles,
        pagina, totalPaginas, pageSize, irPagina,
        abrirDetalle, eliminarProducto,
        toggling, togglePublicacion, handleDescargar,
        productoDetalle, cerrarDetalle, toggleFromDetalle, eliminarFromDetalle,
    } = useMisProductos();

    if (loading) return <MisProductosLoading />;
    if (error)   return <MisProductosError error={error} onRetry={refetch} />;

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            <MisProductosHeader onRefresh={refetch} />
            <MisProductosKpiGrid resumen={resumen} />
            <MisProductosFiltros
                variant="accent"
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                filtroCategoria={filtroCategoria}
                handleFiltroCategoria={handleFiltroCategoria}
                filtroSubcategoria={filtroSubcategoria}
                handleFiltroSubcategoria={handleFiltroSubcategoria}
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                categoriasDisponibles={categoriasDisponibles}
                subcategoriasDisponibles={subcategoriasDisponibles}
                tiposDisponibles={tiposDisponibles}
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
                onEditar={onEditar}
                onToggle={togglePublicacion}
                onDescargar={handleDescargar}
                onEliminar={eliminarProducto}
            />

            <ProductoDetalleModal
                producto={productoDetalle}
                toggling={toggling}
                onClose={cerrarDetalle}
                onToggle={toggleFromDetalle}
                onEliminar={eliminarFromDetalle}
                onEditar={onEditar}
                onDescargar={handleDescargar}
            />
        </div>
    );
};
